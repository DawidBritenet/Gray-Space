({
    doInit : function(component, event, helper) {
        let appEvent = $A.get('e.c:GS_OpenNewProductForm');
        appEvent.fire();
    }
})