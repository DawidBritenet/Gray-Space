({
    getPhoto : function(component, event) {
        let action = component.get('c.getDefaultPhoto');
        action.setParams({
            'productId': component.get('v.product.Id')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photo', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})