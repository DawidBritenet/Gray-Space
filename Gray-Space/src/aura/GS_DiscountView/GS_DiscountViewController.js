({
    doInit: function (component, event, helper) {
        helper.getPriceBooksEntries(component, event);
    },

    closeModal: function (component, event, helper) {
        helper.closeModal(component, event);
    }
});
