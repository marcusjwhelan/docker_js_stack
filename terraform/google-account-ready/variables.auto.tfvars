# Provider
credentials_file = "../../creds/google/terraform.json"
project = "docker-js-stack"
region = "us-west1"
zones = ["us-west1-b"]
zone = "us-west1-b"

# State Bucket
bucket_name = "docker-js-stack-bucket"
bucket_prefix = "terraform/state"

# cluster
cluster_name = "cluster-1"
env_label = "prod"
network_policy_enabled = true
issue_client_certificate = false
network = "default"
subnetwork = "default"
min_master_version = ""
timeout = "30m"

# Node Pools
node_version = ""
auto_repair = true
auto_upgrade = false
max_pods_per_node = 110

# Node Pools Config
node_pool_local_ssd_count = "0"
node_pool_disk_type = "pd-standard"
node_pool_disk_size_gb = "10"

# Main Node Pool
main_node_pool_name = "api-node-pool"
main_node_pool_initial_node_count = 2
main_node_pool_min_nodes = 1
main_node_pool_max_nodes = 4

# Main Node Pool Node Config
main_node_pool_machine_type = "n1-standard-2"

# SQL Node Pool
sql_node_pool_name = "sql-node-pool"
sql_node_pool_initial_node_count = 1
sql_node_pool_min_nodes = 1
sql_node_pool_max_nodes = 1

# SQL Node Pool Node Config
sql_node_pool_machine_type = "n1-standard-1"

# SQL Persistent Volume Disk
disk_name = "disk-1"
disk_type = "pd-ssd"
disk_size = 10
disk_block_size_bytes = 4096

