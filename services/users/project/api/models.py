from project import db
from flask import current_app
import jwt

import datetime


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eth_address = db.Column(db.String(128), unique=True, nullable=False)
    username = db.Column(db.String(128), unique=True, nullable=True)
    email = db.Column(db.String(128), nullable=True)
    city_country = db.Column(db.String(128), nullable=True)
    _tags = db.Column(db.String(128), nullable=True)
    img_src = db.Column(db.String(256), nullable=True)
    about = db.Column(db.String(500), nullable=True)
    seller_detail = db.Column(db.String(500), nullable=True)
    buyer_detail = db.Column(db.String(500), nullable=True)
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
            'city_country': self.city_country,
            'tags': self.tags,
            'img_src': self.img_src,
            'about': self.about,
            'seller_detail': self.seller_detail,
            'buyer_detail': self.buyer_detail,
            'active': self.active
        }

    @property
    def tags(self):
        try:
            return [x.strip() for x in self._tags.split(',')]
        except AttributeError as e:
            return []

    @tags.setter
    def tags(self, value):
        if value is None or value == "":
            self._tags = ''
        else:
            self._tags = f'{value}'

    def encode_auth_token(self, user_id):
        """
        Generates auth token
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(
                    days=current_app.config.get('TOKEN_EXPIRATION_DAYS'),
                    seconds=current_app.config.get(
                        'TOKEN_EXPIRATION_SECONDS')),
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
            return 'Signature expired please reauthenticate'

        except jwt.InvalidTokenError:
            return 'Invalid token please reauthenticate'
