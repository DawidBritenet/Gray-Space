public with sharing class GS_PriceBookController {
    @AuraEnabled
    public static void newPriceBook(String name, Map<String, Integer> products) {
        if (validate(name, products)) {
            Pricebook2 pricebook = createPriceBook(name);
            populatePricebook(pricebook, products);
        }
    }

    @AuraEnabled
    public static List<Pricebook2> getPriceBooks() {
        GS_General__c generalSettings = GS_General__c.getOrgDefaults();
        return [SELECT Name, IsActive FROM Pricebook2 WHERE Id != :generalSettings.GS_Standard_Pricebook_Id__c ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntries(String priceBookId) {
        return [SELECT Id, GS_Percent__c, Product2.Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id = :priceBookId];
    }

    @AuraEnabled
    public static void activePriceBook(String priceBookId) {
        setPriceBookActive(priceBookId, True);
    }

    @AuraEnabled
    public static void deActivePriceBook(String priceBookId) {
        setPriceBookActive(priceBookId, False);
    }

    private static void setPriceBookActive(String priceBookId, Boolean value) {
        Pricebook2 pricebook = [SELECT Id, IsActive FROM Pricebook2 WHERE Id = :priceBookId];
        List<PricebookEntry> prices = [SELECT Id, IsActive FROM PricebookEntry WHERE Pricebook2Id = :priceBookId];

        pricebook.IsActive = value;
        for (PricebookEntry price : prices) {
            price.IsActive = value;
        }

        update pricebook;
        update prices;
    }

    private static Boolean validate(String name, Map<String, Integer> products) {
        if (products.size() > 0) {
            if (String.isNotBlank(name)) {
//                if (discountValue > 0 && discountValue < 100) {
                    return true;
//                } else {
//                    throw new AuraHandledException(System.Label.GS_Discount_Value_Error);
//                }
            } else {
                throw new AuraHandledException(System.Label.GS_Provide_discount_name);
            }
        } else {
            throw new AuraHandledException(System.Label.GS_Select_at_least_one_product);
        }
    }

    private static Pricebook2 createPricebook(String name) {
        Pricebook2 pricebook = new Pricebook2(Name = name, IsActive = False);
        try {
            insert pricebook;
        } catch (Exception exec) {
            throw new AuraHandledException(exec.getMessage());
        }
        return pricebook;
    }

    private static List<PricebookEntry> populatePricebook(PriceBook2 pricebook2, Map<String, Integer> products) {
        GS_General__c generalSettings = GS_General__c.getOrgDefaults();
        List<PricebookEntry> newPrices = new List<PricebookEntry>();
        List<PricebookEntry> actualPrices;

        actualPrices = [SELECT Id, UnitPrice, Product2Id FROM PricebookEntry WHERE Pricebook2Id = :generalSettings.GS_Standard_Pricebook_Id__c];

        for (String productId : products.keySet()) {
            PricebookEntry price = getProductPriceFromList(productId, actualPrices);
            PricebookEntry newPrice = new PricebookEntry();
            newPrice.Product2Id = productId;
            newPrice.Pricebook2Id = pricebook2.Id;
            newPrice.GS_Percent__c = products.get(productId);
            newPrice.IsActive = False;
            newPrice.UnitPrice = price.UnitPrice - (price.UnitPrice * (Decimal.valueOf(products.get(productId)) / 100));
            newPrices.add(newPrice);
        }

        try {
            insert newPrices;
        } catch (Exception exec) {
            throw new AuraHandledException(exec.getMessage());
        }

        return newPrices;
    }

    private static PricebookEntry getProductPriceFromList(String productId, List<PricebookEntry> prices) {
        for (PricebookEntry price : prices) {
            if (price.Product2Id == productId) {
                return price;
            }
        }
        return null;
    }
}