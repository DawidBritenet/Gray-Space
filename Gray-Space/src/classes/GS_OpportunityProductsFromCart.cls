public without sharing class GS_OpportunityProductsFromCart {

    @InvocableMethod
    public static void cartToOpportunityProducts(List<String> opportunityIds) {
        Map<String, Integer> cart = (Map<String, Integer>) Cache.Session.get('cart');
        String opportunityId = opportunityIds[0];
        Opportunity opportunity = [SELECT Owner.ContactId FROM Opportunity WHERE Id = :opportunityId];
        Map<String, Product2> products = new Map<String, Product2>([SELECT Id, GS_Type__c FROM Product2 WHERE Id IN :cart.keySet()]);
        List<PricebookEntry> priceBooks = [SELECT Id, UnitPrice, Product2Id, Pricebook2.IsStandard FROM PricebookEntry WHERE Product2Id in :cart.keySet() AND Pricebook2.IsStandard = TRUE];
        List<OpportunityLineItem> productsToDelete = [SELECT Quantity, TotalPrice, Product2Id FROM OpportunityLineItem WHERE OpportunityId = :opportunityId];
        List<OpportunityLineItem> productsToAdd = new List<OpportunityLineItem>();
        List<GS_Club_Member__c> clubMembers = [SELECT GS_Member__c, GS_Interest_In__c FROM GS_Club_Member__c];

        for (String productId : cart.keySet()) {
            if (cart.get(productId) > 0) {
                Decimal unitPrice;
                PricebookEntry price;
                for (PricebookEntry pricebookEntry : priceBooks) {
                    if (pricebookEntry.Product2Id == productId) {
                        price = pricebookEntry;
                        unitPrice = pricebookEntry.UnitPrice;
                        if (pricebookEntry.Pricebook2.IsStandard) {
                            for (GS_Club_Member__c clubMember : clubMembers) {
                                if (clubMember.GS_Member__c == opportunity.Owner.ContactId) {
                                    if (clubMember.GS_Interest_In__c == products.get(productId).GS_Type__c) {
                                        unitPrice = pricebookEntry.UnitPrice * 0.95;
                                    }
                                }
                            }
                        }
                    }
                }

                OpportunityLineItem product = new OpportunityLineItem(OpportunityId = opportunityId, Product2Id = productId, Quantity = cart.get(productId), unitPrice = unitPrice, PricebookEntryId = price.Id);
                productsToAdd.add(product);
            }
        }
        delete productsToDelete;
        upsert productsToAdd;
    }

}