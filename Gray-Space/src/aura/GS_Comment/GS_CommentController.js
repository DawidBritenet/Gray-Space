({
    doInit: function (component, event, helper) {
        helper.getUsername(component, event);
        helper.getUserId(component, event);
    },

    delete: function (component, event, helper) {
        helper.deleteComment(component, event);
    }
});