({
    addComment: function (component, event) {
        let action = component.get('c.sendComment');
        let message = component.find('message').get('v.value');
        action.setParams({
            'productId': component.get('v.recordId'),
            'rate': component.get('v.rate'),
            'message': message
        });
        console.log('test1');
        action.setCallback(this, function (response) {
            console.log(response);
            if (response.getState() === "SUCCESS") {
                console.log('test2');
                // this.fireAddedNewComment(component, event);
                console.log('test3');
                this.sendMessage($A.get('$Label.c.GS_Success'), 'Added Comment', 'success');
                console.log('test4');
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