from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc
import web3
import jwt

from project.api.models import User
from project import db


users_blueprint = Blueprint('users', __name__, template_folder='./templates')


@users_blueprint.route('/', methods=['GET', 'POST'])
def index():
    """
    For testing purposes, this is overwritten by react
    """
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
            response_object['message'] = 'User does not exist'
            return jsonify(response_object), 404

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
        'message': 'Error'
    }

    try:
        response_object['message'] = 'User does not exist'
        user = User.query.filter_by(eth_address=eth_address).first()

        if not user:
            return jsonify(response_object), 404

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
