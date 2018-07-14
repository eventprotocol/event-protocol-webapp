# Web Application for Event Protocol

# Under the Hood
- Python 3.6
- Flask
- React
- Docker (docker, docker-compose, docker-machine)


# To Run
1. Set up virtual environment, use conda, pipenv, or virtualenv.

2. Install python dependencies
```
$ pip install -r requirements
```

3. Run web server
```
$ source activate <insert virtual env name> // if using conda

$ export FLASK_APP=project/__init__.py

// For debug mode
$ export FLASK_DEBUG=1

// For no debug mode
$ export FLASK_DEBUG=0

$ python manage.py run
```


# Docker Development Setup
1. Check if you have the required docker programs
```
$ docker -v 
$ docker-compose -v
$ docker-machine -v
```

2. Create a new docker host with docker machine and point docker client to it
```
$ docker-machine create -d virtualbox eventprotocol-dev
$ docker-machine env eventprotocol-dev
$ eval "$(docker-machine env eventprotocol-dev)"
```

3. Build docker image
```
$ cd <root of the repository>
$ docker-compose -f docker-compose-dev.yml build
```

4. Run the containers
```
$ docker-compose -f docker-compose-dev.yml up -d

// you may find it useful to view logs
$ docker-compose -f docker-compose-dev.yml logs

// to build while the containter detached and up
$ docker-compose -f docker-compose-dev.yml up -d --build
```

# Running Tests
1. Run tests using this command
```
$ docker-compose -f docker-compose-dev.yml run users python manage.py test
```
