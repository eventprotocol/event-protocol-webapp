import json
import unittest

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
            self.assertTrue(data['message'] == 'Registration Success')
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


if __name__ == '__main__':
    unittest.main()
