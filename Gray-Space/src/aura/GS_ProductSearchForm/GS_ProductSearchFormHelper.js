({
    getSpaceTypePickList : function(component, event) {
        let action = component.get('c.getPicklistValues');
        action.setParams({
            'objectName': 'product2',
            'fieldApiName': 'GS_Space_Type__c'
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.SpaceTypePicklist', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    getTypePickList : function(component, event) {
        let action = component.get('c.getPicklistValues');
        action.setParams({
            'objectName': 'product2',
            'fieldApiName': 'GS_Type__c'
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.TypePicklist', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },
})