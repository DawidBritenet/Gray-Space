({
    getPromotedProducts: function (component, event) {
        let action = component.get('c.getPromotedProducts');
        component.set('v.showSpinner', true);
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.products', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },
});