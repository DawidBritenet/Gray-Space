public with sharing class GS_OrderItemTriggerHandler extends GS_TriggerHandler {
    public GS_OrderItemTriggerHandler() {
        super();
    }

    public void bulkAfter() {
        GS_OrderItemChangeWarehouseQuantity.updateWarehouseQuantity(Trigger.new);
    }
}