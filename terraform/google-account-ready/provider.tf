# set provider level info to get started
provider "google" {
  version = "~> 3.17"
  project = var.project
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  version     = "~> 3.17"
  project     = var.project
  region      = var.region
}

# need this to initialize kubectl
provider "kubernetes" {
  version                = "~> 1.11"
  load_config_file       = false
  host                   = data.google_container_cluster.cluster_config.endpoint
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(data.google_container_cluster.cluster_config.master_auth.0.cluster_ca_certificate)
}