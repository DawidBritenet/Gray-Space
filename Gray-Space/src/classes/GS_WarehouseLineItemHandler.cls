public with sharing class GS_WarehouseLineItemHandler extends GS_TriggerHandler {
    public GS_WarehouseLineItemHandler() {
        super();
    }

    void bulkAfter() {
        GS_WarehouseLineItemQuantityController.checkQuantity((List<GS_WarehouseLineItem__c>) Trigger.new, (Map<Id,GS_WarehouseLineItem__c>) Trigger.oldMap);
        GS_WarehouseLineItemProductController.checkProductsExists((List<GS_WarehouseLineItem__c>) Trigger.new);
    }

}