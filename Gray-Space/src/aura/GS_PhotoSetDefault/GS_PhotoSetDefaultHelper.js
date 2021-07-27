({
    getPhoto: function (component, event) {
        let action = component.get('c.getPhotoLink');
        action.setParams({
            'photoId': component.get('v.photoId'),
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photoLink', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    selectDefault: function (component, event) {
        let action = component.get('c.setDefaultPhoto');
        action.setParams({
            'productId': component.get('v.recordId'),
            'photoId': component.get('v.photoId'),
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.throwRecordChanged();
                this.throwDefaultPhotoSelected();
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_updated_default_photo'), 'success');
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

    },

    throwDefaultPhotoSelected: function () {
        let event = $A.get('e.c:GS_DefaultPhotoSelected');
        event.fire();
    },

    throwRecordChanged: function () {
        let toastEvent = $A.get("e.force:refreshView");
        toastEvent.fire();
    },
});