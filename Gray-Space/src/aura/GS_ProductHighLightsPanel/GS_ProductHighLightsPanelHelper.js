({
    getDetails: function (component, event) {
        let action = component.get('c.getProduct');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.product', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getStock: function (component, event) {
        let action = component.get('c.getAllStock');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.inStock', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    openAddToCartModal: function(component, event) {
        $A.createComponent('c:GS_AddToCartModal', {recordId: component.get('v.recordId')}, function (content, status) {
            if (status === "SUCCESS") {
                component.find('addToCartModal').showCustomModal({
                    header: $A.get('$Label.c.GS_Add_to_cart'),
                    body: content,
                    showCloseButton: true
                })
            }
        });
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