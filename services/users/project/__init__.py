import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension
from flask_cors import CORS
from flask_migrate import Migrate

# instantiate extensions
db = SQLAlchemy()
toolbar = DebugToolbarExtension()
migrate = Migrate()

MIGRATION_DIR = os.path.join("migrations")

def create_app(script_info=None):
    # instantiate app
    app = Flask(__name__)

    # enable CORS
    CORS(app)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    toolbar.init_app(app)

    # set up migrations directory
    migrate.init_app(app, db, directory=MIGRATION_DIR)

    # register blueprints
    
    # USER
    from project.api.users import users_blueprint
    app.register_blueprint(users_blueprint)

    # AUTH
    from project.api.auth import auth_blueprint
    app.register_blueprint(auth_blueprint)


    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {'app': app,
                'db': db}

    return app
