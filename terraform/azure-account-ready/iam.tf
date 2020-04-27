# Resource group is needed to manage users priveleges
resource "azurerm_resource_group" "test_rs" {
    name = var.resource_group_name # mwk8ResourceGroup
    location = var.location # eastus2
}

# need to create this for backend storage of terraform
resource "azurerm_storage_account" "test_sa" {
  name = "mw_test_storageaccount"
  resource_group_name = azurerm_resource_group.test_rs.name
  location = azurerm_resource_group.test_rs.location
  account_tier = "Standard"
  account_replication_type = "LRS" # options https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
}

# Storage container needs to be attached to the storage account, this is where the state is stored
resource "azurerm_storage_container" "test_sc" {
  name = "ts_state"
  storage_account_name = azurerm_storage_account.test_sa.name
  container_access_type = "blob"
} 
