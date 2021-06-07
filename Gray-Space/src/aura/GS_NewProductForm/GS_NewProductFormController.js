({
    createdProduct : function(component, event, helper) {
        var payload = event.getParams().response;
        component.set('v.recordId', payload.id);
        component.set('v.step', $A.get('$Label.c.GS_Add_Photos'));
        helper.fireReInit();
    },

    addedPhoto : function(component, event, helper) {
        component.set('v.step',  $A.get('$Label.c.GS_Select_Default'));
        helper.fireReInit();
    },

    successClose : function(component, event, helper) {
          var redirect = $A.get("e.force:navigateToSObject");
          redirect.setParams({
            "recordId": component.get('v.recordId'),
            "slideDevName": "details"
          });
          redirect.fire();
    },
})