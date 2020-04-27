terraform {
  backend "azurerm" {
    container_name        =  azurerm_storage_container.test_sc.name # name of storage container within storage account
    resource_group_name   = azurerm_resource_group.test_rs.name
    storage_account_name  = azurerm_storage_account.test_sa.name
    key                   = azurerm_storage_account.test_sa.primary_access_key # name of the blob used to interface terraforms state file inside the storage container
  }
}
