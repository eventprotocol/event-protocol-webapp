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

    def test_userdb_modify_details(self):
        """
        Test if we can add more user details to db
        """
        user = User(
            eth_address="0x0E35462535daE6fd521f0Eea67dc4e9485C714dC"
        )
        db.session.add(user)
        db.session.commit()

        old_id = user.id

        user.username = "test"
        user.email = "test"
        user.city_country = "test"
        user.tags = "test1, test2"
        user.img_src = "www.testurl.com"
        user.about = "test"

        db.session.commit()

        self.assertTrue(old_id == user.id)
        self.assertTrue(
            "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC" == user.eth_address)
        self.assertTrue("test" == user.username)
        self.assertTrue("test" == user.email)
        self.assertTrue("test" == user.city_country)
        self.assertTrue(["test1", "test2"] == user.tags)
        self.assertTrue("www.testurl.com" == user.img_src)
        self.assertTrue("test" == user.about)
        self.assertTrue(user.active)

    _tags = db.Column(db.String(128), nullable=True)
    img_src = db.Column(db.String(256), nullable=True)
    about = db.Column(db.String(256), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)


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
