output "id" {
  value = azurerm_kubernetes_cluster.cluster_1.id
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.cluster_1.kube_config_raw
}

output "client_key" {
  value = azurerm_kubernetes_cluster.cluster_1.kube_config.0.client_key
}

output "client_certificate" {
  value = azurerm_kubernetes_cluster.cluster_1.kube_config.0.client_certificate
}

output "cluster_ca_certificate" {
  value = azurerm_kubernetes_cluster.cluster_1.kube_config.0.cluster_ca_certificate
}

output "host" {
  value = azurerm_kubernetes_cluster.cluster_1.kube_config.0.host
}

output "network_plugin" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.network_plugin
}

output "network_policy" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.network_policy
}

output "service_cidr" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.service_cidr
}

output "dns_service_ip" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.dns_service_ip
}

output "docker_bridge_cidr" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.docker_bridge_cidr
}

output "pod_cidr" {
  value = azurerm_kubernetes_cluster.cluster_1.network_profile.0.pod_cidr
}


# output "display_name" {
#   value = azuread_service_principal.sp.display_name
# }

# output "client_id" {
#   value = azuread_application.aks_sp.application_id
# }

# output "client_secret" {
#   value     = azuread_service_principal_password.aks_sp_pwd.value
#   sensitive = true
# }

# output "object_id" {
#   value = azuread_service_principal.sp.id
# }