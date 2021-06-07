({
    photoAdded : function(component, event, photoId) {
        var action = component.get('c.afterAddPhoto');
        action.setParams({
            'productId': component.get('v.recordId'),
            'photoId': photoId,
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var refreshEvent = component.getEvent('refreshEvent');
                refreshEvent.fire();
                var photoAddedEvent = component.getEvent('photoAdded');
                photoAddedEvent.fire();
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError()[0].getMessage());
            }
        });
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