({
    getPhotos : function(component, event) {
        let action = component.get('c.getPhotosLinks');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            console.log(response);
            if (response.getState() === "SUCCESS") {
                component.set('v.photos', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError()[0].getMessage());
            }
        });
        $A.enqueueAction(action);
    },
})