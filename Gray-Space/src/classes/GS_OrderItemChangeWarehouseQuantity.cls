public with sharing class GS_OrderItemChangeWarehouseQuantity {

    public static void updateWarehouseQuantity(List<OrderItem> orderItems) {
        List<String> productsIds = new List<String>();
        List<GS_WarehouseLineItem__c> warehouseLineItems;
        List<GS_WarehouseLineItem__c> warehouseLineItemsToDelete = new List<GS_WarehouseLineItem__c>();
        List<GS_WarehouseLineItem__c> warehouseLineItemsToUpdate = new List<GS_WarehouseLineItem__c>();

        for (OrderItem orderItem : orderItems) {
            productsIds.add(orderItem.Product2Id);
        }
        warehouseLineItems = [SELECT Id, GS_Quantity__c, GS_ProductId__c FROM GS_WarehouseLineItem__c WHERE GS_ProductId__c IN :productsIds];

        for (OrderItem orderItem : orderItems) {
            Decimal quantity = orderItem.Quantity;
            for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
                if (quantity > 0) {
                    quantity = check(orderItem, warehouseLineItem, quantity);
                }
            }
        }

        for (GS_WarehouseLineItem__c warehouseLineItem : warehouseLineItems) {
            if (warehouseLineItem.GS_Quantity__c == 0) {
                warehouseLineItemsToDelete.add(warehouseLineItem);
            } else {
                warehouseLineItemsToUpdate.add(warehouseLineItem);
            }
        }

        update warehouseLineItemsToUpdate;
        delete warehouseLineItemsToDelete;

    }

    private static Decimal check(OrderItem orderItem, GS_WarehouseLineItem__c warehouseLineItem, Decimal quantity) {
        if (orderItem.Product2Id == warehouseLineItem.GS_ProductId__c) {
            if (quantity <= warehouseLineItem.GS_Quantity__c) {
                warehouseLineItem.GS_Quantity__c -= quantity;
                quantity = 0;
            } else {
                quantity -= warehouseLineItem.GS_Quantity__c;
                warehouseLineItem.GS_Quantity__c = 0;
            }
        }

        return quantity;
    }


}