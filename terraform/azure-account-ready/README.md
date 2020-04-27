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
> NOTE: this is needed for the kubernetes part creates a dynamically provisioned disk
```bash
#windows 
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$env:ARM_SUBCRIPTION_ID"
#linux
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
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



