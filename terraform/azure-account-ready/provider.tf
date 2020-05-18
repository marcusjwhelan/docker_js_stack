provider "azurerm" {
  version = "~>2.7" # https://github.com/terraform-providers/terraform-provider-azurerm/blob/master/CHANGELOG.md
  subscription_id = ""
  client_id       = "" # "appId"
  client_secret   = ""
  tenant_id       = "" # "appOwnerTenantId"
  features {}
}

provider "azuread" {
  version = "~>0.8.0" # https://github.com/terraform-providers/terraform-provider-azuread/blob/master/CHANGELOG.md
  # subscription_id = ""
  # client_secret   = ""
  # tenant_id       = "" # "appOwnerTenantId"
  client_id       = "" # "appId"
  
}

# provider "kubernetes" {
#   load_config_file        = false
#   host                    = azurerm_kubernetes_cluster.cluster_1.kube_config.0.host
#   username                = azurerm_kubernetes_cluster.cluster_1.kube_config.0.username
#   password                = azurerm_kubernetes_cluster.cluster_1.kube_config.0.password
#   client_certificate      = base64decode(azurerm_kubernetes_cluster.cluster_1.kube_config.0.client_certificate)
#   client_key              = base64decode(azurerm_kubernetes_cluster.cluster_1.kube_config.0.client_key)
#   cluster_ca_certificate  = base64decode(azurerm_kubernetes_cluster.cluster_1.kube_config.0.cluster_ca_certificate)
# }
resource "null_resource" "add_context" {
    provisioner "local-exec" {
        command = "az aks get-credentials --resource-group ${azurerm_kubernetes_cluster.cluster_1.resource_group_name} --name ${azurerm_kubernetes_cluster.cluster_1.name} --overwrite-existing"
    } 

    depends_on = [azurerm_kubernetes_cluster.cluster_1]
}
