({
    doInit : function(component, event, helper) {
        helper.getSpaceTypePickList(component, event);
        helper.getTypePickList(component, event);
    },

    search : function(component, event, helper) {
        let myEvent = component.getEvent('searchEvent');
        myEvent.setParams({
            'name': component.find('name').get('v.value'),
            'spaceType': component.find('spaceType').get('v.value'),
            'type': component.find('type').get('v.value')
        });
        myEvent.fire();
    }
})