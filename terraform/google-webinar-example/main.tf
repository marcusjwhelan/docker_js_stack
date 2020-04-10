# set provider level info to get started
provider "google" {
  version = "3.5.0"

  credentials = "${file(var.credentials_file)}"
  project = "${var.google_project}"
  region  = "${var.google_region}"
  zone    = "${var.google_zones}"
}

provider "google-beta" {
  version     = "2.7.0"
  credentials = "${file(var.credentials)}"
  project     = "${var.google_project}"
  region      = "${var.google_region}"
}



# bellow is what was shown to give access to billing and create
# individual projects per user
resource "random_id" "user_project" {
  count = "${length(var.users)}"
  byte_length = "4" # 4 byte length 
}

resource "google_project" "user_project" {
  count = "${length(var.users)}" # count param. is create n or more of these projects
  name = "user-${element(random_id.user_project.*.hex, count.index)}"
  project_id = "user-${element(random_id.user_project.*.hex, count.index)}"
  billing_account = "${var.billing_id}"
  org_id = "${var.org_id}"
}

data "google_iam_policy" "user_project" {
  count = "${length(var.users)}"

  # we should give ourselves complete access to their project
  binding = {
    role = "roles/owner"
    members = [
      "user:marcus.j.whelan@gmail.com"
    ]
  }
  # here we give the individual user access to his project to edit
  binding = {
    role = "roles/editor"
    # actual policy will have quotas and limits - no bitcode mining
    members = [
      "user:${element(var.users, count.index)}"
    ]
  }
}
# map a policy to a project to a user
resource "google_project_iam_policy" "user_project" {
  count = "${length(var.users)}"
  project = "${element(google_project.user_project.*.project_id, count.index)}"
  project_data = "${element(data.google_iam_policy.user_project.*.policy_data, count.index)}"
}
# add services to project
resource "google_project_services" "user_project" {
  count = "${length(var.users)}"
  project = "${element(google_project.user_project.*.project_id, count.index)}"

  services = [
    # 2017 vidoe example
    "containerregistry.googleapis.com",
    "pubsub.googleapis.com",
    "deploymentmanager.googleapis.com",
    "replicapool.googleapis.com",
    "resourceviews.googleapis.com",
    "compute-component.googleapis.com",
    "container.googleapis.com",
    "storage-api.googleapis.com",

    # what I have in an api request currently
    "https://www.googleapis.com/auth/devstorage.read_only",
    "https://www.googleapis.com/auth/logging.write",
    "https://www.googleapis.com/auth/monitoring",
    "https://www.googleapis.com/auth/servicecontrol",
    "https://www.googleapis.com/auth/service.management.readonly",
    "https://www.googleapis.com/auth/trace.append"
  ]
}

# here we launch an instance for the user - this is where you would have
# to make their server for their game.
resource "google_compute_instance" "user_project" {
  count = "${length(var.user)}"
  name = "default"
  machine_type = "n1-standard-1"
  zone = "us-central1-a"

  can_ip_forward = true

  project = "${element(google_project_services.user_project.*.project, count.index)}"

  disk {
    type = "local-ssd"
    scratch = true
  }

  metadata {
    ssh-keys = "root:${file("~/.ssh/id_rsa.pub")}" # was setting local ssh key to give me access to anyone machine
  }

  network_interface {
    network = "default"
    access_config {} # allows users to ssh into their machine
  }
}
