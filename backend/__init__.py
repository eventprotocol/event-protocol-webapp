from flask import Flask

# instantiate app
app = Flask(__name__)

# set config
app.config.from_object('backend.config.DevelopmentConfig')

# import routes
from backend import routes

