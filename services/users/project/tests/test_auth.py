import json

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

signature = '0xca55365c9c00cd84edeaf6e716f6b37672df2872e48f5b7d5977551742c8c9de3f71d5c28f016a0752d54d53e0bb0a8b995ab4478aff3bcfcb24324248396e461c'


class TestAuthBlueprint(BaseTestCase):
    def test_user_registration(self):
        """
        Checks if we can properly register a user
        """
        response = self.client.post(
            'auth/register',
            data=json.dumps({
                'eth_address': '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
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

    def test_duplicate_registration(self):
        """
        Checks if failure is thrown if a duplicate user is added
        """
        add_user("0x0d604c28a2a7c199c7705859c3f88a71cce2acb7")

        response = self.client.post(
            'auth/register',
            data=json.dumps({
                'eth_address': '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
                'signed_message': signature
            }),
            content_type='application/json'
        )

        data = json.loads(response.data.decode())
        self.assertTrue(response.status_code == 400)
        self.assertIn('User already exists', data['message'])
        self.assertIn('fail', data['status'])

    def test_invalid_json_empty(self):
        """
        Checks if failure is thrown if a invalid json is given
        """

        response = self.client.post(
            'auth/register',
            data=json.dumps({}),
            content_type='application/json'
        )

        data = json.loads(response.data.decode())
        self.assertTrue(response.status_code == 400)
        self.assertIn('Invalid payload', data['message'])
        self.assertIn('fail', data['status'])

    def test_invalid_json_no_eth_address(self):
        """
        Checks if failure is thrown if eth_address is not given
        """

        response = self.client.post(
            'auth/register',
            data=json.dumps({
                'signed_message': signature
            }),
            content_type='application/json'
        )

        data = json.loads(response.data.decode())
        self.assertTrue(response.status_code == 400)
        self.assertIn('Invalid payload', data['message'])
        self.assertIn('fail', data['status'])

    def test_invalid_json_no_signature(self):
        """
        Checks if failure is thrown if no signature is provided 
        """

        response = self.client.post(
            'auth/register',
            data=json.dumps({
                'eth_address': '0x0d604c28a2a7c199c7705859c3f88a71cce2acb7',
            }),
            content_type='application/json'
        )

        data = json.loads(response.data.decode())
        self.assertTrue(response.status_code == 400)
        self.assertIn('Invalid payload', data['message'])
        self.assertIn('fail', data['status'])
