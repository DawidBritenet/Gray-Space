({
    getPhotosIds : function(component, event) {
        let action = component.get('c.getPhotosIds');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.photosIds', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', $A.get('$Label.c.GS_Check_Console'), 'Error');
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },

    getDefaultPhoto : function(component, event) {

        let action = component.get('c.getDefaultPhotoId');
        action.setParams({
            'productId': component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                console.log(component.get('v.recordId'));
                component.set('v.defaultPhotoId', response.getReturnValue());
                this.getPhotosIds(component, event);
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', $A.get('$Label.c.GS_Check_Console'), 'Error');
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },
})