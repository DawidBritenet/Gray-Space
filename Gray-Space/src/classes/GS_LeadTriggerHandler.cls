public with sharing class GS_LeadTriggerHandler {

    public static void afterUpdate(List<Lead> oldLeads, List<Lead> newLeads, Map<Id,Lead> oldLeadsMap, Map<Id,Lead> newLeadsMap) {
        checkLeadStatusCanNotGoBackward(newLeads, oldLeadsMap);
    }

    public static void checkLeadStatusCanNotGoBackward(List<Lead> newLeads, Map<Id,Lead> oldLeadsMap) {
        for (Lead lead : newLeads) {
            checkLeadStatus(lead, oldLeadsMap.get(lead.id));
        }
    }

    public static void checkLeadStatus(Lead newLead, Lead oldLead) {
        if (newLead.Status == 'New') {
            if (oldLead.Status == 'GS_Marketing_Materials' || oldLead.Status == 'GS_Meeting' || oldLead.Status == 'GS_Closed_Converted') {
                newLead.addError(System.Label.GS_Can_not_go_Backward);
            }
        } else if (newLead.Status == 'GS_Marketing_Materials') {
            if (oldLead.Status == 'GS_Meeting' || oldLead.Status == 'GS_Closed_Converted') {
                newLead.addError(System.Label.GS_Can_not_go_Backward);
            }
            if (String.isBlank(newLead.GS_Space_Type__c)) {
                newLead.addError(System.Label.GS_Space_Type_Required);
            }
        } else if (newLead.Status == 'GS_Meeting') {
            if (oldLead.Status == 'GS_Closed_Converted') {
                newLead.addError(System.Label.GS_Can_not_go_Backward);
            }
            if (String.isBlank(newLead.GS_Space_Type__c)) {
                newLead.addError(System.Label.GS_Space_Type_Required);
            }
        } else if (newLead.Status == 'GS_Closed_Not_Converted') {
            if (oldLead.Status == 'GS_Closed_Converted') {
                newLead.addError(System.Label.GS_Can_not_go_Backward);
            }
        }
    }
}
