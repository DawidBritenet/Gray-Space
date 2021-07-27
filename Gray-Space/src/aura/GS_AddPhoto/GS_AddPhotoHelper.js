({
    photoAdded: function (component, event, photoId) {
        let action = component.get('c.afterAddPhoto');
        action.setParams({
            'productId': component.get('v.recordId'),
            'photoId': photoId,
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let refreshEvent = component.getEvent('refreshEvent');
                refreshEvent.fire();
                let photoAddedEvent = component.getEvent('photoAdded');
                photoAddedEvent.fire();
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    sendMessage: function (title, message, type) {
        let toastParams = {
            title: title,
            message: message,
            type: type
        };
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
});