({
    getLastVisited: function (component, event) {
        let action = component.get('c.getUserLastVisitedProducts');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.products', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },
});
