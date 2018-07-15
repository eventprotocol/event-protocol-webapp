from project import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eth_address = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(128), nullable=True)
    email = db.Column(db.String(128), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)

    def __init__(self, eth_address):
        """
        Initialize user model with eth_address obtained from web3
        """
        self.eth_address = eth_address

    def to_json(self):
        """
        Returns data as a dict to be converted into json
        """
        return {
            'id': self.id,
            'eth_address': self.eth_address,
            'username': self.username,
            'email': self.email,
            'active': self.active,
        }
