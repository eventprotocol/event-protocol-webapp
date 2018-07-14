# Web Application for Event Protocol

# Under the Hood
- Python 3.6
- Flask
- React

# To Run
1. Set up virtual environment, use conda, pipenv, or virtualenv.

2. Install python dependencies
```
$ pip install -r requirements
```

3. Run web server
```
$ source activate <insert virtual env name> // if using conda

$ export FLASK_APP=backend/__init__.py

// For debug mode
$ export FLASK_DEBUG=1

// For no debug mode
$ export FLASK_DEBUG=0

$ python manage.py run
```
