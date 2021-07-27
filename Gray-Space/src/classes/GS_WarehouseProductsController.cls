public with sharing class GS_WarehouseProductsController {

    @AuraEnabled(cacheable=true)
    public static List<Product> getProductsStorageManager(String warehouseId) {
        List<Product> products = getProductsFromWarehouse(warehouseId);
        List<String> productsIds = new List<String>();
        List<Product2> productsToAdd;

        for (Product product : products) {
            productsIds.add(product.id);
        }

        productsToAdd = [SELECT Id, Name FROM Product2 WHERE Id NOT IN :productsIds];

        for (Product2 product : productsToAdd) {
            products.add(new Product(product.Id, product, 0));
        }

        return products;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product> getProductsFromWarehouse(String warehouseId) {
        Map<String, Product2> products2;
        List<Product> products = new List<Product>();
        List<String> productsIds = new List<String>();
        List<GS_WarehouseLineItem__c> warehouseLineItems = [SELECT Id, GS_ProductId__c, GS_Quantity__c FROM GS_WarehouseLineItem__c WHERE GS_Warehouse__c = :warehouseId];

        for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
            productsIds.add(warehouseLineItem.GS_ProductId__c);
        }

        products2 = new Map<String, Product2>([SELECT Id, Name FROM Product2 WHERE Id in :productsIds]);

        for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
            products.add(new Product(warehouseLineItem.GS_ProductId__c, products2.get(warehouseLineItem.GS_ProductId__c), Integer.valueOf(warehouseLineItem.GS_Quantity__c)));
        }

        return products;
    }

    @AuraEnabled
    public static void updateProducts(Map<String, Integer> products, String warehouseId) {
        List<GS_WarehouseLineItem__c> warehouseProducts = [SELECT GS_Quantity__c, GS_ProductId__c, GS_Warehouse__c FROM GS_WarehouseLineItem__c WHERE GS_Warehouse__c = :warehouseId];
        List<GS_WarehouseLineItem__c> productsToUpdate = new List<GS_WarehouseLineItem__c>();
        List<GS_WarehouseLineItem__c> productsToInsert = new List<GS_WarehouseLineItem__c>();
        List<GS_WarehouseLineItem__c> productsToDelete = new List<GS_WarehouseLineItem__c>();
        Map<String, GS_WarehouseLineItem__c> warehouseProductsMap = new Map<String, GS_WarehouseLineItem__c>();

        for (GS_WarehouseLineItem__c product : warehouseProducts) {
            warehouseProductsMap.put(product.GS_ProductId__c, product);
        }

        for (String productId : products.keySet()) {
            if (warehouseProductsMap.containsKey(productId)) {
                GS_WarehouseLineItem__c warehouseLineItem = warehouseProductsMap.get(productId);
                if (products.get(productId) != 0) {
                    warehouseLineItem.GS_Quantity__c = products.get(productId);
                    productsToUpdate.add(warehouseLineItem);
                } else {
                    productsToDelete.add(warehouseLineItem);
                }
            } else {
                if (products.get(productId) != 0) {
                    GS_WarehouseLineItem__c warehouseLineItem = new GS_WarehouseLineItem__c(GS_Warehouse__c = warehouseId, GS_ProductId__c = productId, GS_Quantity__c = products.get(productId));
                    productsToInsert.add(warehouseLineItem);
                }
            }
        }

        delete productsToDelete;
        update productsToUpdate;
        insert productsToInsert;
    }

    @AuraEnabled
    public static Integer getAllStock(String productId) {
        List<GS_WarehouseLineItem__c> products = [SELECT GS_Quantity__c FROM GS_WarehouseLineItem__c WHERE GS_ProductId__c = :productId];
        Integer quantity = 0;

        for (GS_WarehouseLineItem__c product : products) {
            quantity += Integer.valueOf(product.GS_Quantity__c);
        }

        return quantity;
    }

    @AuraEnabled(cacheable=true)
    public static List<GS_Warehouse__c> getWarehousesWithProduct(String productId) {
        List<GS_WarehouseLineItem__c> products = [SELECT GS_Warehouse__c FROM GS_WarehouseLineItem__c WHERE GS_ProductId__c = :productId];
        List<String> warehousesIds = new List<String>();
        List<GS_Warehouse__c> warehouses;

        for (GS_WarehouseLineItem__c product : products) {
            warehousesIds.add(product.GS_Warehouse__c);
        }

        warehouses = [SELECT Name, GS_Street__c, GS_State__c, GS_PostalCode__c, GS_Phone__c, GS_Country__c, GS_City__c, GS_Used_Capacity__c, GS_Capacity__c, (SELECT GS_Quantity__c FROM WarehouseLineItems__r WHERE GS_ProductId__c = :productId) FROM GS_Warehouse__c WHERE Id IN :warehousesIds];

        return warehouses;
    }

    class Product {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public Product2 product;
        @AuraEnabled
        public Integer quantity;

        public Product(String id, Product2 product, Integer quantity) {
            this.id = id;
            this.product = product;
            this.quantity = quantity;
        }
    }
}