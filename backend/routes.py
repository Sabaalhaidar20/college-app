from flask import Blueprint, request, jsonify, session
from firebase_config import db
from firebase_admin import auth
from google.cloud.firestore_v1.base_query import FieldFilter
from extensions import bcrypt


routes_bp = Blueprint("routes",__name__)


def matchmaking(curr_user, all_users):
    suggested = []                              #list of suggested users

    curr_user_interests = curr_user.get("interests", [])    #get current users interests, empty list if DNE

    for user in all_users:
        if user["id"] == curr_user["id"]:       #skip current user in list of all users

            continue

        
        user_interests = user.get("interests", [])  #if a user doesnt have interests field, create empty list

        common_interests = []                   #keep track of common interests between curr user and each user in database


        for interest in curr_user_interests:

            if interest in user_interests:      #if current user and another user share similar interest

                common_interests.append(interest)   #append to the list of common interests

        count = len(common_interests)               #keep track of the number of similar interests

        if count > 0:                            #if at least one interest in common, add dictionary to list of suggested users
            suggested.append({"user_id": user["id"], 
                              "count": count,
                              "common_interests": common_interests})

    #sort suggested users based on "count" (most common interests)

    #bubble sort to sort by "count" in descending order
    n = len(suggested)
    for i in range(n-1):
        for j in range(n - i - 1):
            if suggested[j]["count"] < suggested[j+1]["count"]:
                suggested[j], suggested[j+1] = suggested[j+1], suggested[j]
    
    return suggested

#route to get list of potential matches
@routes_bp.route("/api/profiles/<user_id>/matches", methods = ["GET"])
def get_matches(user_id):

    if "user_id" not in session or session["user_id"] != user_id:       #make sure user is in session
        return jsonify({"error":"Unauthorized"}), 400

    try:
        users_ref = db.collection("users").stream()                     #get all "user" documents           

        all_users=[]

        found = False

        for doc in users_ref:

            user = doc.to_dict()                              #convert each user doc to python dictionary
            user["id"] = doc.id

            if user_id == user["id"]:                       #if we find the user_id that was passed, we found the current user

                curr_user = user

                found = True

            else:
                all_users.append(user)              #if not current user, add to list of all users

            

        if not found:
            return jsonify({"error": "user not found"}), 404  
         
        suggested = matchmaking(curr_user, all_users)   #call matchmaking algo

        return jsonify(suggested)                       #return list of suggested users

            
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@routes_bp.route("/hello")
def hello():
    return jsonify(message="this is a message from backend!")


