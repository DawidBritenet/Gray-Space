({
    getPhoto: function (component, event) {
        let action = component.get('c.getDefaultPhoto');
        action.setParams({
            'productId': component.get('v.product.Id')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photo', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getRating: function (component, event) {
        let action = component.get('c.getRating');
        action.setParams({
            'productId': component.get('v.product.Id')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.rate', response.getReturnValue());
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
            'productId': component.get('v.product.Id')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                try {
                    if (response.getReturnValue().length > 1) {
                        component.set('v.discount', true);
                        component.set('v.discountPrice', response.getReturnValue()[response.getReturnValue().length-1].UnitPrice);
                    } else {
                        component.set('v.discount', false);
                    }
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

    goToDetails: function (component, event) {
        let redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
            "recordId": component.get('v.product.Id'),
            "slideDevName": "details"
        });
        redirect.fire();
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