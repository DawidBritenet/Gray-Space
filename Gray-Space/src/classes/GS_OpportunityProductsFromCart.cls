public without sharing class GS_OpportunityProductsFromCart {

    @InvocableMethod
    public static void cartToOpportunityProducts(List<String> opportunityIds) {
        Map<String, Integer> cart = (Map<String, Integer>) Cache.Session.get('cart');
        String opportunityId = opportunityIds[0];
        List<PricebookEntry> priceBooks = [SELECT Id, UnitPrice, Product2Id FROM PricebookEntry WHERE Product2Id in :cart.keySet() AND Pricebook2.IsStandard = TRUE];
        List<OpportunityLineItem> productsToDelete = [SELECT Quantity, TotalPrice, Product2Id FROM OpportunityLineItem WHERE OpportunityId = :opportunityId ];
        List<OpportunityLineItem> productsToAdd = new List<OpportunityLineItem>();

        for (String productId : cart.keySet()) {
            if (cart.get(productId) > 0) {
                Double unitPrice;
                for (PricebookEntry pricebookEntry : priceBooks) {
                    if (pricebookEntry.Product2Id == productId) {
                        unitPrice = pricebookEntry.UnitPrice;
                    }
                }

                Double price = unitPrice * cart.get(productId);
                OpportunityLineItem product = new OpportunityLineItem(OpportunityId = opportunityId, Product2Id = productId, Quantity = cart.get(productId), TotalPrice = price);
                productsToAdd.add(product);
            }
        }
        delete productsToDelete;
        upsert productsToAdd;
    }

}