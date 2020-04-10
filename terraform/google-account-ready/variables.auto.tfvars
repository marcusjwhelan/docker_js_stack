# Provider
credentials_file = "../../creds/google/terraform.json"
project = "docker-js-stack"
region = "us-west1"
zones = ["us-west1-b"]

# State Bucket
bucket_name = "docker-js-stack-bucket"
bucket_prefix = "terraform/state"

# cluster 1
cluster_name = "cluster-1"
cluster_network = "default"
cluster_zone = "us-west1-b"
cluster_node_count = 3

# Node Pool
# machine_type = "n1-standard-2"
# min_count = 1
# max_count = 5
# local_ssd_count = 1
# disk_type = "pd-standard"
# disk_size_gb = 10
# disk_type = "COS"
# service_account = "terraform@docker-js-stack.iam.gserviceaccount.com"
# initial_node_count = 3



