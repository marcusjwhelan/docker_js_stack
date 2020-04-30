terraform {
  # configuration example https://docs.microsoft.com/en-us/azure/developer/terraform/store-state-in-azure-storage
  backend "azurerm" {
    container_name        = "mwtfstatecontainer" # name of storage container within storage account
    resource_group_name   = "mw_terraform_state_rs"
    storage_account_name  = "mwterraform90901"
    key                   = "terraform.tfstate" # It looks like this WILL be the name, No name is present till terraform init is completed.
  }
}
