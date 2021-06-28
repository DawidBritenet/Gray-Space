trigger CaseTrigger on Case (before insert, before update) {
    new GS_CaseTriggerHandler().execute();
}