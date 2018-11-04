"""
manage.py for flask application
"""
import unittest
import coverage
import os

from flask.cli import FlaskGroup
from project import create_app, db
from project.api.models import User


# Code coverage
COV = coverage.Coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/tests/*',
        'project/config.py',
    ]
)
COV.start()


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command()
def cov():
    """
    Runs the unit tests with coverage
    """
    tests = unittest.TestLoader().discover('project/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'tmp/coverage')
        COV.html_report(directory=covdir)
        print('HTML version: file://%s/index.html' % covdir)
        COV.erase()
        return 0

    return -1


@cli.command()
def recreate_db():
    """
    Destroys all db and recreates a new db
    """
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def test():
    """
    Runs test without code coverage
    """
    tests = unittest.TestLoader().discover(
        'project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)

    if result.wasSuccessful():
        return 0
    else:
        return -1


@cli.command()
def seed_db():
    """
    Seeds the database with some initial data
    """
    user1 = User(
        eth_address='0x0d604C28A2a7c199c7705859c3f88A71cCE2aCb7'.lower())
    user1.username = "Meeting Room Of The Century"
    user1.email = "info@meetmeetrevolution.com"
    user1.city_country = "Singapore, SG"
    user1.tags = "Meeting Spaces"
    user1.about = '''This is the best meeting space you will ever see'''
    user1.seller_detail = '''We sell space'''
    user1.buyer_detail = '''We are not buying'''

    user2 = User(
        eth_address='0xF4675187bD8B058CcF87f7116b54970fC3f81b52'.lower())
    user2.username = "Makeup Till You Breakup"
    user2.email = "info@makeupbreakup.com"
    user2.city_country = "Singapore, SG"
    user2.tags = "Stylist"
    user2.about = '''Reimagine your looks with us'''
    user2.seller_detail = '''We are serving looks tonight'''
    user2.buyer_detail = '''We are not buying'''

    user3 = User(
        eth_address='0x4FaE992a476bB00Be85B7BF76fef8e27DE2231C7'.lower())
    user3.username = "Heart Attack Buffet"
    user3.email = "info@buffettothemax.com"
    user3.city_country = "Singapore, SG"
    user3.tags = "Buffet"
    user3.about = '''Eat till you get a heart attack'''
    user3.seller_detail = '''We sell food'''
    user3.buyer_detail = '''We are not buying'''

    user4 = User(
        eth_address='0x6ea57F562Ef39f1776eb66D91c54A961Fa6DdadA'.lower())
    user4.username = "Pleasant Photography"
    user4.email = "info@pleasantphoto.com"
    user4.city_country = "Singapore, SG"
    user4.tags = "Photography"
    user4.about = ('We are a group of photographers specialized in wedding'
                   'photography. '
                   'We have won numerous awards for our photos. '
                   'We will capture your '
                   'memories in ways you cannot imagine.')
    user4.seller_detail = '''We sell photos'''
    user4.buyer_detail = '''We are not buying'''

    user5 = User(
        eth_address='0x04Ee2da68b909684d586a852970E424981f30928'.lower())
    user5.username = "Epic Winebar"
    user5.email = "epic@alcoholtothemax.com"
    user5.city_country = "Singapore, SG"
    user5.tags = "Bar, Restaurant"
    user5.about = ('Award winnning winebar with the best selection of alcohol.'
                   'We serve delicious international cuisine, with fusion'
                   'dishes inspired from our travels. We are always ready for'
                   'your craziest events.')
    user5.seller_detail = '''We sell wine'''
    user5.buyer_detail = '''We are not buying'''

    user6 = User(
        eth_address='0x50E9002d238d9a2A29C3047971E8006663A9d799'.lower())
    user6.username = "Dancers Who Dance"
    user6.email = "dance@dancealot.com"
    user6.city_country = "Singapore, SG"
    user6.tags = "Performer"
    user6.about = ('Dancers who dance are people who like to dance alot.'
                   'Give us music and we will dance for you.')
    user6.seller_detail = '''We sell dance'''
    user6.buyer_detail = '''We are not buying'''

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(user4)
    db.session.add(user5)
    db.session.add(user6)

    db.session.commit()


if __name__ == '__main__':
    cli()
