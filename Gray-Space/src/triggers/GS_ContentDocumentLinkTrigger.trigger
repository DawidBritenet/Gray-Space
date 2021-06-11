trigger GS_ContentDocumentLinkTrigger on ContentDocumentLink (before insert) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            GS_ContentDocumentLinkHandler.beforeInsert(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
        }
    }
}