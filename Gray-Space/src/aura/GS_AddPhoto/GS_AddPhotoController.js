({
    photoAdded : function(component, event, helper) {
        var files = event.getParam('files');
        helper.photoAdded(component, event, files[0].documentId);
        helper.sendMessage("Success", 'Added your photos', 'success');
    },

})