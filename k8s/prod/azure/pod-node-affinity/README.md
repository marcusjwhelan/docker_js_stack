# Releasing project to azure - only using pod/node affinity
no ansible, Terraform, no Kubeadm.

# First lets get azure cli
https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest

Then we will have to login
```bash
az login -u <username> -p <password>
```

First lets check resource usage/limits for the region we will launch the application
```bash
 az network list-usages --location eastus2 --out table
```

Make sure no left over Service principals from old builds exist then create new one
```bash
az ad sp list --show-mine --query "[].{id:appId, tenant:appOwnerTenantId, displayName:displayName}"
az ad sp delete --id <ID>
```
Create service principal for cluster 
> NOTE: This is automatically done when cluster is created through cli
```bash
az ad sp create-for-rbac -n "cluster-1-sp" --skip-assignment

> {
  "appId": "{hash}"
  "displayName": "cluster-1-sp",
  "name": "http://cluster-1-sp",
  "password": "{hash}",
  "tenant": "3aa12b4b-4e0f-4129-852f-e15120429ced"
}
```
Then Add contributor role to service principal. Contributors can manage anything on AKS but caoont give access to others.
```bash
az role assignment create --assignee <appId> --scope /subscriptions/<subId>/resourceGroups/mwK8ResourceGroup --role Contributor

> {
  "canDelegate": null,
  "id": "/subscriptions/{SubscriptionID}/resourceGroups/mwK8ResourceGroup/providers/Microsoft.Authorization/roleAssignments/91bc1133-95e6-4b13-a798-e4b898122923",
  "name": "91bc1133-95e6-4b13-a798-e4b898122923",
  "principalId": "49dabd13-804d-49da-9510-c3eac14b40ef",
  "principalType": "ServicePrincipal",
  "resourceGroup": "mwK8ResourceGroup",
  "roleDefinitionId": "/subscriptions/{SubscriptionID}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
  "scope": "/subscriptions/{SubscriptionID}/resourceGroups/mwK8ResourceGroup",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

Get generated service Principal id
```bash
$env:CLIENT_ID = az aks show --resource-group mwK8ResourceGroup --name cluster-1 --query "servicePrincipalProfile.clientId" --output tsv
```


Then create a resource group
```bash
az group create --name mwK8ResourceGroup --location eastus2

