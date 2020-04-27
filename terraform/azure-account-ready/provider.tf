provider "azurerm" {
    # The "feature" block is required for AzureRM provider 2.x. 
    # If you are using version 1.x, the "features" block is not allowed.
    version = "~>2.0"
    features {}
}

provider "kubernetes" {
  load_config_file        = false
  host                    = azurerm_kubernetes_cluster.cluster-1.kube_config.0.host
  username                = azurerm_kubernetes_cluster.cluster-1.kube_config.0.username
  password                = azurerm_kubernetes_cluster.cluster-1.kube_config.0.password
  client_certificate      = base64decode(azurerm_kubernetes_cluster.cluster-1.kube_config.0.client_certificate)
  client_key              = base64decode(azurerm_kubernetes_cluster.cluster-1.kube_config.0.client_key)
  cluster_ca_certificate  = base64decode(azurerm_kubernetes_cluster.cluster-1.kube_config.0.cluster_ca_certificate)
}
