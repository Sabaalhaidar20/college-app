from flask import Blueprint, request, jsonify, session
from firebase_config import db
from firebase_admin import auth
from google.cloud.firestore_v1.base_query import FieldFilter


routes_bp = Blueprint("routes",__name__)


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
    
    data = request.json

    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not firstName or not lastName or not email or not password:
        return jsonify({"error":"Missing field (Required: firstName, lastName, email, password)"}), 400
    
    user_ref = db.collection("users")

    search = user_ref.where(filter = FieldFilter("email","==",email)).get()

    if search:
        return jsonify({"error":"User already exists"}), 400
    
    curr_user = user_ref.document()
    curr_user.set({
        "id": curr_user.id,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password        #MAKE SECURE
    })

    session["user_id"] = curr_user.id 

    return jsonify({"message":"Registered user", "user":{"id": curr_user.id}}), 200


# NEW LOGIN route
@routes_bp.route("/auth/login", methods=["POST"])
def login():

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error":"Email and password required"}), 400
    
    users_ref = db.collection("users")

    search = users_ref.where("email","==",email).get()

    if not search:
        return jsonify({"error":"user does not exist"}), 400

    curr_user_doc = search[0]
    curr_user = curr_user_doc.to_dict()

    if password != curr_user["password"]:
        return jsonify({"error":"incorrect password"}), 400
    
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
    
    session.clear()

    return jsonify({"message": "User logged out"}), 200



#register/create user
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
    
    user_ref.set({                                            #set the users name and email
        "firstname": firstname,
        "lastname": lastname,
        "email": email
    })

    return jsonify({"message":"Profile successfully created"}), 201




#LOGIN route, Frontend handles actual login via firebase auth, this route simply verifies the id token and checks if user exists
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

