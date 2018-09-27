from project import db
from flask import current_app
import jwt

import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eth_address = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(128), nullable=True)
    email = db.Column(db.String(128), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)

    def __init__(self, eth_address):
        """
        Initialize user model with eth_address obtained from web3
        """
        self.eth_address = eth_address

    def to_json(self):
        """
        Returns data as a dict to be converted into json
        """
        return {
            'id': self.id,
            'eth_address': self.eth_address,
            'username': self.username,
            'email': self.email,
            'active': self.active,
        }

    def encode_auth_token(self, user_id):
        """
        Generates auth token
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(
                    days=current_app.config.get('TOKEN_EXPIRATION_DAYS'), 
                    seconds=current_app.config.get('TOKEN_EXPIRATION_SECONDS')),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }

            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )

        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token

        :param auth_token: -
        :return: integer | string
        """
        try:
            payload = jwt.decode(
                auth_token, current_app.config.get('SECRET_KEY'))
            return payload['sub']

        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please reauthenticate.'

        except jwt.InvalidTokenError:
            return 'Invalid token. Please reauthenticate.'