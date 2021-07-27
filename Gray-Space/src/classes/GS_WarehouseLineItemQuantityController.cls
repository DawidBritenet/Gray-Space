public with sharing class GS_WarehouseLineItemQuantityController {

    public static List<GS_WarehouseLineItem__c> checkQuantity(List<GS_WarehouseLineItem__c> newProducts, Map<Id, GS_WarehouseLineItem__c> oldProductsMap) {
        List<GS_Warehouse__c> warehouses;
        Map<String, WarehouseWrapper> warehousesMap;
        List<String> warehouseIds = new List<String>();

        for (GS_WarehouseLineItem__c product : newProducts) {
            warehouseIds.add(product.GS_Warehouse__c);
        }

        warehouses = [SELECT Id, GS_Capacity__c, GS_Used_Capacity__c FROM GS_Warehouse__c WHERE Id in :warehouseIds];
        warehousesMap = toWarehouseWrappers(warehouses);

        for (GS_WarehouseLineItem__c product : newProducts) {
            checkQuantityBelowZero(product);
            checkWarehouseCapacity(product, warehousesMap.get(product.GS_Warehouse__c));
        }
        return  newProducts;
    }

    private static void checkQuantityBelowZero(GS_WarehouseLineItem__c product) {
        if (product.GS_Quantity__c < 0) {
            product.addError('Can not be below 0');
        }
    }

    private static void checkWarehouseCapacity(GS_WarehouseLineItem__c product, WarehouseWrapper warehouse) {

        if (Trigger.isInsert) {
            if (warehouse.usedCapacity + product.GS_Quantity__c > warehouse.capacity) {
                product.addError('Capacity exceeded');
            } else {
                warehouse.usedCapacity += Integer.valueOf(product.GS_Quantity__c);
            }
        }

        if (Trigger.isUpdate) {
            Integer value = Integer.valueOf(product.GS_Quantity__c - ((GS_WarehouseLineItem__C) Trigger.oldMap.get(product.Id)).GS_Quantity__c);
            if (warehouse.usedCapacity + value > warehouse.capacity) {
                product.addError('Capacity exceeded');
            } else {
                warehouse.usedCapacity += Integer.valueOf(value);
            }
        }
    }

    private static Map<String,WarehouseWrapper> toWarehouseWrappers(List<GS_Warehouse__c> warehouses) {
        Map<String,WarehouseWrapper> result = new Map<String,WarehouseWrapper>();

        for (GS_Warehouse__c warehouse : warehouses) {
            result.put(warehouse.Id, new WarehouseWrapper(warehouse.Id, Integer.valueOf(warehouse.GS_Capacity__c), Integer.valueOf(warehouse.GS_Used_Capacity__c)));
        }

        return result;
    }

    class WarehouseWrapper {
        String id;
        Integer capacity;
        Integer usedCapacity;

        public WarehouseWrapper(String Id, Integer capacity, Integer usedCapacity) {
            this.id = id;
            this.capacity = capacity;
            this.usedCapacity = usedCapacity;
        }
    }

}