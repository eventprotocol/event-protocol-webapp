import json
import unittest

from project.tests.base import BaseTestCase
from project import db
from project.api.models import User
from project.tests.utils import add_user

signature = '0xca55365c9c00cd84edeaf6e716f6b37672d' \
    + 'f2872e48f5b7d5977551742c8c9de3f71d5c28f016a0' \
    + '752d54d53e0bb0a8b995ab4478aff3bcfcb24324248396e461c'


class TestUserService(BaseTestCase):
    """
    user service test
    """

    def test_users(self):
        """
        check for ping, sanity check
        """
        response = self.client.get('users/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong!', data['message'])
        self.assertIn('success', data['status'])

    def test_single_user(self):
        """
        Ensure that get single user behaves correctly.
        """
        user = add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        db.session.add(user)
        db.session.commit()

        with self.client:
            response = self.client.get(f'/users/id/{user.id}')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn('0x0e35462535dae6fd521f0eea67dc4e9485c714dc',
                          data['data']['eth_address'])
            self.assertIn('success', data['status'])

    def test_single_user_no_id(self):
        """
        Ensure error is thrown if an id is not provided
        """
        with self.client:
            response = self.client.get('/users/id/blah')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('DataError', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_incorrect_id(self):
        """
        Ensure error is thrown if the id does not exist
        """
        with self.client:
            response = self.client.get('/users/id/1337')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_eth_address_nonexist(self):
        """
        Ensure error is thrown if the id does not exist
        """
        with self.client:
            response = self.client.get('/users/eth_address/1337')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_eth_address_exist(self):
        """
        Ensure error is thrown if the id does not exist
        """
        user = add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        db.session.add(user)
        db.session.commit()

        with self.client:
            response = self.client.get(
                '/users/eth_address/'
                + '0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn(
                '0x0e35462535dae6fd521f0eea67dc4e9485c714dc',
                data['data']['eth_address']
            )
            self.assertIn('success', data['status'])

    def test_all_users(self):
        """
        Ensure that all users behave correctly.
        """
        add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        add_user('0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8')

        with self.client:
            response = self.client.get('/users')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['users']), 2)
            self.assertIn(
                '0x0e35462535dae6fd521f0eea67dc4e9485c714dc',
                data['data']['users'][0]['eth_address']
            )
            self.assertIn(
                '0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8',
                data['data']['users'][1]['eth_address']
            )

            self.assertIn('success', data['status'])

    def test_main_no_users(self):
        """
        Ensure we get the desired response if there are no users
        """
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<h1>All Users</h1>', response.data)
        self.assertIn(b'<p>No users!</p>', response.data)

    def test_main_with_users(self):
        """
        Ensure we get the desired reponse if there are users
        """
        add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        add_user('0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8')

        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(
                b'0x0e35462535dae6fd521f0eea67dc4e9485c714dc',
                response.data
            )
            self.assertIn(
                b'0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8',
                response.data
            )

    def test_encode_auth_token(self):
        """
        Ensure that we can encode auth token
        """
        user = add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        """
        Ensure that we can decode auth token
        """
        user = add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertEqual(User.decode_auth_token(auth_token), user.id)

    def test_modify_user_string_fields(self):
        """
        Check if we can modify user data after registration
        """
        with self.client:
            response = self.client.post(
                '/users/auth/register',
                data=json.dumps({
                    'eth_address':
                    '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())

            auth_token = data['auth_token']

            response = self.client.post(
                '/users/edit',
                data=json.dumps({
                    'auth_token': f'{auth_token}',
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'username': 'test',
                    'email': 'test@test.com',
                    'city_country': 'test',
                    'tags': 'test1, test2',
                    'about': 'test',
                    'seller_detail': 'test',
                    'buyer_detail': 'test'
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(
                data['message'] == 'Details modified')

            self.assertEqual(response.status_code, 200)

            # retrieve information about user
            response = self.client.get(f'/users/id/1')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn(
                '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                data['data']['eth_address']
            )
            self.assertIn('test', data['data']['username'])
            self.assertIn('test@test.com', data['data']['email'])
            self.assertIn('test', data['data']['city_country'])
            self.assertEqual(['test1', 'test2'], data['data']['tags'])
            self.assertIn('test', data['data']['about'])
            self.assertIn('test', data['data']['seller_detail'])
            self.assertIn('test', data['data']['buyer_detail'])
            self.assertIn('success', data['status'])



if __name__ == '__main__':
    unittest.main()
