({
    getPriceBooks: function (component, event) {
        let action = component.get('c.getPriceBooks');
        component.set('v.showSpinner', true);
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.priceBooks', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
            component.set('v.showSpinner', false);
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
