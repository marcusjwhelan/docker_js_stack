# set provider level info to get started
provider "google" {
  version = "~> 3.5"

  credentials = file(var.credentials_file)
  project = var.google_project
  region  = var.google_region
  zone    = var.google_zones
}

provider "google-beta" {
  version     = "~> 2.7"
  credentials = file(var.credentials)
  project     = var.google_project
  region      = var.google_region
}
