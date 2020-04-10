# Create Service account Terraform in gcp 
resource "google_service_account" "terraform" {
  project      = "${var.project}"
  account_id   = "${var.cluster_name}-admin-sa"
}

# add iam policy bindings to terraform service account in gcp
resource "google_project_iam_member" "terraform-source_admin" {
  project = "${var.project}"
  role    = "roles/source.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-servicemanagement-admin" {
  project = "${var.project}"
  role    = "roles/servicemanagement.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute_networkadmin" {
  project = "${var.project}"
  role    = "roles/compute.networkAdmin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-cloudbuild_builds_editor" {
  project = "${var.project}"
  role    = "roles/cloudbuild.builds.editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-viewer" {
  project = "${var.project}"
  role    = "roles/viewer"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-storage_admin" {
  project = "${var.project}"
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-bigquery_admin" {
  project = "${var.project}"
  role    = "roles/bigquery.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-dataflow_admin" {
  project = "${var.project}"
  role    = "roles/dataflow.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-ml_admin" {
  project = "${var.project}"
  role    = "roles/ml.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-dataproc_editor" {
  project = "${var.project}"
  role    = "roles/dataproc.editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-cloudsql_admin" {
  project = "${var.project}"
  role    = "roles/cloudsql.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-logging_logwriter" {
  project = "${var.project}"
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-monitoring_metricwriter" {
  project = "${var.project}"
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-compute-storage_objectviewer" {
  project = "${var.project}"
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-cloudsql_editor" {
  project = "${var.project}"
  role    = "roles/cloudsql.editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform-cloudsql_client" {
  project = "${var.project}"
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}