from flask import Blueprint, request, jsonify
from firebase_config import db

routes_bp = Blueprint("routes",__name__)

#@app.route("/hello")
#def hello():
#    return jsonify(message="this is a message from backend!")

@routes_bp.route("/hello")
def hello():
    return jsonify(message="this is a message from backend!")