> {
  "id": "/subscriptions/{HASH}/resourceGroups/mwK8ResourceGroup",
  "location": "eastus2",
  "managedBy": null,
  "name": "mwK8ResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

Create the virtual network and subnet 
> NOTE: DID not test in this go through
```bash
az network vnet create --resource-group mwK8ResourceGroup --name cluster-1Vnet --address-prefixes 10.0.0.0/8 --subnet-name myAKSSubnet --subnet-prefix 10.240.0.0/16
```

Create a service Principal and read in the application ID
> Ex first NOTE: ONly did the service principal
```bash
SP=$(az ad sp create-for-rbac --output json)
SP_ID=$(echo $SP | jq -r .appId)
SP_PASSWORD=$(echo $SP | jq -r .password)

# Wait 15 seconds to make sure that service principal has propagated
echo "Waiting for service principal to propagate..."
sleep 15

# Get the virtual network resource ID
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP_NAME --name myVnet --query id -o tsv)
```


Create the System node pool(required), kubernetes master. You have to use the
standard load balancer sku if you use multiple node pools.
> Note: Make sure and wait long enough for the automatic service principal to be made? possibly do this yourself in terraform
```bash
az aks create --resource-group mwK8ResourceGroup --name cluster-1 --node-count 2 --generate-ssh-keys --kubernetes-version 1.15.7 --load-balancer-sku standard --service-principal <appId> --client-secret <password>

> SSH key files 'C:\Users\hmwksadmin\.ssh\id_rsa' and 'C:\Users\hmwksadmin\.ssh\id_rsa.pub' have been generated under ~/.ssh to allow SSH access to the VM. If using machines without permanent storage like Azure Cloud Shell without an attached file share, back up your keys to a safe location
{
  "aadProfile": null,
  "addonProfiles": null,
  "agentPoolProfiles": [
    {
      "availabilityZones": null,
      "count": 2,
      "enableAutoScaling": null,
      "enableNodePublicIp": null,
      "maxCount": null,
      "maxPods": 110,
      "minCount": null,
      "mode": "System",
      "name": "nodepool1",
      "nodeLabels": {},
      "nodeTaints": null,
      "orchestratorVersion": "1.15.7",
      "osDiskSizeGb": 100,
      "osType": "Linux",
      "provisioningState": "Succeeded",
      "scaleSetEvictionPolicy": null,
      "scaleSetPriority": null,
      "spotMaxPrice": null,
      "tags": null,
      "type": "VirtualMachineScaleSets",
      "vmSize": "Standard_DS2_v2",
      "vnetSubnetId": null
    }
  ],
  "apiServerAccessProfile": null,
  "autoScalerProfile": null,
  "diskEncryptionSetId": null,
  "dnsPrefix": "cluster-1-mwK8ResourceGrou-170c2d",
  "enablePodSecurityPolicy": null,
  "enableRbac": true,
  "fqdn": "cluster-1-mwk8resourcegrou-{hash}.hcp.eastus2.azmk8s.io",
  "id": "/subscriptions/{hash}/resourcegroups/mwK8ResourceGroup/providers/Microsoft.ContainerService/managedClusters/cluster-1",
  "identity": null,
  "identityProfile": null,
  "kubernetesVersion": "1.15.7",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "ssh-rsa {SSHKEYdata}"
        }
      ]
    }
  },
  "location": "eastus2",
  "maxAgentPools": 10,
  "name": "cluster-1",
  "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "loadBalancerProfile": {
      "allocatedOutboundPorts": null,
      "effectiveOutboundIps": [
        {
          "id": "/subscriptions/{HASH}/resourceGroups/MC_mwK8ResourceGroup_cluster-1_eastus2/providers/Microsoft.Network/publicIPAddresses/{hash}",
          "resourceGroup": "MC_mwK8ResourceGroup_cluster-1_eastus2"
        }
      ],
      "idleTimeoutInMinutes": null,
      "managedOutboundIps": {
        "count": 1
      },
      "outboundIpPrefixes": null,
      "outboundIps": null
    },
    "loadBalancerSku": "Standard",
    "networkMode": null,
    "networkPlugin": "kubenet",
    "networkPolicy": null,
    "outboundType": "loadBalancer",
    "podCidr": "10.244.0.0/16",
    "serviceCidr": "10.0.0.0/16"
  },
  "nodeResourceGroup": "MC_mwK8ResourceGroup_cluster-1_eastus2",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "mwK8ResourceGroup",
  "servicePrincipalProfile": {
    "clientId": "{CLIENT ID HASH}",
    "secret": null
  },
  "sku": {
    "name": "Basic",
    "tier": "Free"
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters",
  "windowsProfile": null
}
```


> Note about the node-vm-size
> The "Size" column in the second link has the sku name which you can use in scripts. fwiw though, the naming convention seems to be **Standard_{series}{size}{version}**, e.g.. DS / 1 / v2

Then create the app node pool
```bash
az aks nodepool add --resource-group mwK8ResourceGroup --cluster-name cluster-1 --name appnodepool --node-count 2 --kubernetes-version 1.15.7 --labels workload=node-selector-app --node-osdisk-size 30 --node-vm-size Standard_DS2_v2 --debug

> {
  "agentPoolType": "VirtualMachineScaleSets",
  "availabilityZones": null,
  "count": 2,
  "enableAutoScaling": null,
  "enableNodePublicIp": null,
  "id": "/subscriptions/{hash}/resourcegroups/mwK8ResourceGroup/providers/Microsoft.ContainerService/managedClusters/cluster-1/agentPools/appnodepool",
  "maxCount": null,
  "maxPods": 110,
  "minCount": null,
  "mode": "User",
  "name": "appnodepool",
  "nodeLabels": {
    "workload": "node-selector-app"
  },
  "nodeTaints": null,
  "orchestratorVersion": "1.15.7",
  "osDiskSizeGb": 30,
  "osType": "Linux",
  "provisioningState": "Succeeded",
  "resourceGroup": "mwK8ResourceGroup",
  "scaleSetEvictionPolicy": null,
  "scaleSetPriority": null,
  "spotMaxPrice": null,
  "tags": null,
  "type": "Microsoft.ContainerService/managedClusters/agentPools",
  "vmSize": "Standard_DS2_v2",
  "vnetSubnetId": null
}
```

Then create the db node pool of 1
```bash
az aks nodepool add --resource-group mwK8ResourceGroup --cluster-name cluster-1 --name dbnodepool --node-count 1 --kubernetes-version 1.15.7 --labels workload=node-selector-db --node-osdisk-size 30 --node-vm-size Standard_DS1_v2 --debug

> {
  "agentPoolType": "VirtualMachineScaleSets",
  "availabilityZones": null,
  "count": 1,
  "enableAutoScaling": null,
  "enableNodePublicIp": null,
  "id": "/subscriptions/{hash}/resourcegroups/mwK8ResourceGroup/providers/Microsoft.ContainerService/managedClusters/cluster-1/agentPools/dbnodepool",
  "maxCount": null,
  "maxPods": 110,
  "minCount": null,
  "mode": "User",
  "name": "dbnodepool",
  "nodeLabels": {
    "workload": "node-selector-db"
  },
  "nodeTaints": null,
  "orchestratorVersion": "1.15.7",
  "osDiskSizeGb": 30,
  "osType": "Linux",
  "provisioningState": "Succeeded",
  "resourceGroup": "mwK8ResourceGroup",
  "scaleSetEvictionPolicy": null,
  "scaleSetPriority": null,
  "spotMaxPrice": null,
  "tags": null,
  "type": "Microsoft.ContainerService/managedClusters/agentPools",
  "vmSize": "Standard_DS1_v2",
  "vnetSubnetId": null
}
```
Create the persistent disk for MySQL
> NOTE: I ended up using dynamic provisioning. it looks like 
```bash
az disk create --name disk-1 --resource-group mwK8ResourceGroup --size-gb 5 --location eastus2 --sku Premium_LRS

> {
    "createOption": "Empty",
    "galleryImageReference": null,
    "imageReference": null,
    "sourceResourceId": null,
    "sourceUniqueId": null,
    "storageAccountId": null,
    "uploadSizeBytes": null
  },
  "diskIopsReadOnly": null,
  "diskIopsReadWrite": 120,
  "diskMbpsReadOnly": null,
  "diskMbpsReadWrite": 25,
  "diskSizeBytes": 5368709120,
  "diskSizeGb": 5,
  "diskState": "Unattached",
  "encryption": {
    "diskEncryptionSetId": null,
  },
  "encryptionSettingsCollection": null,
  "hyperVgeneration": "V1",
  "id": "/subscriptions/{subscriptionID}/resourceGroups/mwK8ResourceGroup/providers/Microsoft.Compute/disks/disk-1",
  "location": "eastus2",
  "managedBy": null,
  "managedByExtended": null,
  "maxShares": null,
  "name": "disk-1",
  "osType": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "mwK8ResourceGroup",
  "shareInfo": null,
  "sku": {
    "name": "Premium_LRS",
    "tier": "Premium"
  },
  "tags": {},
  "timeCreated": "2020-04-24T16:15:32.224549+00:00",
  "type": "Microsoft.Compute/disks",
  "uniqueId": "e12f0e42-7411-4718-9acd-f89e3c79771a",
  "zones": null
}
```

After the cluster is created then get the kubernetes credentials
```bash
az aks get-credentials --resource-group mwK8ResourceGroup --name cluster-1
```
## Start up kubernetes

Launch the services first
```bash
kubectl apply -k .\k8s\prod\azure\pod-node-affinity\service\
```

Request the services to get the exposed IP Address
```bash
kubectl get svc
```

There you will be given the external IPs and ports. Take the client IP and change the the **CLIENT_URL** in k8s/prod/google/pod-node-affinity/api-config-map-pathc.yaml to the IP for the client.

Do the same for the **API_URL** for the client-config-map.yaml, and continue below with launching the rest of the application.

Then launch the applications and storage
```bash
kubectl apply -k .\k8s\prod\azure\pod-node-affinity\deploy\
```

Make sure to create and populate the db with instructions in docker_js_stack_api in the README
```bash
kubectl get pods
# get the db-deployment pod
kubectl exec -ti <your-stateful-set-pod-name> -- mysql -uroot -pexample
```
