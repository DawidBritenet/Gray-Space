({
    create: function (component, event) {
        let action = component.get('c.newPriceBook');
        action.setParams({
            'name': component.get('v.name'),
            'discountValue': component.get('v.percent'),
            'products': component.get('v.selectedProducts')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let appEvent = $A.get('e.c:GS_ReInit');
                appEvent.fire();
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    reInit: function(component, event) {
        component.set('v.selectedProducts', {});
        component.set('v.percent', 5);
        component.set('v.name', '');
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
