trigger GS_ContentDocumentLinkTrigger on ContentDocumentLink (before insert) {
    new GS_ContentDocumentLinkHandler().execute();
}