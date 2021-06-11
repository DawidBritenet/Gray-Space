({
    doInit: function (component, event, helper) {
        helper.getPhoto(component, event);
        helper.getPrice(component, event);
    },

    goToDetails: function (component, event, helper) {
        helper.goToDetails(component, event);
    }
});
