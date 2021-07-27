({
    doInit: function (component, event, helper) {
        let pageRef = component.get('v.pageReference');
        component.set('v.recordId', pageRef.state.c__recordId);
    }
});