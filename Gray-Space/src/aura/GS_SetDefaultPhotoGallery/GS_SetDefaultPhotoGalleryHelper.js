({
    getPhotosIds: function (component, event) {
        let action = component.get('c.getPhotosIds');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                if (response.getReturnValue().length < 2) {
                    let selectedPhotoEvent = $A.get('e.c:GS_DefaultPhotoSelected');
                    selectedPhotoEvent.fire();
                } else {
                    component.set('v.photosIds', response.getReturnValue());
                }
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getDefaultPhoto: function (component, event) {

        let action = component.get('c.getDefaultPhotoId');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.defaultPhotoId', response.getReturnValue());
                this.getPhotosIds(component, event);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    sendErrorMessage: function (response) {
        let message;
        try {
            message = response.getError()[0].message;
        } catch (e) {
            message = $A.get('$Label.c.GS_Unknown_Error');
        }
        this.sendMessage('Error', message, 'error');
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