trigger GS_WarehouseLineItemTrigger on GS_WarehouseLineItem__c (after update, after insert) {
    new GS_WarehouseLineItemHandler().execute();
}