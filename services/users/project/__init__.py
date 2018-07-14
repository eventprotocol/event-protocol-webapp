import os
import datetime
import sys
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

# instantiate app
app = Flask(__name__)

# set config
app_settings = os.getenv("APP_SETTINGS")
app.config.from_object(app_settings)

# instantiate db
db = SQLAlchemy(app)

# model
class User(db.Model):
    __tablename__ = "users"
    idx = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eth_address = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)

    def __init__(self, username, email, eth_address):
        self.username = username
        self.email = email
        self.eth_address = eth_address


# DEBUG
# print(app.config, file=sys.stderr)

@app.route('/users/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })
