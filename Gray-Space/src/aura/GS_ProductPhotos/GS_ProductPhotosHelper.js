({
    getPhotos: function (component, event) {
        let action = component.get('c.getPhotosLinks');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photos', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
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
});