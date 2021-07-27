({
    addComment: function (component, event) {
        let action = component.get('c.addComment');
        let message = component.find('message').get('v.value');
        action.setParams({
            'productId': component.get('v.recordId'),
            'rate': component.get('v.rate'),
            'message': message
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.fireAddedNewComment(component, event);
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Added_Comment'), 'success');
                component.set('v.rate', 0);
                component.find('message').set('v.value', '');
                component.set('v.hide', true);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    fireAddedNewComment: function (component, event) {
        let cmpEvent = component.getEvent('NewComment');
        cmpEvent.fire();
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