
resource "random_id" "log_analytics_workspace_name_suffix" {
  byte_length = 8
}

resource "azurerm_log_analytics_workspace" "test_law" {
  # The WorkSpace name has to be unique across the whole of azure, not just the current subscription/tenant.
  name                = "${var.log_analytics_workspace_name}${random_id.log_analytics_workspace_name_suffix.dec}"
  location            = azurerm_resource_group.test_rs.location
  resource_group_name = azurerm_resource_group.test_rs.name
  sku                 = var.log_analytics_workspace_sku
}

resource "azurerm_log_analytics_solution" "test_las" {
  solution_name         = "ContainerInsights"
  location              = azurerm_log_analytics_workspace.test_law.location
  resource_group_name   = azurerm_resource_group.test_rs.name
  workspace_resource_id = azurerm_log_analytics_workspace.test_law.id
  workspace_name        = azurerm_log_analytics_workspace.test_law.name

  plan {
      publisher = "Microsoft"
      product   = "OMSGallery/ContainerInsights"
  }
}


# The Azure cluster.
resource "azurerm_kubernetes_cluster" "cluster_1" {
  name                = var.clustername
  location            = azurerm_resource_group.test_rs.location
  resource_group_name = azurerm_resource_group.test_rs.name
  dns_prefix          = "example1"
  kubernetes_version  = var.kubernetes_version

  # linux_profile {
  #   admin_username = "ubuntu"

  #   ssh_key {
  #     key_data = file(var.ssh_public_key)
  #   }
  # }

  default_node_pool {
    name            = "default"
    node_count      = var.default_node_count
    vm_size         = var.default_vm_size
    os_disk_size_gb = var.default_os_disk_size_gb
  }

  service_principal {
    client_id     = azuread_application.aks_sp.application_id # "88a175a9-5171-4aca-902d-de075570b859" # 
    client_secret = random_password.aks_rnd_sp_pwd.result # "610a430e-8bcc-41fe-ba6e-888034dc801d" # 
  }

  network_profile {
    network_plugin = var.default_network_plugin
    network_policy = var.default_network_policy
  }

  addon_profile {
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.test_law.id
    }
  }

  depends_on = [
    azurerm_role_assignment.aks_sp_role_assignment,
    azuread_service_principal_password.aks_sp_pwd
  ]
}


resource "azurerm_kubernetes_cluster_node_pool" "app_pool" {
  name                  = "appnodepool"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.cluster_1.id
  vm_size               = var.default_vm_size
  node_count            = var.default_node_count

  max_pods              = var.default_max_pods
  os_disk_size_gb       = var.default_os_disk_size_gb
  os_type               = var.default_os_type
  enable_auto_scaling   = true
  max_count             = 4
  min_count             = 2

  node_labels = {
    workload = "node-selector-app"
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "db_pool" {
  name                  = "dbpool"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.cluster_1.id
  vm_size               = var.db_vm_size
  node_count            = 1

  max_pods              = var.default_max_pods
  os_disk_size_gb       = var.default_os_disk_size_gb
  os_type               = var.default_os_type
  enable_auto_scaling   = false

  node_labels = {
    workload = "node-selector-db"
  }
}