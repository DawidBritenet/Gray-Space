({
    doInit: function (component, event, helper) {
        helper.getSpaceTypePickList(component, event);
        helper.getTypePickList(component, event);
    },

    search: function (component, event, helper) {
        helper.search(component, event);
    },
});