({
    doInit: function (component, event, helper) {
        helper.getPhoto(component, event);
        helper.getPrice(component, event);
        helper.getStock(component, event);
    },

    handleChange: function (component, event, helper) {
        let value = event.getSource().get('v.value');
        if (value > component.get('v.inStock')) {
            event.getSource().set('v.value', component.get('v.inStock'));
        } else if (value < 0) {
            event.getSource().set('v.value', 0);
        }
    }
});