({
    toggleActive: function (component, event) {
        if (component.get('v.priceBook').IsActive) {
            this.deActive(component, event);
        } else {
            this.active(component, event);
        }
    },

    active: function (component, event) {
        let action = component.get('c.activePriceBook');
        action.setParams({
            'priceBookId': component.get('v.priceBook').Id
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.priceBook.IsActive', true);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    deActive: function (component, event) {
        let action = component.get('c.deActivePriceBook');
        action.setParams({
            'priceBookId': component.get('v.priceBook').Id
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.priceBook.IsActive', false);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    showViewModal: function (component, event) {
        $A.createComponent("c:GS_DiscountView", {'priceBook': component.get('v.priceBook')}, function(content, status) {
            if (status === "SUCCESS") {
                component.find('discountView').showCustomModal({
                    header: $A.get('$Label.c.GS_Discount_View'),
                    body: content,
                    showCloseButton: true
                })
            }
        })
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
