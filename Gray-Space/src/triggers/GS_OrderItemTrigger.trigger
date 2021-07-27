trigger GS_OrderItemTrigger on OrderItem (after insert) {
    new GS_OrderItemTriggerHandler().execute();
}