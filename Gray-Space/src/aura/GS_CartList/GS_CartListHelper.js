({
    getCart: function (component, event) {
        let action = component.get('c.getCart');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let result = [];
                let resp = response.getReturnValue();
                Object.keys(resp).forEach(key => {
                    result.push({
                        'key': key,
                        'value': response.getReturnValue()[key]
                    })
                });
                component.set('v.cart', result);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    updateCart: function (component, event) {
        let cart = {};
        component.get('v.cart').forEach(cartItem => {
            cart[cartItem.key] = cartItem.value;
        });

        let action = component.get('c.updateCart');
        action.setParams({
            'cart': cart
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.navigateToNext(component, event);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    navigateToNext: function(component, event) {
        let navigate = component.get("v.navigateFlow");
        navigate("NEXT");
    },

    updateTotalPrice: function(component, event) {
        let action = component.get('c.getTotalPrice');
        action.setParams({
            'cart': component.get('v.cart')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.totalPrice', response.getReturnValue());
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
