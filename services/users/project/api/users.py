from flask import Blueprint, jsonify, request, render_template
from sqlalchemy import exc
from sqlalchemy.sql.expression import func
import binascii
from PIL import Image
import io
import urllib
import os
import json

from project.api.models import User  # , Chat
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
    except AttributeError as e:
        print("AttributeError at username:", e)
        pass

    try:
        email = post_data.get('email')
        if email is None:
            user.email = ''
        else:
            user.email = email.strip()
    except AttributeError as e:
        print("AttributeError at email:", e)
        pass

    try:
        city_country = post_data.get('city_country')
        if city_country is None:
            user.city_country = ''
        else:
            user.city_country = city_country.strip()
    except AttributeError as e:
        print("AttributeError at city_country:", e)
        pass

    try:
        tags = post_data.get('tags')
        if tags is None:
            user.tags = ''
        else:
            user.tags = tags.strip()
    except AttributeError as e:
        print("AttributeError at tags:", e)
        pass

    try:
        about = post_data.get('about')
        if about is None:
            user.about = ''
        else:
            user.about = about.strip()
    except AttributeError as e:
        print("AttributeError at about:", e)
        pass

    try:
        seller_detail = post_data.get('seller_detail')
        if seller_detail is None:
            user.seller_detail = ''
        else:
            user.seller_detail = seller_detail.strip()
    except AttributeError as e:
        print("AttributeError at seller_detail:", e)
        pass

    try:
        buyer_detail = post_data.get('buyer_detail')
        if buyer_detail is None:
            user.buyer_detail = ''
        else:
            user.buyer_detail = buyer_detail.strip()
    except AttributeError as e:
        print("AttributeError at buyer_detail:", e)
        pass

    db.session.commit()

    response_object = {
        'status': 'success',
        'message': 'Details modified'
    }
    return jsonify(response_object), 200


@users_blueprint.route('/users/upload', methods=['POST'])
@authenticate
def upload_user_img(resp, post_data):
    """
    Modify user image
    Receives payload
    {
        "auth_token":
        "eth_address":
        "img": base64 encoding image
    }

    To store image in db, this is not an optimal solution
    Better to store in aws s3 for example. We will want
    to reduce loads on db.
    """
    # get image from from post_data
    response_object = {
        'status': 'fail',
        'message': 'Error'
    }

    try:
        user = User.query.filter_by(id=resp).first()
        str_img = post_data.get("img").strip().split(',')[1]
        byte_img = binascii.a2b_base64(str_img)

        # use Image open to determine if image file
        Image.open(io.BytesIO(byte_img))

        # # convert image to jpeg if not image
        # if image.format != 'JPEG':
        #     rgb_image = image.convert('RGB')

        user.img = byte_img
        user.img_src = resp
        db.session.commit()

        response_object = {
            'status': 'success',
            'message': 'Upload success'
        }
        return jsonify(response_object), 200

    except OSError:
        response_object['message'] = \
            'Invalid file'
        return jsonify(response_object), 400
    except binascii.Error:
        response_object['message'] = \
            'Invalid file'
        return jsonify(response_object), 400
    except exc.DataError:
        response_object['message'] = \
            'DataError'
        return jsonify(response_object), 400
    except exc.DatabaseError:
        response_object['message'] = \
            'DatabaseError'
        return jsonify(response_object), 400


@users_blueprint.route('/users/image/<user_id>', methods=['GET'])
@authenticate
def view_user_img(user_id):
    """
    Convert image jpeg and send as json
    Only accept jpeg for now
    """
    # get image from from post_data
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
            byte_img = user.img
            img = Image.open(io.BytesIO(byte_img))
            img_format = img.format.lower()

            # removen new line char
            str_img = binascii.b2a_base64(byte_img)[:-1]
            str_img = str_img.decode('utf-8')
            str_format = "data:image/{};base64, ".format(img_format)
            final_str = str_format + str_img

            response_object = {
                'status': 'success',
                'data': final_str
            }

            return jsonify(response_object), 200

    except ValueError:
        response_object['message'] = \
            'ValueError'
        return jsonify(response_object), 404
    except OSError:
        response_object['message'] = \
            'Invalid file'
        return jsonify(response_object), 400
    except binascii.Error:
        response_object['message'] = \
            'Invalid file'
        return jsonify(response_object), 400
    except exc.DataError:
        response_object['message'] = \
            'DataError'
        return jsonify(response_object), 400
    except exc.DatabaseError:
        response_object['message'] = \
            'DatabaseError'
        return jsonify(response_object), 400


# @users_blueprint.route('/users/chatroom/make', methods=['POST'])
# @authenticate
# def make_chatroom(resp, post_data):
#     """
#     {
#         eth_address:
#         auth_token:
#         other_id:
#     }
#     """
#     try:
#         user1 = User.query.filter_by(id=resp).first()
#         user2 = User.query.filter_by(id=other_id).first()

#         if not user1:
#             response_object['message'] = 'User1 does not exist'
#             return jsonify(response_object), 404

#         elif not user2:
#             response_object['message'] = 'User2 does not exist'
#             return jsonify(response_object), 404

#         else:

#             byte_img = user.img
#             img = Image.open(io.BytesIO(byte_img))
#             img_format = img.format.lower()

#             # removen new line char
#             str_img = binascii.b2a_base64(byte_img)[:-1]
#             str_img = str_img.decode('utf-8')
#             str_format = "data:image/{};base64, ".format(img_format)
#             final_str = str_format + str_img

#             response_object = {
#                 'status': 'success',
#                 'data': final_str
#             }

#             return jsonify(response_object), 200

#     except AttributeError:
#         response_object['message'] = \
#             'AttributeError'
#         return jsonify(response_object), 404

#     except ValueError:
#         response_object['message'] = \
#             'ValueError'
#         return jsonify(response_object), 404

#     except exc.DataError:
#         response_object['message'] = \
#             'DataError'
#         return jsonify(response_object), 400

#     except exc.DatabaseError:
#         response_object['message'] = \
#             'DatabaseError'
#         return jsonify(response_object), 400


@users_blueprint.route('/users/transactions/contract', methods=['GET'])
def get_contract_transactions():
    """
    Returns all transactions on the contract
    """
    api = os.environ.get('API_KEY_1')
    contract_address = '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6'

    url = "http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address={}&startblock=0&endblock=99999999&sort=asc&apikey={}".format(contract_address, api)  # NOQA

    try:
        with urllib.request.urlopen(url) as url:
            data = json.loads(url.read().decode())

            return jsonify({'status': 'success',
                            'data': data['result']})

    # TODO add more granular exceptions
    except Exception as e:
        print(e)
        return jsonify({'status': 'fail',
                        'message': 'Error'}), 400


@users_blueprint.route('/users/transactions/<eth_address>', methods=['GET'])
def get_user_transactions(eth_address):
    """
    Returns all transaction by user
    """
    api = os.environ.get('API_KEY_1')
    address = eth_address

    try:
        with urllib.request.urlopen("http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address={}&startblock=0&endblock=99999999&sort=asc&apikey={}".format(address, api)) as url:  # NOQA
            data = json.loads(url.read().decode())

            return jsonify({'status': 'success',
                            'data': data['result']})

    # TODO add more granular exceptions
    except Exception as e:
        print(e)
        return jsonify({'status': 'fail',
                        'message': 'Error'}), 400
