

# The Azure cluster.
resource "azurerm_kubernetes_cluster" "cluster-1" {
  name  = "cluster-1"
  location = azure_resource_group.test1.location
  resource_group_name = azure_resource_group.test1.name
  dns_prefix = "example1"
  kubernetes_version = "1.15.7"


  default_node_pool {
    name = "default"
    node_count = 2
    vm_size = "Standard_D2_v2"
    os_type = "Linux"
    os_disk_size_gb = 30
  }

  service_principal {
    client_id     = "00000000-0000-0000-0000-000000000000"
    client_secret = "00000000000000000000000000000000"
  }

  network_profile {
    network_plugin = "kubenet"
    network_policy = "calico"
  }
}


resource "azurerm_kubernetes_cluster_node_pool" "app_pool" {
  name                  = "appnodepool"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.example.id
  vm_size               = "Standard_DS2_v2"
  node_count            = 2

  max_pods = 110
  os_disk_size_gb = 30
  os_type = "Linux"
  enable_auto_scaling = true
  max_count = 4
  min_count = 2

  node_labels = {
    workload = "node-selector-app"
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "db_pool" {
  name                  = "db-pool"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.example.id
  vm_size               = "Standard_DS2_v2"
  node_count            = 1

  max_pods = 110
  os_disk_size_gb = 30
  os_type = "Linux"
  enable_auto_scaling = true
  max_count = 4
  min_count = 2

  node_labels = {
    workload = "node-selector-db"
  }
}