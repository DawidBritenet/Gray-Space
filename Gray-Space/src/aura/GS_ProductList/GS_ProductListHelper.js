({
    getProducts : function(component, event) {
        var action = component.get('c.getProducts');
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                console.log(response.getReturnValue());
                component.set('v.products', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', $A.get('$Label.c.GS_Check_Console'), 'Error');
                console.log(response.getError()[0].getMessage());
            }
        })
        $A.enqueueAction(action);
    },

    sendMessage : function(title, message, type) {
        var toastParams = {
             title: title,
             message: message,
             type: type
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
})