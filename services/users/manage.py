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
    branch = True,
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
    result = unittest.TextTestRunner(verbosity = 2).run(tests)
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
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
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
    user0 = User(eth_address='0x0E35462535daE6fd521f0Eea67dc4e9485C714dC')
    user1 = User(eth_address='0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8')

    db.session.add(user0)
    db.session.add(user1)

    db.session.commit()



if __name__ == '__main__':
    cli()

