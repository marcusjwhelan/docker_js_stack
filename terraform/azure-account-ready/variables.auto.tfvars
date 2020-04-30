# iam
resource_group_name = "mwK8ResourceGroup"
location = "eastus2"
account_tier = "Standard"
account_replication_type = "LRS"

# log analytics 
log_analytics_workspace_name = "mwk8analytics"

# default cluster
clustername = "cluster-1"
kubernetes_version = "1.15.7"

# default node pool
default_node_count = 2

# Specific node pool size
db_vm_size = "Standard_DS1_v2"