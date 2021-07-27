({
    search: function (component, event) {
        let myEvent = component.getEvent('searchEvent');
        myEvent.setParams({
            'name': component.find('name').get('v.value'),
            'spaceType': component.find('spaceType').get('v.value'),
            'type': component.find('type').get('v.value')
        });
        myEvent.fire();
    },

    getSpaceTypePickList: function (component, event) {
        let action = component.get('c.getPicklistValues');
        action.setParams({
            'objectName': 'product2',
            'fieldApiName': 'GS_Space_Type__c'
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.SpaceTypePicklist', response.getReturnValue());
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    getTypePickList: function (component, event) {
        let action = component.get('c.getPicklistValues');
        action.setParams({
            'objectName': 'product2',
            'fieldApiName': 'GS_Type__c'
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.TypePicklist', response.getReturnValue());
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