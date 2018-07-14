from flask import Blueprint, jsonify, request

from project.api.models import User
from project import db

users_blueprint = Blueprint('users', __name__)


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
    post_data = request.get_json()
    eth_address = post_data.get('eth_address')

    db.session.add(User(eth_address))
    db.session.commit()

    response_object = {
        'status': 'success',
        'message': f'{eth_address} was added!'
    }

    return jsonify(response_object), 201
