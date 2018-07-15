from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc

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
    Add user in to database
    """
    post_data = request.get_json()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }

    if not post_data:
        return jsonify(response_object), 400

    eth_address = post_data.get('eth_address')

    eth_address = eth_address.strip()

    if eth_address == '':
        return jsonify(response_object), 400

    try:
        user = User.query.filter_by(eth_address=eth_address).first()

        if not user:
            db.session.add(User(eth_address=eth_address))
            db.session.commit()
            response_object['status'] = 'success'
            response_object['message'] = f'{eth_address} was added!'
            return jsonify(response_object), 201

        else:
            response_object['message'] = \
                'Sorry. That eth address already exists.'
            return jsonify(response_object), 400

    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify(response_object), 400


@users_blueprint.route('/users/<user_id>', methods=['GET'])
def get_single_user(user_id):
    """
    Get single user details
    """
    response_object = {
        'status': 'fail',
        'message': 'User does not exist'
    }

    try:
        user = User.query.filter_by(id=user_id).first()

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
        return jsonify(response_object), 404

    except exc.DataError:
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
