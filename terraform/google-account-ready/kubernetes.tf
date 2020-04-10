
# Allows other resources to refer to things like the authorization token for
# the configured Google account
data "google_client_config" "default" {}

# The GKE cluster. The node pool is managed as a separate resource below.
resource "google_container_cluster" "stack_cluster" {
  depends_on = [
    "google_service_account.terraform",
  ]

  provider = "google-beta"

  name     = var.cluster_name
  location = var.cluster_zone
  project  = var.project

  # TPU requires a separate ip range (https://cloud.google.com/tpu/docs/kubernetes-engine-setup)
  # Disable it for now until we figure out how it works with xpn network
  enable_tpu = false

  min_master_version = var.min_master_version

  network    = var.network
  subnetwork = var.subnetwork

  # https://www.terraform.io/docs/providers/google/r/container_cluster.html
  # recommends managing the node pool as a separate resource, which we do
  # below.
  remove_default_node_pool = true
  initial_node_count       = "1"

  resource_labels = {
    "application" = "js-stack"
    "env"         = var.env_label
  }

  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }

    http_load_balancing {
      disabled = false
    }

    kubernetes_dashboard {
      disabled = true
    }

    network_policy_config {
      disabled = "${var.network_policy_enabled == false ? true : false}"
    }

  }

  enable_legacy_abac = false

  master_auth {
    client_certificate_config {
      issue_client_certificate = var.issue_client_certificate
    }

    # Setting an empty username disables basic auth
    # From https://cloud.google.com/sdk/gcloud/reference/container/clusters/create:
    # --no-enable-basic-auth is an alias for --username=""
    username = ""

    # password is required if username is present
    password = ""
  }

  network_policy {
    enabled  = var.network_policy_enabled
    provider = "${var.network_policy_enabled == true ? "CALICO" : null}"
  }

  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"

  timeouts {
    create = var.timeout
    update = var.timeout
    delete = var.timeout
  }

  # node auto-provisioning, they screwed up the name of fields here
  # https://github.com/terraform-providers/terraform-provider-google/issues/3303#issuecomment-477251119
  cluster_autoscaling {
    enabled = false
  }
}

resource "google_container_node_pool" "main_pool" {
  # max_pods_per_node is in google-beta as of 2019-07-26
  provider = "google-beta"

  cluster  = google_container_cluster.stack_cluster.name
  location = var.cluster_zone
  project  = var.project

  name = var.main_node_pool_name

  version            = var.node_version
  initial_node_count = var.main_node_pool_initial_node_count

  management {
    auto_repair  = var.auto_repair
    auto_upgrade = var.auto_upgrade
  }

  autoscaling {
    min_node_count = var.main_node_pool_min_nodes
    max_node_count = var.main_node_pool_max_nodes
  }

  max_pods_per_node = var.max_pods_per_node

  node_config {
    machine_type = var.main_node_pool_machine_type
    min_cpu_platform = "Intel Broadwell"
    disk_size_gb = 10
    service_account = google_service_account.terraform.email
    # the k8s labels for these nodes in this node pool
    labels = {
      "workload" = "node-selector-app"
    }
    // These scopes are needed for the GKE nodes' service account to have pull rights to GCR.
    // Default is "https://www.googleapis.com/auth/logging.write" and "https://www.googleapis.com/auth/monitoring".
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/devstorage.read_only",
    ]
  }

  timeouts {
    create = var.timeout
    update = var.timeout
    delete = var.timeout
  }
}

resource "google_container_node_pool" "sql_pool" {
  # max_pods_per_node is in google-beta as of 2019-07-26
  provider = "google-beta"

  cluster  = google_container_cluster.stack_cluster.name
  location = var.cluster_zone
  project  = var.project

  name = var.sql_node_pool_name

  version            = var.node_version
  initial_node_count = var.sql_node_pool_initial_node_count

  management {
    auto_repair  = var.auto_repair
    auto_upgrade = var.auto_upgrade
  }

  autoscaling {
    min_node_count = var.sql_node_pool_min_nodes
    max_node_count = var.sql_node_pool_max_nodes
  }

  max_pods_per_node = var.max_pods_per_node

  node_config {
    machine_type = var.sql_node_pool_machine_type

    min_cpu_platform = "Intel Broadwell"

    service_account = google_service_account.terraform.email
    labels = {
      "workload" = "node-selector-db"
    }
    // These scopes are needed for the GKE nodes' service account to have pull rights to GCR.
    // Default is "https://www.googleapis.com/auth/logging.write" and "https://www.googleapis.com/auth/monitoring".
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/trace.append" 
    ]
  }

  timeouts {
    create = var.timeout
    update = var.timeout
    delete = var.timeout
  }
}

# the disk for the persisten volume for the sql node
resource "google_compute_disk" "sql_persistent_volume" {
  name = var.disk_name # disk-1
  zone = var.cluster_zone # us-west1-b
  project = var.project # docker-js-stack
  type = var.disk_type # pd-ssd
  size = var.disk_size # 10
  physical_block_size_bytes = 4096
}
