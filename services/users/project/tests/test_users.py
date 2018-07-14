import json
import unittest

from project.tests.base import BaseTestCase


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
            self.assertIn('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC was added!', data['message'])
            self.assertIn('success', data['status'])



if __name__ == '__main__':
    unittest.main()
