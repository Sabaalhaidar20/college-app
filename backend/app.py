from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from firebase_config import db
from routes import routes_bp

app = Flask(__name__)
CORS(app) 

app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run()

#@app.route("/hello")
#def hello():
#    return jsonify(message="this is a message from backend!")