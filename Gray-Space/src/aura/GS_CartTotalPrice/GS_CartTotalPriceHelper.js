({
    getTotalPrice: function (component, event) {
        let action = component.get('c.getTotalPrice');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.totalPrice', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    }
});