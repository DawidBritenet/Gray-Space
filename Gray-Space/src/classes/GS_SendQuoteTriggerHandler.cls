public with sharing class GS_SendQuoteTriggerHandler extends GS_TriggerHandler {

    public GS_SendQuoteTriggerHandler() {
        super();
    }

    public void afterInsert(GS_SendQuote__e sendQuote) {
        GS_QuoteFromOpportunity.createQuoteFromOpportunity(sendQuote.GS_OpportunityId__c);
    }
}