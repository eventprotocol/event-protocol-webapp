# Web Application for Event Protocol

# Under the Hood
- Python 3.6
- Flask
- React
- Docker (docker, docker-compose, docker-machine)


# Docker Development Setup
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

2. Now run
```
$ docker-machine create --driver amazonec2 eventprotocol-prod
```

3. Once done run
```
$ docker-machine env eventprotocol-prod
$ eval $(docker-machine env eventprotocol-prod
```

4. Check if the install works
```
// IMPT NOTE Likewise you might need to run the commands as root $ sudo -s
$ docker-compose -f docker-compose-prod.yml up -d --build
$ docker-compose -f docker-compose-prod.yml run users python manage.py recreate_db
$ docker-compose -f docker-compose-prod.yml run users python manage.py seed_db
$ docker-compose -f docker-compose-prod.yml run users python manage.py test
```

5. Add the desired port the AWS Security Group the ec2 instance is associated with. You should be able to access the web application with `<public-ip>:<port num>`
