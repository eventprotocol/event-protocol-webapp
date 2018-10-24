from functools import wraps

from flask import request, jsonify

from project.api.models import User


def authenticate(f):
    """
    Checks if the user is authenticated
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_object = {
            'status': 'fail',
            'message': 'Please provide a valid auth token'
        }

        # get auth token
        post_data = request.get_json()
        auth_header = post_data.get('auth_token')
        eth_address = post_data.get('eth_address')

        # print()
        # print("=================================")
        # print("auth_header: ", auth_header)
        # print("eth_address: ", eth_address)

        if not auth_header:
            return jsonify(response_object), 403

        if not eth_address:
            response_object = 'Please provide eth address'
            return jsonify(response_object), 401

        auth_token = auth_header.split(" ")[0]
        eth_address = eth_address.split(" ")[0]

        resp = User.decode_auth_token(auth_token)

        if isinstance(resp, str):
            response_object['message'] = resp
            return jsonify(response_object), 401

        user = User.query.filter_by(id=resp).first()

        if not user or not user.active:
            return jsonify(response_object), 401

        if user.eth_address != eth_address.strip().lower():
            return jsonify(response_object), 401

        return f(resp, *args, **kwargs)
    return decorated_function