#create user test
@routes_bp.route("/api/test", methods=["POST"])
def test():
    try:
        test_data = {
            "name": "Test",
            "email": "test@unt.edu"
        }

        db.collection("users").document("test123").set(test_data)

        return jsonify({"message": "Created Test user"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# NEW REGISTER route
@routes_bp.route("/auth/register", methods=["POST"])
def register():
    
    data = request.json                                                                     #get data

    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not firstName or not lastName or not email or not password:                             #ensure user sends first name, last name, email and a password
        return jsonify({"error":"Missing field (Required: firstName, lastName, email, password)"}), 400
    
    if not (email.endswith("@my.unt.edu") or email.endswith("@unt.edu")):                       #check if user entered UNT email
        return jsonify ({"error":"Email must be a UNT email (@my.unt.edu or @unt.edu)" }), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')               #hash password using bcrypt

    user_ref = db.collection("users")                                                       #create a reference to the current user to later search through firestore

    search = user_ref.where(filter = FieldFilter("email","==",email)).get()                 #search through users looking for the specified email

    if search:                                                                              #if email is found, email is already linked to an existing user
        return jsonify({"error":"User already exists"}), 400
    
    curr_user = user_ref.document()                                                         #Create the user and store in database
    curr_user.set({
        "id": curr_user.id,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
 #      "password": password        #MAKE SECURE
        "password": hashed_password
    })

    session["user_id"] = curr_user.id 

    return jsonify({"message":"Registered user", "user":{"id": curr_user.id}}), 200


# NEW LOGIN route
@routes_bp.route("/auth/login", methods=["POST"])
def login():

    data = request.json                                                                 #get data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:                                                       #ensure email and password are passed
        return jsonify({"error":"Email and password required"}), 400
    
    users_ref = db.collection("users")

    search = users_ref.where("email","==",email).get()                                  #search through users in database using the email that was passed

    if not search:
        return jsonify({"error":"user does not exist"}), 400

    curr_user_doc = search[0]                                                           #get the 1st result of the search (user was found)
    curr_user = curr_user_doc.to_dict()                                                 #turn the found user and their data into a python dictionary    

#    if password != curr_user["password"]:
 #       return jsonify({"error":"incorrect password"}), 400
    if not bcrypt.check_password_hash(curr_user["password"], password):             #check encypted password and make sure user entered correct password
        return jsonify({"error":"Incorrect password"}), 400
    
    session["user_id"] = curr_user_doc.id

    return jsonify({"message":"login successful", "user":{"id":curr_user_doc.id}}), 200


#Current User 
@routes_bp.route("/auth/current_user")
def current_user():

    if "user_id" not in session:
        return jsonify({"error":"user not logged in"}), 400
    
    return jsonify({"user":{"id": session["user_id"]}}),200

#Lougout 
@routes_bp.route("/auth/logout", methods=["POST"])
def logout():
    
    session.clear()                                                                 #clear the current session, user no longer logged in

    return jsonify({"message": "User logged out"}), 200



#OLD register/create user
@routes_bp.route("/api/profiles", methods = ["POST"])
def register_user():

    #get and verify id token
    auth_token = request.headers.get("Authorization")       #request auth header for firebase id token
    if not auth_token:
        return jsonify({"error": "Authorization ID token is missing"}), 401
    
    if not auth_token.startswith("Bearer "):
        return jsonify({"error":"Token has to start with Bearer (valid auth token)"}), 400
    
    try:
        id_token = auth_token.split("Bearer ")[1]           #split string to extract the actual token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']                          #the token is now the uid


    except Exception as e:
        return jsonify({"error":f"Invalid token: {str(e)}"}), 400

    #check if the user already exists
    user_ref = db.collection("users").document(uid)         #create a reference to a user with the uid extracted from the id token
    if user_ref.get().exists:
        return jsonify({"message": "User already exists"}), 200

    #get data to create profile
    data = request.json                                     #request user data
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')

    if not firstname or not lastname or not email:
        return jsonify({"error": "Name and Email required"}), 400
    
    if not (email.endswith("@my.unt.edu") or email.endswith("@unt.edu")):
        return jsonify ({"error":"Email must be a UNT email (@my.unt.edu or @unt.edu)" }), 400

    
    user_ref.set({                                            #set the users name and email
        "firstname": firstname,
        "lastname": lastname,
        "email": email
    })

    return jsonify({"message":"Profile successfully created"}), 201




#OLD login route, Frontend handles actual login via firebase auth, this route simply verifies the id token and checks if user exists
@routes_bp.route("/api/profiles",methods = ["GET"])
def user_login():
    
    #get and verify id token
    auth_token = request.headers.get("Authorization")       #request auth header for firebase id token
    if not auth_token:
        return jsonify({"error": "Authorization ID token is missing"}), 401
    
    if not auth_token.startswith("Bearer "):
        return jsonify({"error":"Token has to start with Bearer (valid auth token)"}), 400
    
    try:
        id_token = auth_token.split("Bearer ")[1]           #split string to extract the actual token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']                          #the token is now the uid


    except Exception as e:
        return jsonify({"error":f"Invalid token: {str(e)}"}), 400

    #check if the user already exists
    user_ref = db.collection("users").document(uid)         #create a reference to a user with the uid extracted from the id token
    if user_ref.get().exists:
        return jsonify({"message": "User does exist"}), 200 #send frontend message confirming user exists
    else:
        return jsonify({"error":"User does not exist"}), 404    #user not found




#Get all docs from the interests collection in firestore database (get all interests)
@routes_bp.route("/api/interests", methods = ["GET"])
def get_interests():

    try:
        interests_ref = db.collection("interests").stream()       #get all documents in the "interests" collection in firestore   

        interests = []                                          #initialize empty list of interests to hold all interest dictionaries in database

        for doc in interests_ref:
            data = doc.to_dict()                           #convert firestore doc to a dictionary
            data["id"] = doc.id                             #include the document id in dictionary as well

            interests.append(data)                             #add dictionary to the list

        return jsonify(interests), 200                           # return the list of interests

    except Exception as e:
        return jsonify({"error":str(e)}),500
    

#Update/add interests
@routes_bp.route("/api/profiles/<user_id>/interests",methods=["PATCH"])
def update_interests(user_id):

    if "user_id" not in session or session["user_id"] != user_id:
        return jsonify({"error":"Unauthorized"}), 400

    data = request.json

    if "interests" not in data:                                     #check if interests were passed
        return jsonify({"error": "Missing field: interests"}), 400
    
    user_ref = db.collection("users").document(user_id)                 #create reference of users data

    user_ref.update({"interests": data["interests"]})               #update interest field in firebase

    return jsonify({"message":"User interests have been updated"}), 200



#Update profile (bio and name for now)  UPDATE AND MAKE SAFER LATER
@routes_bp.route("/api/profiles/<user_id>", methods=["PATCH"])
def update_profile(user_id):

    if "user_id" not in session or session["user_id"] != user_id:
        return jsonify({"error":"Unauthorized"}), 400

    data = request.json
    if "name" not in data and "bio" not in data:
        return jsonify({"error":"Missing fields: name or bio"}), 400
    
    user_ref = db.collection("users").document(user_id)
    user_ref.update(data)

    return jsonify({"message":"Profile successfully updated"}),200

#Get profile 
@routes_bp.route("/api/profiles/<user_id>", methods = ["GET"])
def get_profile(user_id):

    try:
        user_ref = db.collection("users").document(user_id).get()           #create a reference to the user

        if not user_ref.exists():                                            #check if the user exists
            return jsonify({"error": "User not found"}), 404
        
        data = user_ref.to_dict()                                           #convert the users info into python dictionary

        profile = {                                                         #create a dictionary made up of the users data in firestore
            "firstName": data.get("firstName"),
            "lastName" : data.get("lastName"),
            "email": data.get("email"),
            "bio": data.get("bio", ""),                                       #return empty string if no bio
            "interests": data.get("interests", [])                            #return empty list if no interests
        }

        return jsonify(profile), 200                                        #return the users data

    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    