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

