import unittest

from sqlalchemy.exc import IntegrityError

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase


class TestUserModel(BaseTestCase):
    def test_userdb_add_user(self):
        """
        Test if we can add user to db
        """
        user = User(
            eth_address="0x0E35462535daE6fd521f0Eea67dc4e9485C714dC"
        )
        db.session.add(user)
        db.session.commit()
        self.assertTrue(user.id)
        self.assertEqual(
            user.eth_address,
            "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC")
        self.assertTrue(user.active)

    def test_userdb_add_user_duplicate_eth_address(self):
        """
        Test if the database raises error if duplicate eth addresses exist
        """
        user = User(
            eth_address="0x0E35462535daE6fd521f0Eea67dc4e9485C714dC"
        )
        db.session.add(user)
        db.session.commit()

        same_user = User(
            eth_address="0x0E35462535daE6fd521f0Eea67dc4e9485C714dC"
        )

        db.session.add(same_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_userdb_to_json(self):
        """
        Test if json output is valid json
        """
        user = User(
            eth_address="0x0E35462535daE6fd521f0Eea67dc4e9485C714dC"
        )
        db.session.add(user)
        db.session.commit()
        self.assertTrue(isinstance(user.to_json(), dict))


if __name__ == '__main__':
    unittest.main()
