public with sharing class GS_ProductMatchesController {

    @AuraEnabled(cacheable=true)
    public static List<GS_Product_Match__c> getProductsMatches(String productId) {
        List<GS_Product_Match__c> products = [SELECT Id, GS_Product1__c, GS_Product2__c FROM GS_Product_Match__c WHERE GS_Product1__c = :productId OR GS_Product2__c = :productId];
        return products;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getMatches(String productId) {
        if (String.isNotBlank(productId)) {
            List<GS_Product_Match__c> productMatches = getProductsMatches(productId);
            List<String> productsIds = new List<String>();
            List<Product2> products;

            for (GS_Product_Match__c productMatch : productMatches) {
                if (productMatch.GS_Product1__c != productId) {
                    productsIds.add(productMatch.GS_Product1__c);
                }
                if (productMatch.GS_Product2__c != productId) {
                    productsIds.add(productMatch.GS_Product2__c);
                }
            }

            products = [SELECT Id, Name FROM Product2 WHERE Id IN :productsIds];

            return products;
        }else {
            return new List<Product2>();
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Product> getProducts(String productId) {
        if (String.isNotBlank(productId)) {
            List<Product2> products = [SELECT Id, Name FROM Product2 WHERE Id != :productId];
            List<GS_Product_Match__c> productMatches = getProductsMatches(productId);
            List<Product> wrappedProducts = new List<Product>();

            for (Product2 product : products) {
                String matchId = '';
                for (GS_Product_Match__c productMatch : productMatches) {
                    if (product.Id == productMatch.GS_Product1__c || product.Id == productMatch.GS_Product2__c) {
                        matchId = productMatch.Id;
                    }
                }
                Product prod = new Product();
                prod.matchId = matchId;
                prod.product = product;
                wrappedProducts.add(prod);
            }

            return wrappedProducts;
        } else {
            return new List<Product>();
        }
    }

    @AuraEnabled
    public static void removeMatch(String matchId) {
        GS_Product_Match__c productMatch = new GS_Product_Match__c(Id=matchId);
        delete productMatch;
    }

    @AuraEnabled
    public static String addMatch(String product1Id, String product2Id) {
        GS_Product_Match__c productMatch = new GS_Product_Match__c(GS_Product1__c=product1Id, GS_Product2__c=product2Id);
        insert productMatch;
        return productMatch.Id;
    }

    class Product {
        @AuraEnabled
        public String matchId;
        @AuraEnabled
        public Product2 product;
    }

}