({
    doInit: function (component, event, helper) {
        helper.getCart(component, event);
    },

    nextPage: function (component, event, helper) {
        helper.updateCart(component, event);
    }
});
