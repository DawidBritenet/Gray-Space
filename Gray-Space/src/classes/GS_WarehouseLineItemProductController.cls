public with sharing class GS_WarehouseLineItemProductController {

    public static void checkProductsExists(List<GS_WarehouseLineItem__c> warehouseLineItems) {
        List<String> productIds = new List<String>();
        Map<String, Product2> products;

        for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
            productIds.add(warehouseLineItem.GS_ProductId__c);
        }
        products = new Map<String, Product2>([SELECT Id FROM Product2 WHERE Id in :productIds]);

        for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
            Product2 product = products.get(warehouseLineItem.GS_ProductId__c);
            if (product == null) {
                warehouseLineItem.addError('Product not exists');
            }

        }

    }

}