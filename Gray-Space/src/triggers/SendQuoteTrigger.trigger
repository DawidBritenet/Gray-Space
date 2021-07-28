trigger SendQuoteTrigger on GS_SendQuote__e (after insert) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
//            GS_SendQuoteTriggerHandler.afterInsert(Trigger.new, Trigger.newMap);
        }
    }
}