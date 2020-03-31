Build both client, server, and database to all work together with docker

## Add client and api submodules
```bash
git submodule add https://github.com/marcusjwhelan/docker_js_stack_client.git
git submodule add https://github.com/marcusjwhelan/docker_js_stack_api.git   
```


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

## Update submodules
```bash
git submodule update --recursive --remote
git add .
git commit -m ""
git push
```


# Test K8s deployment locally
First start server service
```bash
cd /docker_js_stack_api/kubernetes
kubectl create -f api-service.yaml
kubectl get svc
> NAME          TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
> api-service   LoadBalancer   10.109.119.7   localhost     8080:31211/TCP   10s
> kubernetes    ClusterIP      10.96.0.1      <none>        443/TCP          10d
```
As you can you are given the external port and IP for the service you need to connect to.
This is the IP and PORT you need to put in the client webpack config under plugins for process.env for APIURL.

Next we need to build the client app
```bash
cd ../..
cd docker_js_stack_client
docker image build -t mjwrazor/docker-js-stack-client:latest .
```
You should see `Successfully built 'tag#'` and compare that to the tag shown when you run
```bash
docker image ls
```

Now deploy the client application
```bash
cd kubernetes
kubectl create -f client-deployment.yaml
```
Look for the deployment, replicaSet, and Pod resources
```bash
kubectl get delpoy,rs,pod
> NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
> deployment.extensions/client-deployment   2/2     2            2           64s
>
> NAME                                                 DESIRED   CURRENT   READY   AGE
> replicaset.extensions/client-deployment-76684ccc78   2         2         2       64s
>
> NAME                                     READY   STATUS    RESTARTS   AGE
> pod/client-deployment-76684ccc78-8p5zp   1/1     Running   0          63s
> pod/client-deployment-76684ccc78-bljkg   1/1     Running   0          63s
```
Now launch the client service
```bash
kubectl create -f client-service.yaml
kubectl get service
> NAME             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
> api-service      LoadBalancer   10.109.119.7    localhost     8080:31211/TCP   27m
> client-service   LoadBalancer   10.111.84.146   localhost     80:32539/TCP     5s
> kubernetes       ClusterIP      10.96.0.1       <none>        443/TCP          10d
```
Now back to the server application to get the persistent volume ready for the mysql application
```bash
cd ../..
cd docker_js_stack_api/kubernetes
kubectl create -f mysql-volume.yaml
# and as well teh volume claim
kubectl create -f mysql-volume-claim.yaml
# now create mysql deployment
kubectl create -f mysql-deployment.yaml
# now create mysql service
kubectl create -f mysql-service.yaml
# list all created items
kubectl get pv,pvc,pod,svc,deploy
> NAME                               CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                    STORAGECLASS   REASON   AGE
> persistentvolume/mysql-pv-volume   1Gi        RWX            Retain           Bound    default/mysql-pv-claim   manual                  17m
>
> NAME                                   STATUS   VOLUME            CAPACITY   ACCESS MODES   STORAGECLASS   AGE
> persistentvolumeclaim/mysql-pv-claim   Bound    mysql-pv-volume   1Gi        RWX            manual         15m
>
> NAME                                     READY   STATUS    RESTARTS   AGE
> pod/client-deployment-76684ccc78-2frq6   1/1     Running   0          27m
> pod/client-deployment-76684ccc78-tdwms   1/1     Running   0          27m
> pod/db-deployment-f8457f947-h92tl        1/1     Running   0          3m36s
>
> NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
> service/api-service      LoadBalancer   10.109.119.7    localhost     8080:31211/TCP   73m
> service/client-service   LoadBalancer   10.103.15.174   localhost     80:30399/TCP     25m
> service/db-service       ClusterIP      10.109.114.2    <none>        3306/TCP         5s
> service/kubernetes       ClusterIP      10.96.0.1       <none>        443/TCP          10d
>
> NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
> deployment.extensions/client-deployment   2/2     2            2           27m
> deployment.extensions/db-deployment       1/1     1            1           3m36s
```
Now build the api container and start the application with config maps
```bash
cd ..
docker image build -t mjwrazor/docker-js-stack-api:latest .
cd kubernetes
kubectl create -f config-map.yaml
# now create api deployment
kubectl create -f api-deployment.yaml
```

Make sure to create and populate the db with instructions in docker_js_stack_api in the README
```bash
kubectl get pods
# get the db-deployment pod
kubectl exec -ti db-deployment-f8457f947-h92tl -- mysql -uroot -pexample
```
After you are in the mysql cli you will need to copy and paste the init code from `/docker-js-stack-api/db-service/init.sql` and execute it. This way the user for the back end will be created and a small amount of data will be pre populated for testing. 

## DELETE local k8s deployment
```bash
kubectl delete deploy/api-deployment
kubectl delete service/api-service
# repeat above for each deploy/service created

kubectl delete statefulset.apps/db-stateful-set
kubectl delete configmap server-side-configs
kubectl delete pvc/mysql-pv-claim
kubectl delete pv/mysql-pv-volume
```



# Using Kustomize

Moved all files into k8s and will be able to run full configurations with one command.

launch base application - dont forget to do the init.sql from the api repo inside of the stateful set
```bash
kubectl apply -k /k8s/base
```
With kustomize you can deploy different versions of the application using the base. 