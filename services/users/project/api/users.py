from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc
from sqlalchemy.sql.expression import func

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


@users_blueprint.route('/users/page/filter_by_id/<number>', methods=['GET'])
def get_users_page_by_id(number):
    """
    Get user to display on page
    Limit to 6 users per page
    """
    response_object = {
        'status': 'fail',
        'message': 'Error'
    }

    try:
        number = int(number)
        # get the page according to the number
        page_data = []
        for x in range(1 + (number-1)*6, number*6+1):
            try:
                page_data.append(User.query.get(x).to_json())
            except AttributeError:
                # if we get a NoneType error means no value exist
                break

        # get max number of pages
        max_id = db.session.query(func.max(User.id)).first()[0]
        page_total = max_id // 6
        if max_id % 6 > 0:
            page_total += 1

        response_object = {
            'status': 'success',
            'data': {
                'users': page_data,
                'page_total': page_total
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

    except AttributeError:
        return jsonify(response_object), 404


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
        'seller_detail':
        'buyer_detail':
    }

    we omit img_src as this will be handled separately
    """
    user = User.query.filter_by(id=resp).first()

    try:
        username = post_data.get('username')
        if username is None:
            user.username = ''
        else:
            user.username = username.strip()
    except AttributeError:
        pass

    try:
        email = post_data.get('email')
        if email is None:
            user.email = ''
        else:
            user.email = email.strip()
    except AttributeError:
        pass

    try:
        city_country = post_data.get('city_country')
        if city_country is None:
            user.city_country = ''
        else:
            user.city_country = city_country.strip()
    except AttributeError:
        pass

    try:
        tags = post_data.get('tags')
        if tags is None:
            user.tags = ''
        else:
            user.tags = tags.strip()
    except AttributeError:
        pass

    try:
        about = post_data.get('about')
        if about is None:
            user.about = ''
        else:
            user.about = about.strip()
    except AttributeError:
        pass

    try:
        seller_detail = post_data.get('seller_detail')
        if seller_detail is None:
            user.seller_detail = ''
        else:
            user.seller_detail = seller_detail.strip()
    except AttributeError:
        pass

    try:
        buyer_detail = post_data.get('buyer_detail')
        if buyer_detail is None:
            user.buyer_detail = ''
        else:
            user.buyer_detail = buyer_detail.strip()
    except AttributeError:
        pass

    response_object = {
        'status': 'success',
        'message': 'Details modified'
    }
    return jsonify(response_object), 200
