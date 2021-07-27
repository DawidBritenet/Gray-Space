public with sharing class GS_WarehouseController {

    @AuraEnabled(cacheable=true)
    public static GS_Warehouse__c getWarehouse(String warehouseId){
        System.debug(warehouseId);
        try {
            return [SELECT Name, GS_Street__c, GS_State__c, GS_PostalCode__c, GS_Phone__c, GS_Country__c, GS_City__c, GS_Used_Capacity__c, GS_Capacity__c FROM GS_Warehouse__c WHERE Id = :warehouseId];
        } catch (Exception exep) {
            throw new AuraHandledException(exep.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<GS_Warehouse__c> getWarehouses(){
        try {
            return [SELECT Name, GS_Street__c, GS_State__c, GS_PostalCode__c, GS_Phone__c, GS_Country__c, GS_City__c, GS_Used_Capacity__c, GS_Capacity__c FROM GS_Warehouse__c];
        } catch (Exception exep) {
            throw new AuraHandledException(exep.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<GS_Warehouse__c> searchWarehouses(String searchTerm) {
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getWarehouses();
        }
        searchTerm = '%' + searchTerm + '%';
        return [
            SELECT
            Name, GS_Street__c, GS_State__c, GS_PostalCode__c, GS_Phone__c, GS_Country__c, GS_City__c, GS_Capacity__c FROM GS_Warehouse__c
            WHERE Name LIKE :searchTerm
            ORDER BY Name
            LIMIT 50
        ];
    }
}