from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from extensions import bcrypt
from firebase_config import db
from routes import routes_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "secondary454")       #UPDATE SECRET KEY

bcrypt.init_app(app)

CORS(app, supports_credentials=True) 

app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run()

#@app.route("/hello")
#def hello():
#    return jsonify(message="this is a message from backend!")