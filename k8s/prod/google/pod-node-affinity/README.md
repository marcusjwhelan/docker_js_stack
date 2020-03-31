# Releasing project to google - only using pod/node affinity
No Kustomize tricks, no ansible, Terraform, no Kubeadm.

# Creating Same k8s cluster on Google Cloud

If you are just starting out: go to the Google Cloud Platform and create a new project. Once You have done that select that project and go the the dashboard for that project. 

The **project-id** will be listed in the `Project Info` on the Dashboard along with the **project-name** and the **project-number**.

On the top left open th `Navigation Menu` and select `Kubernetes Engine` and enable it. Make sure billing is enabled as well. Do not create a cluster or anything yet.

We will be working with the gcloud command locally in powershell. If any errors occur usually switching to cmd fixes it. Make sure to have downloaded the gcloud CLI.

Open Powershell as admin
Then Login and config set account
```bash
gcloud auth login --no-launch-browser
```
Take that link and open it in your browser of choice. Preferrably not Internet explorer or Edge since it doesnt seem to work on those browsers.

Once you login you will get a code, copy and past that code into the CLI request for `Enter verification code: `. 

Then update gcloud
```bash
gcloud components update
```

Set the project **docker-js-stack**
```bash
glcoud config set project docker-js-stack
```
Now set your compute zone
Name | types | Locations
--- | --- | ---
us-central1 | a, b, c, f | Council Bluffs, Iowa, USA
us-east1 | b, c, d | Moncks Corner, South Carolina, USA
us-east4 | a, b, c | Ashburn, Northern Virginia, USA
us-west1 | a, b, c | The Dalles, Oregon, USA
us-west2 | a, b, c | Los Angeles, California, USA
us-west3 | a, b, c | Salt Lake City, Utah, USA
```bash
gcloud config set compute/zone us-west1-a
```
If you create a zone with just the **us-west1** when you create a cluster a node will be made in each sub zone.

Take a look at your setup locally
```bash
gcloud config list
```

Now lets create the cluster **docker-js-stack-gke** with 1 node

Full example below
```bash
gcloud container clusters create docker-js-stack-gke --num-nodes=1
```
Next get credentials to operate on cluster which configures kubectl to use the cluster you created.

The one I release below is cluster-1
```bash
gcloud container clusters get-credentials docker-js-stack-gke
> Fetching cluster endpoint and auth data.
> kubeconfig entry generated for docker-js-stack-gke.
```

## Creating the cluster on google cloud
These options were selected in the console and chose to output their equivelant cmd and REST.
```bash
gcloud beta container \
  --project "docker-js-stack" \
  clusters create "cluster-1" \
  --zone "us-west1-a" \
  --no-enable-basic-auth \
  --release-channel "regular" \
  --machine-type "n1-standard-2" \
  --image-type "COS" \
  --disk-type "pd-standard" \
  --disk-size "10" \
  --local-ssd-count "1" \
  --metadata disable-legacy-endpoints=true \
  --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
  --num-nodes "3" \
  --enable-stackdriver-kubernetes \
  --enable-ip-alias \
  --network "projects/docker-js-stack/global/networks/default" \
  --subnetwork "projects/docker-js-stack/regions/us-west1/subnetworks/default" \
  --default-max-pods-per-node "110" \
  --no-enable-master-authorized-networks \
  --addons HorizontalPodAutoscaling,HttpLoadBalancing \
  --enable-autoupgrade \
  --enable-autorepair
```
Equivelant rest request
```bash
POST https://container.googleapis.com/v1beta1/projects/docker-js-stack/zones/us-west1-a/clusters
{
  "cluster": {
    "name": "cluster-1",
    "masterAuth": {
      "clientCertificateConfig": {}
    },
    "network": "projects/docker-js-stack/global/networks/default",
    "addonsConfig": {
      "httpLoadBalancing": {},
      "horizontalPodAutoscaling": {},
      "kubernetesDashboard": {
        "disabled": true
      },
      "istioConfig": {
        "disabled": true
      },
      "dnsCacheConfig": {}
    },
    "subnetwork": "projects/docker-js-stack/regions/us-west1/subnetworks/default",
    "nodePools": [
      {
        "name": "default-pool",
        "config": {
          "machineType": "n1-standard-2",
          "diskSizeGb": 10,
          "oauthScopes": [
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring",
            "https://www.googleapis.com/auth/servicecontrol",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/trace.append"
          ],
          "metadata": {
            "disable-legacy-endpoints": "true"
          },
          "imageType": "COS",
          "localSsdCount": 1,
          "diskType": "pd-standard"
        },
        "initialNodeCount": 3,
        "autoscaling": {},
        "management": {
          "autoUpgrade": true,
          "autoRepair": true
        }
      }
    ],
    "networkPolicy": {},
    "ipAllocationPolicy": {
      "useIpAliases": true
    },
    "masterAuthorizedNetworksConfig": {},
    "defaultMaxPodsConstraint": {
      "maxPodsPerNode": "110"
    },
    "authenticatorGroupsConfig": {},
    "privateClusterConfig": {},
    "databaseEncryption": {
      "state": "DECRYPTED"
    },
    "releaseChannel": {
      "channel": "REGULAR"
    },
    "clusterTelemetry": {
      "type": "ENABLED"
    },
    "location": "us-west1-a"
  }
}
```

Above I listed how to access gcloud through your local cmd but incase you missed it. https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

Make sure your compute zone is set to the correct location as the cluster.

Now lets assign the cluster nodes labels so the node selectors work inside our kustomization settings.
https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/
```bash
kubectl get nodes --show-labels
```
Now label one of the nodes **node-selector-db** to be our db node
```bash
kubectl label nodes <your-node-name> workload=node-selector-db
```
Then label the other two notes **node-selector-app**
```bash
kubectl label nodes <your-node-name>,<your-node-name> workload=node-selector-app
```

## Add the persistent disk to the cluster and region
https://kubernetes.io/docs/concepts/storage/volumes/#gcepersistentdisk
```bash
gcloud beta compute disks create disk-1 --project=docker-js-stack --type=pd-ssd --size=10GB --zone=us-west1-a --physical-block-size=4096
```

## Start up the services
Launch there services first
```bash
kubectl apply -k .\k8s\prod\google\pod-node-affinity\service\
```

Request the services to get the exposed IP Address
```bash
kubectl get svc
```
There you will be given the external IPs and ports. Take the client IP and change the the **CLIENT_URL** in k8s/prod/google/pod-node-affinity/api-config-map-pathc.yaml to the IP for the client.

Do the same for the **API_URL** for the client-config-map.yaml, and continue below with launching the rest of the application.

Then launch the applications and storage
```bash
kubectl apply -k .\k8s\prod\google\pod-node-affinity\deploy\
```

Make sure to create and populate the db with instructions in docker_js_stack_api in the README
```bash
kubectl get pods
# get the db-deployment pod
kubectl exec -ti <your-stateful-set-pod-name> -- mysql -uroot -pexample
```

Now go to that client IP url and check out the console. You should see output from the server.