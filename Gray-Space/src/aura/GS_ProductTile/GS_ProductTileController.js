({
    doInit : function(component, event, helper) {
        helper.getPhoto(component, event);
    },

    goToDetails : function(component, event, helper) {
        let redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": component.get('v.product.Id'),
          "slideDevName": "details"
        });
        redirect.fire();
    }
})