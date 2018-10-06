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
