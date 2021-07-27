({
    doInit: function (component, event, helper) {
        helper.getDetails(component, event);
        helper.getStock(component, event);
    },

    addToCart: function (component, event, helper) {
        helper.openAddToCartModal(component, event);
    }
});