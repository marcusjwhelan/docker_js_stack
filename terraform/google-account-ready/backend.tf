terraform {
  required_version = ">= 0.12.24"
  # here you would set a storage option for state.

  # Note: Among all .tf files, only variables in the 
  # terraform {…} block are not set externally and 
  # none of the Terraform built-in functions can be 
  # used in this block. Because the terraform {…} block 
  # in main.tf must first run.
  backend "gcs" {
    bucket = "docker-js-stack-bucket"
    prefix = "terraform/state"
    credentials = "../../creds/google/terraform.json"
  }
}