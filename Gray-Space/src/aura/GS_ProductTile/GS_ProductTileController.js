({
    doInit: function (component, event, helper) {
        helper.getPhoto(component, event);
        helper.getPrice(component, event);
        helper.getRating(component, event);
    },

    goToDetails: function (component, event, helper) {
        helper.goToDetails(component, event);
    }
});