from flask import Blueprint, jsonify, request
from sqlalchemy import exc
# from sqlalchemy import or_
import web3

from project.api.models import User
from project.api.utils import authenticate
from project import db

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/users/auth/ping', methods=['GET'])
def ping_pong():
    """
    For sanity checking purposes
    """
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })


@auth_blueprint.route('/users/auth/register', methods=['POST'])
def register():
    """
    Add user to the database
    receives payload

    NOTE We only accept lower case eth address
    {
        "eth_address":
        "message":
    }

    If user already exists sends user exists
    """
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }

    if not post_data:
        return jsonify(response_object), 400

    # Get eth address and sanitize
    eth_address = post_data.get('eth_address')

    if eth_address == '' or eth_address is None:
        response_object['message'] = "Eth address error"
        return jsonify(response_object), 400

    eth_address = eth_address.strip()
    eth_address = eth_address.lower()

    # Get signed message and sanitize
    signed_message = post_data.get('signed_message')
    if signed_message == '' or signed_message is None:
        response_object['message'] = "Signed message error"
        return jsonify(response_object), 400

    signed_message = signed_message.strip()

    # recover contents of message hash
    # sha3('EventProtocol') =
    # '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'
    acc = web3.eth.Account()

    message_hash = \
        '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'

    sign_eth_addr = acc.recoverHash(message_hash, signature=signed_message)

    # check if addresses match, otherwise send error
    if sign_eth_addr.lower() != eth_address:
        response_object['message'] = "Invalid signature"
        return jsonify(response_object), 400

    try:
        user = User.query.filter_by(eth_address=eth_address).first()

        # if eth address does not exist we add the entry
        if not user:
            user = User(eth_address=eth_address)

            # insert user
            db.session.add(user)
            db.session.commit()

            # generate auth token
            auth_token = user.encode_auth_token(user.id)
            # print()
            # print('DEBUG: Registration')
            # print("user id = ", user.id)

            response_object['status'] = 'success'
            response_object['message'] = 'Registration Success'
            response_object['auth_token'] = auth_token.decode()

            # send a jwt token for authentication error message

            return jsonify(response_object), 201

        # If the eth address exists sends and
        else:
            response_object['message'] = 'User already exists'
            return jsonify(response_object), 400

    # Throw integrityError if this does not work
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify(response_object), 400


@auth_blueprint.route('/users/auth/login', methods=['POST'])
def login():
    """
    login user and sends jwt token upon valid signed message

    NOTE We only accept lower case eth address
    {
        "eth_address":
        "message":
    }
    """
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }

    if not post_data:
        return jsonify(response_object), 400

    # Get eth address and sanitize
    eth_address = post_data.get('eth_address')

    if eth_address == '' or eth_address is None:
        response_object['message'] = "Eth address error"
        return jsonify(response_object), 400

    eth_address = eth_address.strip()
    eth_address = eth_address.lower()

    # Get signed message and sanitize
    signed_message = post_data.get('signed_message')
    if signed_message == '' or signed_message is None:
        response_object['message'] = "Signed message error"
        return jsonify(response_object), 400

    signed_message = signed_message.strip()

    # recover contents of message hash
    # sha3('EventProtocol')
    # = '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'
    acc = web3.Account()

    message_hash = \
        '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'

    sign_eth_addr = acc.recoverHash(message_hash, signature=signed_message)

    # check if addresses match, otherwise send error
    if sign_eth_addr.lower() != eth_address.lower():
        response_object['message'] = "Invalid signature"
        return jsonify(response_object), 400

    try:
        user = User.query.filter_by(eth_address=eth_address).first()

        # if eth address does not exist we add the entry
        if user:
            # generate auth token
            auth_token = user.encode_auth_token(user.id)

            response_object['status'] = 'success'
            response_object['message'] = 'Successfully logged in'
            response_object['auth_token'] = auth_token.decode()

            # send a jwt token for authentication error message
            return jsonify(response_object), 200

        else:
            response_object['message'] = 'User does not exist'
            return jsonify(response_object), 404

    # Throw integrityError if this does not work
    except Exception as e:
        print(e)
        response_object['message'] = "Try again"
        return jsonify(response_object), 500


@auth_blueprint.route('/users/auth/logout', methods=['GET'])
@authenticate
def logout(resp):
    """
    REQUIRES AUTH
    Logout from current session
    """
    # default fail message
    response_object = {
        'status': 'success',
        'message': 'Successfully logged out'
    }

    return jsonify(response_object), 200


@auth_blueprint.route('/users/auth/status', methods=['GET'])
@authenticate
def status(resp):
    """
    REQUIRES AUTH
    Get status for the current user

    receives payload
    {
        "eth_address":
        "jwt_token":
    }

    If jwt token is invalid or does not exist return failure
    """
    user = User.query.filter_by(id=resp).first()
    response_object = {
        'status': 'success',
        'message': 'success',
        'data': user.to_json()
    }
    return jsonify(response_object), 200
