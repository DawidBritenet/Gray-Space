({
    saveProduct: function (component, event, helper) {
        let payload = event.getParams().response;
        component.set('v.recordId', payload.id);
        helper.nextStep(component, event);
        // helper.fireReInit();
    },

    addedPhoto: function (component, event, helper) {
        helper.nextStep(component, event);
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
        helper.nextStep(component, event);
    },

    prevStep: function (component, event, helper) {
        helper.prevStep(component, event);
    },

    closeModal: function (component, event, helper) {
        helper.fireReInit();
        component.find("newProductForm").notifyClose();
    }
})