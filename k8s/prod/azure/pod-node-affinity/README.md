# Releasing project to azure - only using pod/node affinity
 no ansible, Terraform, no Kubeadm.

 # First lets get azure cli
 https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest

 Then we will have to login
 ```bash
 az login -u <username> -p <password>
 ```

 Then create a resource group
 ```bash
 az group create --name mwK8ResourceGroup --location eastus
 ```

 ```bash
 az aks create --resource-group mwK8ResourceGroup --name cluster-1 --node-count 2
 ```