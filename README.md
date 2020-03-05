Build both client, server, and database to all work together with docker

```bash
docker-compose build --no-cache # no cache optional for debugging issues
docker-compose up -d
```

client running on: http://localhost:3000/#/
server running on: http://localhost:8080

Init is in server/db-services/init.sql

So there is a database **ctodo** with table **customers**.

## Endpoints

* GET: /customers
* GET: /customers/#
* POST: /customers?email=example@email.com&name=exampleName&active=true
* PUT: /customers/#?email=example@update.com&name=newName&active=false
* DELETE: /customers
* DELETE: /customers/#




