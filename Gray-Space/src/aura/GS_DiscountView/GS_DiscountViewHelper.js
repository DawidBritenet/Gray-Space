({
    getPriceBooksEntries: function (component, event) {
        let action = component.get('c.getPricebookEntries');
        action.setParams({
            'priceBookId': component.get('v.priceBook.Id')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.priceBookEntries', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    closeModal: function (component, event) {
        component.find("discountView").notifyClose();
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
