# current user subscription. Would have have to access azure terminal, have to login
data "azurerm_subscription" "current" {}

data "azurerm_client_config" "default" {}
# data "azuread_client_config" "defualt" {} # added with azuread 0.8.0

data "azurerm_role_definition" "builtin" {
  name = "Contributor"
}
# Resource group is needed to manage users priveleges
resource "azurerm_resource_group" "test_rs" {
  name      = var.resource_group_name # mwk8ResourceGroup
  location  = var.location # eastus2
}

# Service principal for cluster
# first you need an azure application
# resource "azuread_application" "aks_sp" {
#   name                        = var.clustername
#   # homepage                    = "https://${var.clustername}"
#   # identifier_uris             = ["https://${var.clustername}"]
#   # reply_urls                  = ["https://${var.clustername}"]
#   available_to_other_tenants  = false # default
#   # public_client               = false # default
#   # oauth2_allow_implicit_flow  = false # default
# }

# service principal
# resource "azuread_service_principal" "sp" {
#   application_id                = azuread_application.aks_sp.application_id
#   app_role_assignment_required  = false # default
# }

# create random password
# resource "random_password" "aks_rnd_sp_pwd" {
#   length  = 32
#   special = true
# }

# resource "azuread_service_principal_password" "aks_sp_pwd" {
#   service_principal_id  = azuread_service_principal.sp.id
#   value                 = random_password.aks_rnd_sp_pwd.result
#   end_date              = "2099-01-01T01:01:01Z"
#   # end_date_relative  = "17520h" # expire in 2 years
# }

# resource "azurerm_role_assignment" "aks_sp_role_assignment" {
#   scope                = data.azurerm_subscription.current.id
#   role_definition_name = data.azurerm_role_definition.builtin.name
#   principal_id         = azuread_service_principal.sp.id

#   depends_on = [
#     azuread_service_principal_password.aks_sp_pwd
#   ]
# }


# ------------ Start
# Not needed but good to know this is possible, was trying to create the 
# storage account and container for the backend terraform state but forgot
# that the terraform backend cannot use any variables and needs to be hard coded.
# Meaning you need to create the storage account and container manually before
# terraform init command.
# 
# resource "azurerm_storage_account" "test_sa" {
#   name                      = "mw_test_storageaccount"
#   resource_group_name       = azurerm_resource_group.test_rs.name
#   location                  = azurerm_resource_group.test_rs.location
#   account_tier              = var.account_tier
#   account_replication_type  = var.account_replication_type
# }

# Storage container needs to be attached to the storage account, this is where the state is stored
# resource "azurerm_storage_container" "test_sc" {
#   name                  = "tsstate"
#   storage_account_name  = azurerm_storage_account.test_sa.name
#   container_access_type = "private"
# } 
# ------------ end