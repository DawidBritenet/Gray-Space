public with sharing class GS_CaseTriggerHandler extends GS_TriggerHandler {
    Entitlement entitlement;
    String queueId;

    public GS_CaseTriggerHandler() {
        super();
        GS_General__c settings = GS_General__c.getOrgDefaults();
        queueId = settings.GS_Case_queueID__c;
        entitlement = [SELECT Id FROM Entitlement WHERE Name = :settings.GS_Case_Entitlement__c];
    }


    public void beforeInsert(SObject so) {
        Case newCase = (Case) so;
        newCase.EntitlementId = entitlement.Id;
        newCase.OwnerId = queueId;
    }
}