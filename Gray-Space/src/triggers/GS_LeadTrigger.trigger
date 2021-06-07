trigger GS_LeadTrigger on Lead (after update) {
    if (Trigger.isAfter) {
        if (Trigger.isUpdate) {
            GS_LeadTriggerHandler.afterUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
        }
    }
}
