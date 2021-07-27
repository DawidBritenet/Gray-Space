({
    getCart: function (component, event) {
        let action = component.get('c.getCart');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                if (response.getReturnValue()) {
                    let count = 0;
                    Object.keys(response.getReturnValue()).forEach(key => {
                        count += response.getReturnValue()[key];
                    });
                    component.set('v.cartSize', count);
                } else {
                    this.getCartFromOpportunity(component, event);
                }
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getCartFromOpportunity: function(component, event) {
        let action = component.get('c.getCartFromOpportunity');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.cartSize', Object.keys(response.getReturnValue()).length);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    startCartFlow: function (component, event) {
        let navigateCart = component.find('navigateToCart');
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Cart__c",
            }
        };
        navigateCart.navigate(pageReference);
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