import json
import unittest

from flask import current_app
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

signature = '0xca55365c9c00cd84edeaf6e716f6b37672d' \
    + 'f2872e48f5b7d5977551742c8c9de3f71d5c28f016a0' \
    + '752d54d53e0bb0a8b995ab4478aff3bcfcb24324248396e461c'


class TestAuthBlueprint(BaseTestCase):
    def test_registration_normal(self):
        """
        Checks if we can properly register a user
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
            self.assertTrue(data['status'] == 'success')
            self.assertIn('Registration Success', data['message'])
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 201)

    def test_registration_duplicate_registration(self):
        """
        Checks if failure is thrown if a duplicate user is added
        """
        add_user("0x0d604c28a2a7c199c7705859c3f88a71cce2acb7")

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
            self.assertTrue(response.status_code == 400)
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('User already exists', data['message'])
            self.assertIn('fail', data['status'])

    def test_registration_invalid_json_empty(self):
        """
        Checks if failure is thrown if a invalid json is given
        """
        with self.client:
            response = self.client.post(
                '/users/auth/register',
                data=json.dumps({}),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_registration_invalid_json_no_eth_address(self):
        """
        Checks if failure is thrown if eth_address is not given
        """
        with self.client:
            response = self.client.post(
                '/users/auth/register',
                data=json.dumps({
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('Eth address error', data['message'])
            self.assertIn('fail', data['status'])

    def test_registration_invalid_json_no_signature(self):
        """
        Checks if failure is thrown if no signature is provided
        """
        with self.client:
            response = self.client.post(
                '/users/auth/register',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('Signed message error', data['message'])
            self.assertIn('fail', data['status'])

    def test_login_normal(self):
        """
        Test if we can login normally
        """
        with self.client:
            add_user("0x0d604c28a2a7c199c7705859c3f88a71cce2acb7")
            response = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 200)
            self.assertIn('success', data['status'])
            self.assertIn('Successfully logged in', data['message'])
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')

    def test_login_not_registered(self):
        """
        Test if error message is thrown if user is not registered
        """
        with self.client:
            response = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 404)
            self.assertIn('fail', data['status'])
            self.assertIn('User does not exist', data['message'])
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')

    def test_login_empty_json(self):
        """
        Test if error message is thrown if user is not registered
        """
        with self.client:
            response = self.client.post(
                '/users/auth/login',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertIn('fail', data['status'])
            self.assertIn('Invalid payload', data['message'])
            self.assertRaises(KeyError, lambda: data['auth_token'])

    def test_login_invalid_json_no_eth_address(self):
        """
        Checks if failure is thrown if eth_address is not given
        """
        with self.client:
            response = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertIn('Eth address error', data['message'])
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('fail', data['status'])

    def test_login_invalid_json_no_signature(self):
        """
        Checks if failure is thrown if no signature is provided
        """
        with self.client:
            response = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertTrue(response.status_code == 400)
            self.assertIn('Signed message error', data['message'])
            self.assertRaises(KeyError, lambda: data['auth_token'])
            self.assertIn('fail', data['status'])

    def test_logout_normal(self):
        """
        Checks if we can logout normally after login
        """
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = 3

        with self.client:
            add_user('0x0d604c28a2a7c199c7705859c3f88a71cce2acb7')

            # user login
            test_login = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            # user logout
            token = json.loads(test_login.data.decode())['auth_token']
            response = self.client.get(
                '/users/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['message'] == 'Successfully logged out')
            self.assertEqual(response.status_code, 200)

    def test_logout_expired_token(self):
        """
        Checks for failure if the token has already expired
        """
        # remove delay in expiration of token
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1

        with self.client:
            add_user('0x0d604c28a2a7c199c7705859c3f88a71cce2acb7')

            # user login
            test_login = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            token = json.loads(test_login.data.decode())['auth_token']
            response = self.client.get(
                '/users/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Signature expired please reauthenticate')

            self.assertEqual(response.status_code, 401)

    def test_logout_invalid_token(self):
        """
        Checks for failure if we try to logout with invalid token
        """
        with self.client:
            response = self.client.get(
                '/users/auth/logout',
                headers={'Authorization': 'Bearer invalid'}
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token please reauthenticate')
            self.assertEqual(response.status_code, 401)

    def test_status_normal(self):
        """
        Checks if we can see status normally
        """
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = 3

        with self.client:
            add_user('0x0d604c28a2a7c199c7705859c3f88a71cce2acb7')

            # user login
            test_login = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            token = json.loads(test_login.data.decode())['auth_token']

            response = self.client.get(
                '/users/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )

            data = json.loads(response.data.decode())

            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data'] is not None)
            self.assertTrue(data['data']['eth_address'] ==
                            '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7')
            self.assertTrue(data['data']['active'] is True)
            self.assertEqual(response.status_code, 200)

    def test_status_expired_token(self):
        """
        Checks for failure if the token has already expired
        """
        # remove delay in expiration of token
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1

        with self.client:
            add_user('0x0d604c28a2a7c199c7705859c3f88a71cce2acb7')

            # user login
            test_login = self.client.post(
                '/users/auth/login',
                data=json.dumps({
                    'eth_address':
                        '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                    'signed_message': signature
                }),
                content_type='application/json'
            )

            token = json.loads(test_login.data.decode())['auth_token']
            response = self.client.get(
                '/users/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Signature expired please reauthenticate')

            self.assertEqual(response.status_code, 401)

    def test_status_invalid_token(self):
        """
        Checks for failure if token is invalid
        """
        with self.client:
            response = self.client.get(
                '/users/auth/status',
                headers={'Authorization': 'Bearer invalid'}
            )

            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token please reauthenticate')
            self.assertEqual(response.status_code, 401)


if __name__ == '__main__':
    unittest.main()
