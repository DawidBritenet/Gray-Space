public with sharing class GS_ProductController {

    @AuraEnabled(cacheable=true)
    public static Product2 getProduct(String productId) {
        List<Product2> products = [SELECT Id, Name, GS_Product_Code__c, defaultPhotoId__c, (SELECT UnitPrice FROM PricebookEntries ORDER BY UnitPrice LIMIT 1) FROM Product2 WHERE id = :productId];
        if (products.size() > 0) {
            return products[0];
        } else {
            throw new AuraHandledException(System.Label.GS_Product_Not_Found);
        }
    }

    @AuraEnabled
    public static List<PricebookEntry> getProductPrice(String productId) {
        List<PricebookEntry> prices = [SELECT UnitPrice, Product2.GS_Type__c FROM PricebookEntry WHERE Product2Id = :productId AND IsActive = TRUE ORDER BY UnitPrice];
        GS_Club__c club;
        User loggedUser;
        List<GS_Club_Member__c> members;

        if (prices.size() == 1) {
            club = GS_GrayFamilyJoinIn.getClub();
            loggedUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()];
            members = [SELECT Id, GS_Interest_In__c FROM GS_Club_Member__c WHERE GS_Club__c = :club.Id AND GS_Member__c = :loggedUser.ContactId];
            if (members.size() > 0) {
                if (members[0].GS_Interest_In__c == prices[0].Product2.GS_Type__c) {
                    prices.add(0, new PricebookEntry(UnitPrice = prices[0].UnitPrice * 0.95));
                }
            }
        }

        return prices;
    }

    @AuraEnabled
    public static void setDefaultPhoto(String productId, String photoId) {
        Product2 product = new Product2(Id = productId, defaultPhotoId__c = photoId);
        try {
            update product;
        } catch (Exception exec) {
            throw new AuraHandledException(System.Label.GS_Update_Default_Photo_Error);
        }
    }

    @AuraEnabled
    public static String getDefaultPhotoId(String productId) {
        Product2 product = getProduct(productId);
        return product.defaultPhotoId__c;
    }

    @AuraEnabled(cacheable=true)
    public static String getDefaultPhoto(String productId) {
        String photoId = getDefaultPhotoId(productId);
        return getPhotoLink(photoId);
    }

    @AuraEnabled
    public static Boolean hasDefaultPhoto(String productId) {
        Product2 product = getProduct(productId);
        if (product != null) {
            if (String.isNotBlank(product.defaultPhotoId__c)) {
                return true;
            }
        }
        return false;
    }

    @AuraEnabled
    public static void afterAddPhoto(String productId, String photoId) {
        if (!hasDefaultPhoto(productId)) {
            setDefaultPhoto(productId, photoId);
        }
    }

    @AuraEnabled
    public static List<Product2> getPromotedProducts() {
        return [SELECT Id, Name, GS_Name_Link__c, GS_Product_Code__c, GS_Type__c, (SELECT UnitPrice FROM PricebookEntries ORDER BY UnitPrice LIMIT 1) FROM Product2 WHERE GS_Promoted__c = True AND IsActive = True LIMIT 5];
    }

    @AuraEnabled
    public static List<Product2> getProducts(Integer offset, Integer recordLimit) {
        return [SELECT Id, Name, GS_Name_Link__c, GS_Product_Code__c, GS_Type__c, (SELECT UnitPrice FROM PricebookEntries ORDER BY UnitPrice LIMIT 1) FROM Product2 LIMIT :recordLimit OFFSET :offset];
    }

    @AuraEnabled
    public static List<Product2> getActiveProducts() {
        return [SELECT Id, Name, GS_Name_Link__c, GS_Product_Code__c, GS_Type__c, (SELECT UnitPrice FROM PricebookEntries ORDER BY UnitPrice LIMIT 1) FROM Product2 WHERE IsActive = True];
    }

    @AuraEnabled
    public static Integer getProductsCount() {
        return Database.countQuery('SELECT COUNT() FROM Product2 WHERE IsActive = True');
    }

    @AuraEnabled
    public static Integer getProductsCountAll() {
        return Database.countQuery('SELECT COUNT() FROM Product2');
    }

    @AuraEnabled
    public static List<ContentDocument> getPhotos(String productId) {
        List<ContentDocumentLink> photos = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];
        List<Id> photosIds = new List<ID>();

        for (ContentDocumentLink photo : photos) {
            photosIds.add(photo.ContentDocumentId);
        }

        return [SELECT Id FROM ContentDocument WHERE id IN :photosIds];
    }

    @AuraEnabled
    public static List<Id> getPhotosIds(String productId) {
        List<Id> productsIds = new List<Id>();

        for (ContentDocument doc : getPhotos(productId)) {
            productsIds.add(doc.id);
        }

        return productsIds;
    }

    @AuraEnabled
    public static List<String> getPhotosLinks(String productId) {
        GS_General__c settings = GS_General__c.getOrgDefaults();
        List<ContentDocumentLink> photos = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];
        List<String> photosLinks = new List<String>();
        List<ID> photosIds = new List<ID>();

        Id defaultPhoto = getDefaultPhotoId(productId);


        for (ContentDocumentLink photo : photos) {
            photosIds.add(photo.ContentDocumentId);
        }

        List<ContentVersion> versions = new List<ContentVersion>();

        List<ContentVersion> defaultPhotos = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :defaultPhoto AND IsLatest = True AND FileType IN ('PNG', 'JPG', 'JPEG')];
        if (defaultPhotos.size() > 0) {
            versions.add(defaultPhotos[0]);
        }

        versions.addAll([SELECT Id FROM ContentVersion WHERE ContentDocumentId IN :photosIds AND IsLatest = True AND FileType IN ('PNG', 'JPG', 'JPEG')]);

        List<Id> idsAdded = new List<Id>();

        for (ContentVersion version : versions) {
            if (!idsAdded.contains(version.id)) {
                idsAdded.add(version.id);
                photosLinks.add(settings.GS_Base_Photo_URL__c + version.id);
            }
        }

        return photosLinks;
    }

    @AuraEnabled
    public static String getPhotoLink(String photoId) {
        List<ContentVersion> versions = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :photoId AND IsLatest = True AND FileType IN ('PNG', 'JPG', 'JPEG')];
        if (versions.size() > 0) {
            return createPhotoLink(versions[0].id);
        }
        return PageReference.forResource('GS_NoPhoto').getUrl();
    }

    @AuraEnabled
    public static void deleteProduct(Id productId) {
        try {
            Database.delete(productId);
        } catch (Exception exec) {
            throw new AuraHandledException(System.Label.GS_Deleting_Product_Error);
        }
    }

    @AuraEnabled
    public static void deleteProducts(String productsId) {
        List<String> toDelete = productsId.split(',');
        try {
            Database.delete(toDelete);
        } catch (Exception exec) {
            throw new AuraHandledException(System.Label.GS_Deleting_Product_Error);
        }
    }

    @AuraEnabled
    public static List<Map<String, String>> getPicklistValues(String objectName, String fieldApiName) {
        List<Map<String, String>> optionList = new List<Map<String, String>>();
        Map<String, Schema.SObjectType> globalDescribe;
        Map<String, Schema.SObjectField> fieldMap;
        List<Schema.PicklistEntry> picklistValues;

        try {
            fieldMap = Schema.describeSObjects(new List<String>{
                    objectName.toLowerCase()
            })[0].fields.getMap();
            picklistValues = fieldMap.get(fieldApiName).getDescribe().getPicklistValues();
        } catch (Exception exec) {
            throw new AuraHandledException(exec.getMessage());
        }

        Map<String, String> option = new Map<String, String>();
        option.put('label', Label.GS_All);
        option.put('value', '');
        optionList.add(option);

        for (Schema.PicklistEntry picklistEntry : picklistValues) {
            option = new Map<String, String>();
            option.put('label', picklistEntry.getLabel());
            option.put('value', picklistEntry.getValue());
            optionList.add(option);
        }

        return optionList;
    }

    @AuraEnabled
    public static void addComment(String productId, String message, Integer rate) {
        GS_Comment__c comment = new GS_Comment__c(GS_ProductId__c = productId, GS_Rate__c = rate, GS_Content__c = message, GS_User__c = UserInfo.getUserId());
        try {
            insert comment;
        } catch (Exception exec) {
            if (exec.getMessage().contains('DUPLICATES_DETECTED')) {
                throw new AuraHandledException(System.Label.GS_Duplicate_Comment);
            } else if (exec.getMessage().contains('REQUIRED_FIELD_MISSING')) {
                throw new AuraHandledException(System.Label.GS_Comment_Required_fields);
            } else {
                throw new AuraHandledException(exec.getMessage());
            }
        }
    }

    @AuraEnabled
    public static void deleteComment(String commentId) {
        GS_Comment__c comment = new GS_Comment__c(Id = commentId);

        try {
            delete comment;
        } catch (Exception exec) {
            throw new AuraHandledException(exec.getMessage());
        }
    }

    @AuraEnabled
    public static List<GS_Comment__c> getComments(String productId) {
        List<GS_Comment__c> comments = [SELECT GS_Content__c, GS_Rate__c, GS_User__c FROM GS_Comment__c WHERE GS_ProductId__c = :productId];
        return comments;
    }

    @AuraEnabled
    public static String getUserId() {
        return UserInfo.getUserId();
    }

    @AuraEnabled
    public static Double getRating(String productId) {
        List<GS_Comment__c> comments = [SELECT GS_Rate__c FROM GS_Comment__c WHERE GS_ProductId__c = :productId];
        Double rating = 0;

        for (GS_Comment__c comment : comments) {
            rating += comment.GS_Rate__c;
        }

        if (comments.size() > 0) {
            rating /= comments.size();
        }

        return rating;
    }

    @AuraEnabled
    public static List<Product2> searchProduct(String name, String spaceType, String type, Integer offset, Integer resultLimit) {
        String arguments = prepareArguments(name, spaceType, type);

        return Database.query('SELECT Id, Name, GS_Name_Link__c, ProductCode, StockKeepingUnit, GS_Type__c, (SELECT UnitPrice FROM PricebookEntries  ORDER BY UnitPrice LIMIT 1) FROM Product2' + arguments + ' LIMIT ' + resultLimit + ' OFFSET ' + offset);
    }

    @AuraEnabled
    public static Integer getSearchCount(String name, String spaceType, String type) {
        String arguments = prepareArguments(name, spaceType, type);
        return Database.countQuery('SELECT COUNT() FROM Product2' + arguments);

    }

    @AuraEnabled
    public static String getUserName(String userId) {
        User user = [SELECT CommunityNickname FROM User WHERE Id = :userId];
        return user.CommunityNickname;
    }

    @AuraEnabled
    public static void changeCartQuantity(String productId, Integer quantity) {
        if (!Cache.Session.contains('cart')) {
            Cache.Session.put('cart', new Map<String, Integer>());
        }

        Map<String, Integer> cart = (Map<String, Integer>) Cache.Session.get('cart');

        if (quantity > 0) {
            cart.put(productId, quantity);
        } else {
            cart.remove(productId);
        }

        Cache.Session.put('cart', cart);
    }

    @AuraEnabled
    public static void updateCart(Map<String, Integer> cart) {
        Map<String, Integer> newCart = new Map<String, Integer>();
        for (String key : cart.keySet()) {
            if (cart.get(key) > 0) {
                newCart.put(key, cart.get(key));
            }
        }
        Cache.Session.put('cart', newCart);
    }

    @AuraEnabled
    public static Map<String, Integer> getCart() {
        return (Map<String, Integer>) Cache.Session.get('cart');
    }

    @AuraEnabled
    public static Double getTotalPrice() {
        Map<String, Integer> cart = getCart();
        List<PricebookEntry> prices = [SELECT UnitPrice, Product2Id, Product2.GS_Type__c FROM PricebookEntry WHERE Product2Id IN :cart.keySet() AND IsActive = True];
        Double total = 0;
        GS_Club__c club = GS_GrayFamilyJoinIn.getClub();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()];
        List<GS_Club_Member__c> members = [SELECT Id, GS_Interest_In__c FROM GS_Club_Member__c WHERE GS_Club__c = :club.Id AND GS_Member__c = :loggedUser.ContactId];

        for (String productId : cart.keySet()) {
            Double unitPrice;
            for (PricebookEntry price : prices) {
                if (price.Product2Id == productId) {
                    unitPrice = price.UnitPrice;
                    if (members.size() > 0) {
                        if (members[0].GS_Interest_In__c == price.Product2.GS_Type__c) {
                            unitPrice = price.UnitPrice*0.95;
                        }
                    }
                }
            }
            total += unitPrice * cart.get(productId);
        }

        if (total >= 25000) {
            total *= 0.9;
        } else if (total >= 10000) {
            total *= 0.95;
        }

        return total;
    }

    @AuraEnabled
    public static Map<String, Integer> getCartFromOpportunity() {
        Map<String, Integer> cart = new Map<String, Integer>();
        List<Opportunity> opportunities = [SELECT Id FROM Opportunity WHERE OwnerId = :UserInfo.getUserId() AND (NOT StageName LIKE 'Closed%') LIMIT 1];
        Opportunity opportunity = null;

        if (opportunities.size() > 0) {
            opportunity = opportunities[0];
        }

        if (opportunity != null) {
            List<OpportunityLineItem> products = [SELECT Product2Id, Quantity FROM OpportunityLineItem WHERE OpportunityId = :opportunity.Id];
            for (OpportunityLineItem product : products) {
                cart.put(product.Product2Id, Integer.valueOf(product.Quantity));
            }
        }

        Cache.Session.put('cart', cart);

        return cart;
    }

    @AuraEnabled
    public static List<Product2> getUserLastVisitedProducts() {
        List<RecentlyViewed> lastVisitedProducts = [SELECT Id, Name FROM RecentlyViewed WHERE Type = 'Product2' ORDER BY LastViewedDate DESC LIMIT 5];
        List<String> productsIds = new List<String>();
        List<Product2> products;
        List<Product2> productsSorted;

        for (RecentlyViewed product : lastVisitedProducts) {
            productsIds.add(product.Id);
        }

        return [SELECT Id, Name, GS_Name_Link__c, ProductCode, StockKeepingUnit, GS_Type__c, (SELECT UnitPrice FROM PricebookEntries ORDER BY UnitPrice LIMIT 1) FROM Product2 WHERE IsActive = True AND Id IN :productsIds LIMIT 5];
    }

    @AuraEnabled
    public static Integer getAllStock(String productId) {
        List<GS_WarehouseLineItem__c> products = [SELECT GS_Quantity__c FROM GS_WarehouseLineItem__c WHERE GS_ProductId__c = :productId];
        Integer quantity = 0;

        for (GS_WarehouseLineItem__c product : products) {
            quantity += Integer.valueOf(product.GS_Quantity__c);
        }

        return quantity;
    }

    public static String prepareArguments(String name, String spaceType, String type) {
        GS_General__c generalSettings = GS_General__c.getOrgDefaults();
        List<String> arguments = new List<String>();
        String argumentsString = '';

        if (String.isNotBlank(name)) {
            name = String.escapeSingleQuotes(name);
            arguments.add('name LIKE \'%' + name + '%\'');
        }

        if (String.isNotBlank(spaceType)) {
            spaceType = String.escapeSingleQuotes(spaceType);
            arguments.add('GS_Space_Type__c includes (\'' + spaceType + '\')');
        }

        if (String.isNotBlank(type)) {
            type = String.escapeSingleQuotes(type);
            arguments.add('GS_Type__c LIKE \'' + type + '\'');
        }

        if (arguments.size() > 0) {
            argumentsString = ' WHERE IsActive = True AND ' + String.join(arguments, ' AND ');
        }

        return argumentsString;
    }

    public static String createPhotoLink(String versionId) {
        GS_General__c settings = GS_General__c.getOrgDefaults();

        if (String.isNotBlank(versionId)) {
            return settings.GS_Base_Photo_URL__c + versionId;
        }
        return PageReference.forResource('GS_NoPhoto').getUrl();
    }
}