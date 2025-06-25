from flask import Blueprint, request, jsonify
from firebase_config import db
from firebase_admin import auth

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
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({"error": "Name and Email required"}), 400
    
    user_ref.set({                                            #set the users name and email
        "name": name,
        "email": email
    })

    return jsonify({"message":"Profile successfully created"}), 201




#LOGIN route, Frontend handles actual login via firebase auth, this route simply verifies the id token and checks if user exists
@routes_bp.route("/api/profiles",methods = ["GET"])
def login():
    
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