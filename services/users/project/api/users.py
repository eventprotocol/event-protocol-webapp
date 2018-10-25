from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc

from project.api.models import User
from project.api.utils import authenticate
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
                'data': user.to_json(),
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
        # sanitize eth_address
        eth_address = eth_address.strip()
        eth_address = eth_address.lower()
        user = User.query.filter_by(eth_address=eth_address).first()

        if not user:
            response_object['message'] = 'User does not exist'
            return jsonify(response_object), 404

        else:
            response_object = {
                'status': 'success',
                'data': user.to_json(),
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

@users_blueprint.route('/users/edit', methods=['POST'])
@authenticate
def modify_user_string_fields(resp, post_data):
    """
    Modify user details
    Receives payload
    {
        "auth_token":
        "eth_address":
        'username':
        'email':
        'city_country':
        'tags':
        'about':
    }

    we omit img_src as this will be handled separately
    """
    user = User.query.filter_by(id=resp).first()

    try:
        user.username = post_data.get("username").strip()
    except:
        pass

    try:
        user.email = post_data.get("email").strip()
    except:
        pass

    try:
        user.city_country = post_data.get("city_country").strip()
    except:
        pass

    try:
        user.tags = post_data.get("tags").strip()
    except:
        pass

    try:
        user.about = post_data.get("about").strip()
    except:
        pass

    response_object = {
        'status': 'success',
        'message': 'Details modified'
    }
    return jsonify(response_object), 200
