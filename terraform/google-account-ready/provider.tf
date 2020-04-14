# set provider level info to get started
provider "google" {
  version = "~> 3.5"
  project = var.project
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  version     = "~> 2.7"
  project     = var.project
  region      = var.region
}

provider "kubernetes" {
  version = "~> 1.11"
}
