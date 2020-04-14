output "kube_access_token" {
  value = "${data.google_client_config.default.access_token}"
}

output "kube_ca_cert" {
  value = "${base64decode(data.google_container_cluster.cluster_config.master_auth.0.cluster_ca_certificate)}"
}

output "kube_endpoint" {
  value = "${data.google_container_cluster.cluster_config.endpoint}"
}
output "kube_cluster_name" {
  value = "${google_container_cluster.cluster.name}"
}
