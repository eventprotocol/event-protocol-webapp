from project import db

from flask import current_app
import jwt
import io
from PIL import Image
import binascii
import datetime


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eth_address = db.Column(db.String(128), unique=True, nullable=False)
    username = db.Column(db.String(128), unique=True, nullable=True)
    email = db.Column(db.String(128), nullable=True)
    city_country = db.Column(db.String(128), nullable=True)
    _tags = db.Column(db.String(128), nullable=True)
    _chatrooms = db.Column(db.String(256), nullable=True)
    img_src = db.Column(db.String(256), nullable=True)
    img = db.Column(db.LargeBinary(), nullable=True)
    about = db.Column(db.String(500), nullable=True)
    seller_detail = db.Column(db.String(500), nullable=True)
    buyer_detail = db.Column(db.String(500), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    # relationship to chatroom

    def __init__(self, eth_address):
        """
        Initialize user model with eth_address obtained from web3
        """
        self.eth_address = eth_address

    def to_json(self):
        """
        Returns data as a dict to be converted into json
        """
        try:
            byte_img = self.img
            img = Image.open(io.BytesIO(byte_img))
            img_format = img.format.lower()

            # removen new line char
            str_img = binascii.b2a_base64(byte_img)[:-1]
            str_img = str_img.decode('utf-8')
            str_format = "data:image/{};base64, ".format(img_format)
            final_str = str_format + str_img

            return {
                'id': self.id,
                'eth_address': self.eth_address,
                'username': self.username,
                'email': self.email,
                'city_country': self.city_country,
                'tags': self.tags,
                'img_src': self.img_src,
                'img': final_str,
                'about': self.about,
                'seller_detail': self.seller_detail,
                'buyer_detail': self.buyer_detail,
                'active': self.active
            }

        except OSError:
            return {
                'id': self.id,
                'eth_address': self.eth_address,
                'username': self.username,
                'email': self.email,
                'city_country': self.city_country,
                'tags': self.tags,
                'img_src': self.img_src,
                'img': '',
                'about': self.about,
                'seller_detail': self.seller_detail,
                'buyer_detail': self.buyer_detail,
                'active': self.active
            }

    @property
    def tags(self):
        try:
            return [x.strip() for x in self._tags.split(',')]
        except AttributeError:
            return []

    @tags.setter
    def tags(self, value):
        if value is None or value == "":
            self._tags = ''
        else:
            self._tags = f'{value}'

    @property
    def chatrooms(self):
        try:
            return [x.strip() for x in self._chatrooms.split(',')]
        except AttributeError:
            return []

    @chatrooms.setter
    def chatrooms(self, value):
        if value is None or value == "":
            self._chatrooms = ''
        else:
            self._chatrooms = f'{value}'

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


class Chat(db.Model):
    """
    We consider a 2 person chatroom
    """
    __tablename__ = "chat"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chatroom = db.Column(db.Integer, nullable=False)
    eth_address_1 = db.Column(db.String(128), nullable=False)
    username_1 = db.Column(db.String(128), nullable=True)
    id_1 = db.Column(db.Integer, nullable=False)
    eth_address_2 = db.Column(db.String(128), nullable=False)
    username_2 = db.Column(db.String(128), nullable=True)
    id_2 = db.Column(db.Integer, nullable=False)
    message = db.Column(db.String(500), nullable=True)

    # this will be an eth_address
    written_by = db.Column(db.String(128), nullable=True)

    def to_json(self):
        """
        Returns output in json
        """
        return {
            'id': self.id,
            'chatroom': self.chatroom,
            'eth_address_1': self.eth_address_1,
            'username_1': self.username_1,
            'id_1': self.id_1,
            'eth_address_2': self.eth_address_2,
            'username_2': self.username_2,
            'id_2': self.id_2,
            'message': self.message
        }
