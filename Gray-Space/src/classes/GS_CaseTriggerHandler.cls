public with sharing class GS_CaseTriggerHandler extends GS_TriggerHandler {
    public GS_CaseTriggerHandler() {
        super();
    }

    public void bulkAfter() {
        Entitlement entitlement = [SELECT Id FROM Entitlement WHERE Name = 'Case Payment Entitlement'];

        if (Trigger.isInsert) {


            for ()

        }
    }

    public void beforeInsert(SObject so) {
        Case newCase = (Case) so;
        assignEntitlement(newCase);
        assignQueue(newCase);
    }

    private void assignEntitlement(Case newCase) {
        if (newCase.Type == 'Payment') {
            Entitlement entitlement = [SELECT Id FROM Entitlement WHERE Name = 'Case Payment Entitlement'];
            newCase.EntitlementId = entitlement.Id;
        }
    }

    private void assignQueue(Case newCase) {
        newCase.OwnerId = '00G09000001KZbBEAW';
    }
}