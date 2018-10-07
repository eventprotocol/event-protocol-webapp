# Web Application for Event Protocol
[![Build Status](https://travis-ci.com/eventprotocol/event-protocol-webapp.svg?branch=master)](https://travis-ci.com/eventprotocol/event-protocol-webapp)

# Under the Hood
- Python 3.6
- Flask
- React
- Docker (docker, docker-compose, docker-machine)


# Docker Development Setup
0. Do follow the steps sequentially

1. Check if you have the required docker programs
```
$ docker -v 
$ docker-compose -v
$ docker-machine -v
```

2. Create a new docker host with docker machine and point docker client to it
```
// IMPT NOTE you might need to run the docker commands as super user ie. $ sudo -s

$ docker-machine create -d virtualbox eventprotocol-dev
$ docker-machine env eventprotocol-dev
$ eval "$(docker-machine env eventprotocol-dev)"

// When you revisit the program after restarting start the machine
$ docker-machine start eventprotocol-dev
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
// Include this in path to run react. Replace DOCKER_MACHINE_DEV_IP with docker-machine eventprotocol-dev ip
$ export  REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_DEV_IP

$ docker-compose -f docker-compose-dev.yml up -d

// you may find it useful to view logs
$ docker-compose -f docker-compose-dev.yml logs

// to build while the containter detached and up
$ docker-compose -f docker-compose-dev.yml up -d --build
```

# Accessing The Application
1. On you web browser access `http://DOCKER_MACHINE_DEV_IP:3007` as found earlier. This port points to the react client application. 

# Running Tests
1. Run tests using this command
```
$ docker-compose -f docker-compose-dev.yml run users python manage.py test
```


# Docker Deployment on AWS
1. Create an Admin group on aws and create an IAM account and give it the admin group privileges. You will obtain an access key and key id. Create a credentials file in ~/.aws
```
$ cd ~/.aws
$ vi credentials    // use any editor 

// put in the following information in the credentials files
[default]
aws_secret_access_key = *****
aws_access_key_id =  AKI*****

```
2. Now run, note you'll need at least a t2.small instance to build web3 dependencies.
```
$ docker-machine create --driver amazonec2 --amazonec2-instance-type t2.small eventprotocol-prod
```

3. Once done run
```
$ docker-machine env eventprotocol-prod
$ eval $(docker-machine env eventprotocol-prod
```

4. Check if the install works
```
// Include this in path to run react. Replace DOCKER_MACHINE_PROD_IP with docker-machine eventprotocol-prod ip
$ export  REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_PROD_IP

// IMPT NOTE Likewise you might need to run the commands as root $ sudo -s
$ docker-compose -f docker-compose-prod.yml up -d --build
$ docker-compose -f docker-compose-prod.yml run users python manage.py recreate_db
$ docker-compose -f docker-compose-prod.yml run users python manage.py seed_db
$ docker-compose -f docker-compose-prod.yml run users python manage.py test
```

5. Add the desired port the AWS Security Group the ec2 instance is associated with. You should be able to access the web application with `<public-ip>:<port num>`

6. You should be able to access the site at `http://DOCKER_MACHINE_PROD_IP`


# React
1. Add the environment variable
```
$ export  REACT_APP_USERS_SERVICE_URL=http://DOCKER_MACHINE_DEV_IP
```

# Database Management
## Migrations
1. Initialize migration with this command 
```
$ docker-compose -f docker-compose-<enter stage eg. dev, prod>.yml run users db init
```

2. If the migrations has already been initialize run the following commands whenever you need to migrate the database
```
$ docker-compose -f docker-compose-<enter stage eg. dev, prod>.yml run users db migrate
$ docker-compose -f docker-compose-<enter stage eg. dev, prod>.yml run users db upgrade
```

## Reset the database (**ONLY FOR DEVELOPMENT PURPOSES**)
1. Recreate the database
```
$ docker-compose -f docker-compose-<enter stage eg. dev, prod>.yml run users python manage.py recreate_db
```

2. Seed the database 
```
$ docker-compose -f docker-compose-<enter stage eg. dev, prod>.yml run users python manage.py seed_db
```