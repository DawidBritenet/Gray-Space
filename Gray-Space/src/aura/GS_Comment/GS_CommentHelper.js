({
    getUsername: function (component, event) {
        let action = component.get('c.getUserName');
        action.setParams({
            'userId': component.get('v.comment.GS_User__c')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.userName', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    deleteComment: function (component, event) {
        let id = event.currentTarget.dataset.value;
        let action = component.get('c.getUserName');
        action.setParams({
            'commentId': id
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.fireAddedNewComment(component, event);
                this.sendMessage('Deleted', 'Deleted comment', 'success')
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
