import json
import unittest

from project.tests.base import BaseTestCase
from project import db
from project.api.models import User


def add_user(eth_address):
    """
    Helper function
    """
    user = User(eth_address=eth_address)
    db.session.add(user)
    db.session.commit()
    return user


class TestUserService(BaseTestCase):
    """
    user service test
    """

    def test_users(self):
        """
        check for ping
        """
        response = self.client.get('users/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong!', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user(self):
        """
        Ensure that users can be added to database successfully
        """
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'eth_address': '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC'
                }),
                content_type='application/json',
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn(
                '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC was added!',
                data['message']
            )
            self.assertIn('success', data['status'])

    def test_add_user_invalid_json(self):
        """
        Ensure that error is thrown when json object is empty
        """
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json',
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_json_keys(self):
        """
        Ensure that error is thrown is the JSON object does not have
        eth address
        """
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'eth_address': ''
                }),
                content_type='application/json',
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_duplicate_eth_address(self):
        """
        Ensure that error is thrown if the eth_address already exists
        """
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'eth_address': '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC'
                }),
                content_type='application/json',
            )

            response = self.client.post(
                '/users',
                data=json.dumps({
                    'eth_address': '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC'
                }),
                content_type='application/json',
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That eth address already exists.', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user(self):
        """
        Ensure that get single user behaves correctly.
        """
        user = add_user('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC')
        db.session.add(user)
        db.session.commit()

        with self.client:
            response = self.client.get(f'/users/{user.id}')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC',
                          data['data']['eth_address'])
            self.assertIn('success', data['status'])

    def test_single_user_no_id(self):
        """
        Ensure error is thrown if an id is not provided
        """
        with self.client:
            response = self.client.get('/users/blah')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_incorrect_id(self):
        """
        Ensure error is thrown if the id does not exist
        """
        with self.client:
            response = self.client.get('/users/1337')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_all_users(self):
        """
        Ensure that all users behave correctly.
        """
        add_user('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC')
        add_user('0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8')

        with self.client:
            response = self.client.get('/users')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['users']), 2)
            self.assertIn(
                '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC',
                data['data']['users'][0]['eth_address']
            )
            self.assertIn(
                '0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8',
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
        add_user('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC')
        add_user('0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8')

        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(
                b'0x0E35462535daE6fd521f0Eea67dc4e9485C714dC',
                response.data
            )
            self.assertIn(
                b'0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8',
                response.data
            )

    def test_main_add_user(self):
        """
        Ensure we get the desired response if there are no users
        """
        with self.client:
            response = self.client.post(
                '/',
                data=dict(
                    eth_address='0x1948072CD04b93F4a8BAFaaEf8B19166F03AF8d6'
                ),
                follow_redirects=True
            )

            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(
                b'0x1948072CD04b93F4a8BAFaaEf8B19166F03AF8d6',
                response.data
            )


if __name__ == '__main__':
    unittest.main()
