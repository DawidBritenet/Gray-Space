({
    getPhoto: function (component, event) {
        let action = component.get('c.getDefaultPhoto');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photoUrl', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getPrice: function (component, event) {
        let action = component.get('c.getProductPrice');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                try {
                    component.set('v.price', response.getReturnValue()[0].UnitPrice);
                } catch (e) {
                }
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
