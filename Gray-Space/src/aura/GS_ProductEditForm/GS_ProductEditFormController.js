({
    refreshComponent : function(component, event, helper) {
        var photoGallery = component.find('photoGallery');
        photoGallery.reload();
    },

    afterSave : function(component, event, helper) {
        helper.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Product_saved'), 'success');
    }
})