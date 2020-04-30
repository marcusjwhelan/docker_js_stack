# iam
variable "resource_group_name" {
  type = string
  description = "name of the resource group to govern this application setup"
}
variable "location" {
  type = string
  description = "Where all the this application setup should be sourced from, EX: eastus2"
}
variable "account_tier" {
  type = string
}
variable "account_replication_type" {
  type = string
  description = "Type of storage type, options https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy"
}



# log analytics
variable "log_analytics_workspace_name" {
  type = string
}
variable "log_analytics_workspace_sku" {
  type = string
  default = "PerGB2018" # Error: expected sku to be one of [Free PerGB2018 PerNode Premium Standalone Standard Unlimited], got MWGB2020
}


# default cluster
variable "clustername" {
  type = string
  description = "Name of the cluster and the azuread application"
}
variable "kubernetes_version" {
  type = string
  default = "1.15.7"
}

# default node pool
variable "default_node_count" {
  type = number
  default = 2
}
variable "default_vm_size" {
  type = string
  default = "Standard_D2_v2"
}
variable "default_os_type" {
  type = string
  default = "Linux"
}
variable "default_os_disk_size_gb" {
  type = number
  default = 30
}
variable "default_max_pods" {
  type = number
  default = 110
}


# default network profile
variable "default_network_plugin" {
  type = string
  default = "kubenet"
}
variable "default_network_policy" {
  type = string
  default = "calico"
}

# Specific node pool size
variable "db_vm_size" {
  type = string
}