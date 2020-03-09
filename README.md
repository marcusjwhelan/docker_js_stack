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


# Setting up Docker on Windows 10

1. Install docker-desktop
    > https://www.docker.com/products/docker-desktop

2. You need to have virtualization enabled on your computer
    > https://bce.berkeley.edu/enabling-virtualization-in-your-pc-bios.html

3. Enable Hyper-V 
    1. Open Control Panel and select "Programs"
    2. Select "Turn Windows features on or off"
    3. Enable "Hyper-V", "Virtual Machine Platform", and "Containers" if they are not and select OK

4. Add your current user to docker-users group
    1. Under the windows search section type "Computer Management" -> open as admin
    2. Under "Local Users and Groups" select "Groups"
    3. Double click "docker-users"
    3. In the docker-users Properties select add and add your username then select OK

5. Set up Docker
    1. Open Docker Settings by selecting the "^" icon on the bottom right of the monitor
    2. Right click the docker symbol which looks like a whale with containers on it and select Settings
    3. Make sure in "General" you have everything selected except the WSL 2 option(not out yet)
    4. In "Resources" Select "File Sharing" and enable at least the C: drive
    5. In "Command Line" enable experimental features
    6. in "Kubernetes" enable Kubernetes, but nothing else, and then apply & reset