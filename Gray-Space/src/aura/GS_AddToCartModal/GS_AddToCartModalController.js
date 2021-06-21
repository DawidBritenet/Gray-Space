({
    onInit: function (component, event, helper) {
        helper.getCart(component, event);
    },

    submit: function (component, event, helper) {
        helper.addToCart(component, event);
    },

    closeModal: function (component, event, helper) {
        helper.closeModal(component, event);
    }
});
