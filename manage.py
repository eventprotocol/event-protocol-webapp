"""
manage.py for flask application
"""

from flask.cli import FlaskGroup
from backend import app

cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()

