from flask import Flask
import firebase_admin 
from firebase_admin import credentials, firestore
import os
import json

firebase_key = os.environ.get("FIREBASE_KEY")
key_dict = json.loads(firebase_key)
cred = credentials.Certificate(key_dict)
firebase_admin.initialize_app(cred)

db = firestore.client()