({
    getPhoto : function(component, event) {
        var action = component.get('c.getPhotoLink');
        action.setParams({
            'photoId': component.get('v.photoId'),
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photoLink', response.getReturnValue());
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

    selectDefault : function(component, event) {
        var action = component.get('c.setDefaultPhoto');
        action.setParams({
            'productId': component.get('v.recordId'),
            'photoId': component.get('v.photoId'),
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                this.throwRecordChanged();
                this.throwDefaultPhotoSelected();
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_updated_default_photo'), 'success');
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

    },

    throwDefaultPhotoSelected : function() {
        var event = $A.get('e.c:GS_DefaultPhotoSelected');
        event.fire();
    },

    throwRecordChanged : function() {
        var toastEvent = $A.get("e.force:refreshView");
        toastEvent.fire();
    },
})