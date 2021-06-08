({
    doInit : function (component, event, helper) {
        let photos = component.find('photo');
        helper.getDefaultPhoto(component, event);
    }
})