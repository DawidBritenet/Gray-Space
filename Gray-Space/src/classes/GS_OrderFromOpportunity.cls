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
        List<OpportunityLineItem> opportunityProducts = [SELECT Id, Product2Id, Quantity, TotalPrice, UnitPrice, pricebookEntryId FROM OpportunityLineItem WHERE OpportunityId = :opportunityId];
        List<OrderItem> products = new List<OrderItem>();
        Decimal totalPrice = 0;
        Decimal multiplyPrice = 1;

        for (OpportunityLineItem opportunityProduct : opportunityProducts) {
            totalPrice += opportunityProduct.UnitPrice*opportunityProduct.Quantity;
        }

        if (totalPrice > 25000) {
            multiplyPrice = 0.9;
        } else if (totalPrice > 10000) {
            multiplyPrice = 0.95;
        }

        for (OpportunityLineItem opportunityProduct : opportunityProducts) {
            OrderItem product = new OrderItem();
            product.Product2Id = opportunityProduct.Product2Id;
            product.OrderId = orderId;
            product.Quantity = opportunityProduct.Quantity;
            product.UnitPrice = opportunityProduct.UnitPrice * multiplyPrice;
            product.PricebookEntryId = opportunityProduct.pricebookEntryId;

            products.add(product);
        }

        insert products;

        return products;
    }

}