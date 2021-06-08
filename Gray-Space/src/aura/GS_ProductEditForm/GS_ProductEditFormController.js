({
    afterSave : function(component, event, helper) {
        helper.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Product_saved'), 'success');
    }
})