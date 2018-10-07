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
        print(auth_token)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        """
        Ensure that we can decode auth token
        """
        user = add_user('0x0e35462535dae6fd521f0eea67dc4e9485c714dc')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertEqual(User.decode_auth_token(auth_token), user.id)


if __name__ == '__main__':
    unittest.main()
