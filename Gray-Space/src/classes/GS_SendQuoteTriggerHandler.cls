public with sharing class GS_SendQuoteTriggerHandler {
    public static void afterInsert(List<GS_SendQuote__e> newSendQuotes, Map<Id,GS_SendQuote__e> newSendQuotesMap) {
        for (GS_SendQuote__e sendQuote : newSendQuotes) {
            GS_QuoteFromOpportunity.createQuoteFromOpportunity(sendQuote.GS_OpportunityId__c);
        }
    }
}