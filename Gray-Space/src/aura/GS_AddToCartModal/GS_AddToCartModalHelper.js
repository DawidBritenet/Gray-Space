({
    getCart: function (component, event) {
        let action = component.get('c.getCart');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let cart = response.getReturnValue();
                if (cart) {
                    let quantity = cart[component.get('v.recordId')];
                    if (quantity) {
                        component.set('v.quantity', quantity);
                    }
                }
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    addToCart: function (component, event) {
        let action = component.get('c.changeCartQuantity');
        action.setParams({
            'productId': component.get('v.recordId'),
            'quantity': component.get('v.quantity')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.closeModal(component, event);
                this.sendMessage($A.get('$Label.c.GS_Add_to_cart'), $A.get('$Label.c.GS_Product_added_to_chart'), 'success');
                this.fireProductUpdated();
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    fireProductUpdated: function() {
        $A.get("e.c:GS_CartUpdated").fire();
    },

    closeModal: function (component, event) {
        component.find("addToCartModal").notifyClose();
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