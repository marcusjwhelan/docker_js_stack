# Provider
variable "credentials_file" {
  type = string
  description = "relative path to credentials file - key for terraform"
}
variable "project" {
  type = string
  description = "Project ID"
}
variable "region" {
  type = string
  description = "Ex: us-west1"
}
variable "zone" {
  type = string
  description = "specific zone within region to manage from"
}
variable "zones" {
  type = list(string)
  description = "array of zones: us-west1-a, ..."
}

# State Bucket
variable "bucket_name" {
  type = string
  description = "Name of terraform state bucket"
}
variable "bucket_prefix" {
  type = string
  description = "prefix of terraform state bucket"
}

# cluster
variable "cluster_name" {
  type = string
  description = "Name of cluster in project"
}
variable "env_label" {
  description = "Environment label: test, dev, prod"
}
variable network_policy_enabled {
  description = "Boolean, to enable Network Policy or not"
  default     = true
}
variable "issue_client_certificate" {
  description = "Ideally this should always be set to false, this feature is going away eventually. https://www.terraform.io/docs/providers/google/r/container_cluster.html#client_certificate_config"
  default     = false
}
# TODO: support for a regional cluster? https://cloud.google.com/kubernetes-engine/docs/concepts/regional-clusters
variable "network" {
  description = "Set this to the network of another project (along with subnetwork, cluster_secondary_range_name, and services_secondary_range_name, to enable Shared VPC. Set to network of project for non-Shared VPC. https://www.terraform.io/docs/providers/google/r/container_cluster.html#network"
}
variable "subnetwork" {
  description = "https://www.terraform.io/docs/providers/google/r/container_cluster.html#subnetwork"
}
variable "min_master_version" {
  type = string
  description = "Minimum version of Kubernetes to install on master (optional), see https://www.terraform.io/docs/providers/google/r/container_cluster.html#min_master_version"
  default     = ""
}
variable "timeout" {
  type = string
  default = "30m"
}

# Node Pools
variable "node_version" {
  description = "(optional) https://www.terraform.io/docs/providers/google/r/container_cluster.html#node_version"
  default     = ""
}
variable "auto_repair" {
  default = "true"
}
variable "auto_upgrade" {
  default = "false"
}
variable "max_pods_per_node" {
  type = number
  description = "Sets the default_max_pods_per_node setting on the container_cluster resource."
  default     = 110 # had issues changing this
}

# Node Pools Config
variable "node_pool_local_ssd_count" {
  type = number
  description = "(Optional) The amount of local SSD disks that will be attached to each cluster node. Defaults to 0."
}
variable "node_pool_disk_type" {
  type = string
  description = " (Optional) Type of the disk attached to each node (e.g. 'pd-standard' or 'pd-ssd'). If unspecified, the default disk type is 'pd-standard'"
}
variable "node_pool_disk_size_gb" {
  type = string
  description = "(Optional) Size of the disk attached to each node, specified in GB. The smallest allowed disk size is 10GB. Defaults to 100GB."
}

# Main Node Pool
variable "main_node_pool_name" {}
variable "main_node_pool_initial_node_count" {
  type = number
  default = 2
}
variable "main_node_pool_min_nodes" {
  type = number
  description = "minimum count of this node pool"
}
variable "main_node_pool_max_nodes" {
  type = number
  description = "max count or overflow of nodes in this pool"
}

# Main Node Pool Node Config
variable "main_node_pool_machine_type" {
  type = string
  description = "Specific machine type from google"
}

# SQL Node Pool
variable "sql_node_pool_name" {}
variable "sql_node_pool_initial_node_count" {
  type = number
  default = 1
}
variable "sql_node_pool_min_nodes" {
  type = number
  description = "minimum count of this node pool"
}
variable "sql_node_pool_max_nodes" {
  type = number
  description = "max count or overflow of nodes in this pool"
}

# SQL Node Pool Node Config
variable "sql_node_pool_machine_type" {
  type = string
  description = "Specific machine type from google"
}

# SQL Persistent Volume Disk
variable "disk_name" {}
variable "disk_type" {
  type = string
  description = "pre-described disk types by google pd-ssd and others."
}
variable "disk_size" {
  type = number
  description = 10 # smallest is 10 only if using ssd. 100 if not
}
variable "disk_block_size_bytes" {
  type = number
  description = " (Optional) Physical block size of the persistent disk, in bytes. If not present in a request, a default value is used. Currently supported sizes are 4096 and 16384, other sizes may be added in the future. If an unsupported value is requested, the error message will list the supported values for the caller's project."
}