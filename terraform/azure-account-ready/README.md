# Getting started
If you have multiple azure subscriptions check to see which one you want to use
```bash
az account list --query "[].{name:name, subscriptionId:id, tenantId:tenantId}"
```
Set the subscription you want to use
```bash
az account set --subscription="${SUBSCRIPTION_ID}"
```
Now create a Service Principal for use with Terraform
> NOTE: This is part of the manual Setup SKIP THIS SINCE I IMPLEMENTED IT IN TERRAFORM
```bash
#windows 
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$env:ARM_SUBCRIPTION_ID"
#linux
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
```
If you accidentally assign the same role twice you can delete it
```bash
az role assignment list
az role assignment delete --ids "/subscriptions/{Subscription_id}/providers/Microsoft.Authorization/roleAssignments/{role hash}"
```

Configure Terraform Environment variables
```bash
# manual  --- powershell
$env:ARM_SUBSCRIPTION_ID="{Subscription_HASH_ID}"
$env:ARM_CLIENT_ID="{hash}"
$env:ARM_CLIENT_SECRET="{Hash}"
$env:ARM_TENANT_ID="{tennant_hash_id}"

# ------ script ----- should be hidden
#!/bin/sh
echo "Setting environment variables for Terraform"
export ARM_SUBSCRIPTION_ID=your_subscription_id
export ARM_CLIENT_ID=your_appId
export ARM_CLIENT_SECRET=your_password
export ARM_TENANT_ID=your_tenant_id

# Not needed for public, required for usgovernment, german, china
export ARM_ENVIRONMENT=public
```

If you forgot the above items and need to find them again client id, you can but the secret you need to store.

First list service principals
```bash
az ad sp list --show-mine
```
If you need to delete some here is the command, using service principal name or objectId
```bash
az ad sp delete --id {OBJECT_ID}
```
If you forget the password or need to remake it so you can save it you can reset the credentials with
```bash
az ad sp credentials reset --name {either of the "servicePrincipalNames"}
```

### Now need to setup the Azure Active Directory integration to service principal
Give group membership claims of all. You will need to set this for the appid you just created.
```bash
az ad app update --id {APP_ID/CLIENT_ID} --set groupMembershipClaims=All
```
Now 

# Setting up Terraform state
So we have to manually create the storage for terraform state, that is not something we can just put into variables because terraform disallows variables in the terraform block.

I am going to create a resource group for the terraform storage and there will also be a resource group created for the actual application cluster. Just to keep the two separated and not delete the terraform state if I delete the resource group.

Lets create the resource group for the state now. Using these variables

* container_name        = "mwtfstatecontainer"
* resource_group_name   = "mw_terraform_state_rs"
* storage_account_name  = "mwterraform90901"

```bash
az group create --name mw_terraform_state_rs --location eastus2

> {
  "id": "/subscriptions/{Subscription_ID}/resourceGroups/mw_terraform_state_rs",
  "location": "eastus2",
  "managedBy": null,
  "name": "mw_terraform_state_rs",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

Then create the storage account
```bash
az storage account create --resource-group mw_terraform_state_rs --name mwterraform90901 --sku Standard_LRS --encryption-services blob

> {
  "accessTier": "Hot",
  "azureFilesIdentityBasedAuthentication": null,
  "blobRestoreStatus": null,
  "creationTime": "2020-04-28T20:11:54.998416+00:00",
  "customDomain": null,
  "enableHttpsTrafficOnly": true,
  "encryption": {
    "keySource": "Microsoft.Storage",
    "keyVaultProperties": null,
    "services": {
      "blob": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2020-04-28T20:11:55.060891+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2020-04-28T20:11:55.060891+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "failoverInProgress": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/{Subscription_ID/resourceGroups/mw_terraform_state_rs/providers/Microsoft.Storage/storageAccounts/{account}",
  "identity": null,
  "isHnsEnabled": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "eastus2",
  "name": "{account}",
  "networkRuleSet": {
    "bypass": "AzureServices",
    "defaultAction": "Allow",
    "ipRules": [],
    "virtualNetworkRules": []
  },
  "primaryEndpoints": {
    "blob": "https://{account}.blob.core.windows.net/",
    "dfs": "https://{account}.dfs.core.windows.net/",
    "file": "https://{account}.file.core.windows.net/",
    "internetEndpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://{account}.queue.core.windows.net/",
    "table": "https://{account}.table.core.windows.net/",
    "web": "https://{account}.z20.web.core.windows.net/"
  },
  "primaryLocation": "eastus2",
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "resourceGroup": "mw_terraform_state_rs",
  "routingPreference": null,
  "secondaryEndpoints": null,
  "secondaryLocation": null,
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "available",
  "statusOfSecondary": null,
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts"
}
```

Get storage account key - will save as environment variable for later use.
```bash
$env:ACCOUNT_KEY = az storage account keys list --resource-group mw_terraform_state_rs --account-name mwterraform90901 --query [0].value -o tsv
```

Then Create blob container
```bash
az storage container create --name mwtfstatecontainer --account-name mwterraform90901 --account-key $env:ACCOUNT_KEY

> {
  "created": true
}
```

Make sure to go into the azure gui and find the blob name
```bash
 az storage container list --account-key $env:ACCOUNT_KEY --account-name mwterraform90901
 ```

 Once the storage is created you can run this command to initialize terraform state. Not necassary if you are a team of one but if you have multiple people running terraform commands this is preferred.
 ```bash
 terraform init
 ```

 Now create the terraform plan file, this will also show any errors while trying
 ```bash
 terraform plan --out planfile
 ```

 Now lets try and apply the planfile to azure
 ```bash
 terraform apply planfile
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

# Deleting made cluster
> NOTE deleting a cluster this way will delete dynamically created disks, because the disk is attached to a pod. If you want persistent files without pod attachment create a azure files instead.
```bash
 az aks delete --name cluster-1 --resource-group mwK8ResourceGroup --yes
 ```