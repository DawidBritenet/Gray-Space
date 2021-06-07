({
    doInit : function (component, event, helper) {
        var photos = component.find('photo');
        helper.getDefaultPhoto(component, event);
    }
})