({
    doInit: function (component, event, helper) {
        helper.getDetails(component, event);
    },

    addToCart: function (component, event, helper) {
        helper.openAddToCartModal(component, event);
    }
});
