({
    photoAdded: function (component, event, helper) {
        let files = event.getParam('files');
        helper.photoAdded(component, event, files[0].documentId);
        helper.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Add_Photos'), 'success');
    },

});