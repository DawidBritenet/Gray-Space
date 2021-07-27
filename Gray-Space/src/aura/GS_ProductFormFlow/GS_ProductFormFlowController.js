({
    saveProduct: function (component, event, helper) {
        let payload = event.getParams().response;
        component.set('v.recordId', payload.id);
        helper.changeStep(component, component.get('v.step') + 1);
        helper.fireReInit();
    },

    addedPhoto: function (component, event, helper) {
        helper.changeStep(component, component.get('v.step') + 1);
        helper.fireReInit();
    },

    successClose: function (component, event, helper) {
        let redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
            "recordId": component.get('v.recordId'),
            "slideDevName": "details"
        });
        redirect.fire();
    },

    nextStep: function (component, event, helper) {
        helper.changeStep(component, component.get('v.step') + 1);
    },

    prevStep: function (component, event, helper) {
        helper.changeStep(component, component.get('v.step') - 1);
    },

    closeModal: function (component, event, helper) {
        helper.closeModal(component, event);
        helper.fireReInit();
    }
});