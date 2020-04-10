#

# set provider level info to get started
provider "google" {
  version = "3.5.0"

  credentials = file("<NAME>.json")

  project = "<PROJECT_ID>"
  region  = "us-central1"
  zone    = "us-central1-c"
}

# setup your network
resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

# here terraform

# create a vm instance with its boot disk 
resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name
    access_config {
    }
  }
}