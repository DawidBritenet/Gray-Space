public with sharing class GS_OrderFromOpportunity {

    @InvocableMethod
    public static List<Order> run(List<String> opportunityIds) {
        List<Order> orders = new List<Order>();
        for (String opportunityId : opportunityIds) {
            orders.add(generate(opportunityId));
        }
        return orders;
    }

    private static Order generate(String opportunityId) {
        Order ord = createOrder(opportunityId);
        List<OrderItem> products = createProducts(opportunityId, ord.Id);

        return ord;
    }

    private static Order createOrder(String opportunityId) {
        Opportunity opportunity = [SELECT Id, GS_Payment__c, GS_Shipment__c, GS_City__c, GS_Country__c, GS_Zip_Postal_Code__c, GS_State_Province__c, GS_Street__c FROM Opportunity WHERE Id = :opportunityId];
        Account account = [SELECT Id FROM Account WHERE Name = 'Personal'];
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard=True LIMIT 1];
        Order ord = new Order();
        ord.OpportunityId = opportunity.Id;
        ord.AccountId = account.Id;
        ord.Status = 'Draft';
        ord.EffectiveDate = Date.today();
        ord.Pricebook2Id = pricebook.Id;
        ord.GS_Payment__c = opportunity.GS_Payment__c;
        ord.GS_Shipment_Type__c = opportunity.GS_Shipment__c;
        ord.ShippingCity = opportunity.GS_City__c;
        ord.ShippingCountry = opportunity.GS_Country__c;
        ord.ShippingPostalCode = opportunity.GS_Zip_Postal_Code__c;
        ord.ShippingState = opportunity.GS_State_Province__c;
        ord.ShippingStreet = opportunity.GS_Street__c;

        insert ord;
        return ord;
    }

    private static List<OrderItem> createProducts(String opportunityId, String orderId) {
        List<OpportunityLineItem> opportunityProducts = [SELECT Id, Product2Id, Quantity, TotalPrice FROM OpportunityLineItem WHERE OpportunityId = :opportunityId];
        List<String> productsIds = new List<String>();
        List<PricebookEntry> pricebookEntries = null;
        List<OrderItem> products = new List<OrderItem>();

        for (OpportunityLineItem product : opportunityProducts) {
            productsIds.add(product.Product2Id);
        }

        pricebookEntries = [SELECT Id, Product2Id, UnitPrice FROM PricebookEntry WHERE Product2Id IN :productsIds];

        for (OpportunityLineItem opportunityProduct : opportunityProducts) {
            OrderItem product = new OrderItem();
            product.Product2Id = opportunityProduct.Product2Id;
            product.OrderId = orderId;
            product.Quantity = opportunityProduct.Quantity;

            for (PricebookEntry pricebookEntry : pricebookEntries) {
                if (pricebookEntry.Product2Id == product.Product2Id) {
                    product.PricebookEntryId = pricebookEntry.Id;
                    product.UnitPrice = pricebookEntry.UnitPrice;
                }
            }
            products.add(product);
        }

        insert products;

        return products;
    }

}