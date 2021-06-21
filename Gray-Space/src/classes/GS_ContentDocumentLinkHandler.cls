public with sharing class GS_ContentDocumentLinkHandler {
    public static void beforeInsert(List<ContentDocumentLink> oldContentDocumentLinks, List<ContentDocumentLink> newContentDocumentLinks, Map<Id,ContentDocumentLink> oldContentDocumentLinksMap, Map<Id,ContentDocumentLink> newContentDocumentLinksMap) {
        productsPhotosVisibility(newContentDocumentLinks);
    }

    public static void productsPhotosVisibility(List<ContentDocumentLink> contentDocumentLinks) {
        if (contentDocumentLinks != null) {
            for (ContentDocumentLink link : contentDocumentLinks) {
                link.Visibility = 'AllUsers';
            }
        }
    }
}