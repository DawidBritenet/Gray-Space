public without sharing class GS_QuoteFromOpportunity {
    public static void createQuoteFromOpportunity(String opportunityId) {
        Quote quote = createQuote(opportunityId);
        populateQuote(quote, opportunityId);
        generatePDF(quote.Id);

    }

    private static Quote createQuote(String opportunityId) {
        Opportunity opportunity = [SELECT Id, OwnerId FROM Opportunity WHERE Id = :opportunityId];
        Quote quote = new Quote();
        User user = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()];

        quote.Name = 'Quote ' + UserInfo.getName();
        quote.OpportunityId = opportunityId;

        insert quote;
        return quote;
    }

    private static List<QuoteLineItem> populateQuote(Quote quote, String opportunityId) {
        List<QuoteLineItem> products = new List<QuoteLineItem>();
        List<OpportunityLineItem> opportunityProducts = [SELECT Id, Quantity, Product2Id, UnitPrice, PricebookEntryId FROM OpportunityLineItem WHERE OpportunityId = :opportunityId];

        for (OpportunityLineItem opportunityProduct : opportunityProducts) {
            QuoteLineItem product = new QuoteLineItem();
            product.Product2Id = opportunityProduct.Product2Id;
            product.QuoteId = quote.Id;
            product.Quantity = opportunityProduct.Quantity;
            product.PriceBookEntryId = opportunityProduct.PricebookEntryId;
            product.UnitPrice = opportunityProduct.UnitPrice;
            products.add(product);
        }

        insert products;

        return products;
    }

    @future(Callout=True)
    public static void generatePDF(String quoteId) {
        String url = Url.getSalesforceBaseUrl().toExternalForm() + '/quote/quoteTemplateDataViewer.apexp?id=' + quoteId + '&headerHeight=190&footerHeight=188&summlid=0EH090000018sil#toolbar=1&navpanes=0&zoom=90';

        PageReference pr = new PageReference(url);
        QuoteDocument doc = new QuoteDocument();
        Blob body = pr.getContentAsPDF();
        doc.Document = body;
        doc.QuoteId = quoteId;
        insert doc;
        sendEmail(body, quoteId);
    }

    public static void sendEmail(Blob pdfBody, String quoteId) {
        Quote quote = [SELECT OpportunityId FROM Quote WHERE Id = :quoteId];
        Opportunity opportunity = [SELECT OwnerId FROM Opportunity WHERE Id = :quote.OpportunityId];
        User user = [SELECT ContactId, Contact.Email FROM User WHERE Id = :opportunity.OwnerId];
        GS_Cart_Settings__c cart_settings = GS_Cart_Settings__c.getOrgDefaults();
        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        attachment.setContentType('application/pdf');
        attachment.setFileName(cart_settings.GS_Quote_File_Name__c);
        attachment.setBody(pdfBody);
        mail.setToAddresses(new List<String>{
                user.Contact.Email
        });
        mail.setTemplateId(cart_settings.GS_Quote_Email_Template_Id__c);
        mail.setTargetObjectId(user.ContactId);
        mail.setSaveAsActivity(false);
        mail.setOrgWideEmailAddressId(cart_settings.GS_Org_Wide_Email_Id__c);
        mail.setFileAttachments(new List<Messaging.EmailFileAttachment>{
                attachment
        });
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{
                mail
        });
    }
}