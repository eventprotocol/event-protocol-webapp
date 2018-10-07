from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc
import web3
import jwt

from project.api.models import User
from project import db


users_blueprint = Blueprint('users', __name__, template_folder='./templates')


@users_blueprint.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        eth_address = request.form['eth_address']
        db.session.add(User(eth_address=eth_address))
        db.session.commit()

    users = User.query.all()
    return render_template('index.html', users=users)


@users_blueprint.route('/users/ping', methods=['GET'])
def ping_pong():
    """
    For sanity checking purposes
    """
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })


@users_blueprint.route('/users', methods=['POST'])
def add_user():
    """
    Checks if signature is valid then
    Add user into database.
    OR
    Logins if user is already in database
    """
    # Get json post request
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }

    # if post data is None, return error
    if not post_data:
        return jsonify(response_object), 400

    # get eth_address and sanitize
    eth_address = post_data.get('eth_address')
    if eth_address == '' or eth_address == None:
        response_object['message'] = "Eth address error"
        return jsonify(response_object), 400

    eth_address = eth_address.strip()

    # get signed message
    # TODO to add a nonce, this is vulnerable to replay attacks
    # to check implementation of recoverHash
    signed_message = post_data.get('signed_message')
    if signed_message == '' or signed_message == None:
        response_object['message'] = "Signed message error"
        return jsonify(response_object), 400

    signed_message = signed_message.strip()

    # verify signed messag
    acc = web3.eth.Account()

    # sha3('EventProtocol') = '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'
    message_hash = '0x10dc127b5f076691f4dcf6b485d12179195cbe70e226dce5c333254592dca71e'

    sign_eth_addr = acc.recoverHash(message_hash, signature=signed_message)

    # check if addresses match, otherwise send error
    if sign_eth_addr != eth_address:
        response_object['message'] = "Invalid signature"
        return jsonify(response_object), 400

    # if eth address is an empty string return error


    # add eth address to database
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

            response_object['status'] = 'success'
            response_object['message'] = f'{eth_address} was added!'
            response_object['auth_token'] = auth_token.decode()

            # send a jwt token for authentication 

            return jsonify(response_object), 201

        # If the eth address exists login
        else:
            auth_token = user.encode_auth_token(user.id)
            response_object = {
                'status': 'success',
                'data': {
                    'id': user.id,
                    'eth_address': user.eth_address,
                    'active': user.active,
                    'message': 'Welcome back'
                },
                'auth_token': auth_token.decode()
            }

            # sent a jwt token for authentication

            return jsonify(response_object), 200

    # Throw integrityError if this does not work
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify(response_object), 400


@users_blueprint.route('/users/id/<user_id>', methods=['GET'])
def get_single_user_by_id(user_id):
    """
    Get single user details
    """
    response_object = {
        'status': 'fail',
        'message': 'Error'
    }

    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            response_object = {
                'status': 'success',
                'data': {
                    'message': 'User account not found'
                }
            }            
            return jsonify(response_object), 200

        else:
            response_object = {
                'status': 'success',
                'data': {
                    'id': user.id,
                    'eth_address': user.eth_address,
                    'active': user.active
                }
            }

            return jsonify(response_object), 200

    except ValueError:
        response_object['message'] = \
            'ValueError'
        return jsonify(response_object), 404

    except exc.DataError:
        response_object['message'] = \
            'DataError'        
        return jsonify(response_object), 404


@users_blueprint.route('/users/eth_address/<eth_address>', methods=['GET'])
def get_single_user_by_eth_address(eth_address):
    """
    Get single user details
    """
    response_object = {
        'status': 'fail',
        'message': 'User does not exist'
    }

    try:
        user = User.query.filter_by(eth_address=eth_address).first()

        if not user:
            response_object = {
                'status': 'success',
                'data': {
                    'message': 'User account not found'
                }
            }            
            return jsonify(response_object), 200

        else:
            response_object = {
                'status': 'success',
                'data': {
                    'id': user.id,
                    'eth_address': user.eth_address,
                    'active': user.active
                }
            }

            return jsonify(response_object), 200

    except ValueError:
        response_object['message'] = \
            'ValueError'
        return jsonify(response_object), 404

    except exc.DataError:
        response_object['message'] = \
            'DataError'        
        return jsonify(response_object), 404


@users_blueprint.route('/users', methods=['GET'])
def get_all_users():
    """
    Get all users
    To make this an admin function
    """
    response_object = {
        'status': 'success',
        'data': {
            'users': [user.to_json() for user in User.query.all()]
        }
    }

    return jsonify(response_object), 200
