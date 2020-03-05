```bash
npm install
```

create db
```bash
mysql -u root -p
# enter pass for local computer. This is not the docker section yet

# crate todo db
create database ctodo;

# then create table
CREATE TABLE IF NOT EXISTS `customers` (
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
email varchar(255) NOT NULL,
name varchar(255) NOT NULL,
active BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


### OPTIONAL
# create user. restrict to this machine localhost !! OPTIONAL - could use root
create user 'utodo'@'localhost' identified by 'utodo';

# grant user priv for db !! OPTIONAL - could use root
GRANT ALL PRIVILEGES ON ctodo.* to 'utodo'@'localhost';

```

Create the docker image of the application
***-t*** adds tag to build
```bash
docker build -t node-prod .
```

Once built we can run the server
```bash
docker run -d -p 8000:8000 node-prod // run detached
docker run -it -p 8000:8000 node-prod // run interactive
```

Live reloading option for development
```bash
docker build -f Dockerfile.dev -t node-dev-tag .
docker run --name node-dev-name --rm -it -p 8000:8000 -v ${PWD}:/app node-dev-tag
```

## Note -

Make sure you have the port that is being exposed set to the same exposed port in server.js


## Running development with mysql running as well - local only

run docker compose to start the development nodejs server + start mysql up and init with items in /db-service

```bash
docker-compose build --no-cache # --no-cache if first time. or if experiencing errors

# run in detached mode
docker-compose up -d
```

Some useful commands for this build
```bash
# get running containers should be 2 
# - node_comp_dev
# - mysql_comp_dev
docker container ls

# get associated volumes.
docker volume ls

# see networks + volume info of container
docker container inspect node_comp_dev


# watch logs
docker contaienr node-comp_dev --follow
```