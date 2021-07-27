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

    getPrice: function (component, event) {
        let action = component.get('c.getProductPrice');
        action.setParams({
            'productId': component.get('v.product.Id')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                try {
                    component.set('v.price', response.getReturnValue()[response.getReturnValue().length-1].UnitPrice);
                } catch (e) {
                }
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    toggleProduct: function(component, event) {
        let selectedItems = component.get('v.selectedProducts');
        component.set('v.percentThis', component.get('v.percent'));
        if (!selectedItems) {
            selectedItems = {};
        }
        if (component.get('v.selected')) {
            delete selectedItems[component.get('v.product.Id')];
            component.set('v.percentThis', null);
            component.set('v.selected', false);
        } else {
            selectedItems[component.get('v.product.Id')] = component.get('v.percentThis');
            component.set('v.selected', true);
        }
        component.set('v.selectedProducts', selectedItems);
    },

    reInit: function(component, event) {
        component.set('v.selected', false);
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