public with sharing class GS_ProductController {

    @AuraEnabled
    public static Product2 getProduct(String productId) {
        List<Product2> products = [SELECT Id, defaultPhotoId__c FROM Product2 WHERE id = :productId];
        if (products.size() > 0) {
            return products[0];
        } else {
            throw new AuraHandledException(System.Label.GS_Product_Not_Found);
        }
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

    @AuraEnabled
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
        return [SELECT Id, Name, GS_Name_Link__c, ProductCode, StockKeepingUnit, GS_Type__c FROM Product2 WHERE GS_Promoted__c = True];
    }

    @AuraEnabled
    public static List<Product2> getProducts(Integer offset, Integer recordLimit) {
        return [SELECT Id, Name, GS_Name_Link__c, ProductCode, StockKeepingUnit, GS_Type__c FROM Product2 LIMIT :recordLimit OFFSET :offset];
    }

    @AuraEnabled
    public static Integer getProductsCount() {
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
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();

        Map<String, Schema.SObjectField> fieldMap = globalDescribe.get(objectName.toLowerCase()).getDescribe().fields.getMap();
        List<Schema.PicklistEntry> picklistValues = fieldMap.get(fieldApiName).getDescribe().getPicklistValues();

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
        GS_Comment__c comment = new GS_Comment__c(GS_ProductId__c = productId, GS_Rate__c = rate, GS_Content__c = message);
        try {
            insert comment;
        } catch (Exception exec) {
            throw new AuraHandledException(exec.getMessage());
        }
    }

    @AuraEnabled
    public static List<GS_Comment__c> getComments(String productId) {
        List<GS_Comment__c> comments = [ SELECT GS_Content__c, GS_Rate__c FROM GS_Comment__c WHERE GS_ProductId__c = :productId ];
        return comments;
    }

    @AuraEnabled
    public static List<Product2> searchProduct(String name, String spaceType, String type, Integer offset, Integer resultLimit) {
        String arguments = prepareArguments(name, spaceType, type);

        return Database.query('SELECT Id, Name, defaultPhotoId__c FROM Product2' + arguments + ' LIMIT ' + resultLimit + ' OFFSET ' + offset);
    }

    @AuraEnabled
    public static Integer getSearchCount(String name, String spaceType, String type) {
        String arguments = prepareArguments(name, spaceType, type);
        return Database.countQuery('SELECT COUNT() FROM Product2' + arguments);

    }

    public static String prepareArguments(String name, String spaceType, String type) {
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
            argumentsString = ' WHERE ' + String.join(arguments, ' AND ');
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
