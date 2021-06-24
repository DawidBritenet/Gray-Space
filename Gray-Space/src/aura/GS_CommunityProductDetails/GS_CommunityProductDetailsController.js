({
    doInit: function (component, event, helper) {
        helper.getPrice(component, event);
        helper.addToLastVisited(component, event);
    }
});
