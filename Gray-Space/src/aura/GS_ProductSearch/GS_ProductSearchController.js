({
    search : function(component, event, helper) {
        helper.searchProducts(component, event);
    },

    nextPage : function(component, event, helper) {
        let page = component.get('v.page');
        page += 1;
        component.set('v.page', page);
        helper.changePage(component, event);
    },

    previousPage : function(component, event, helper) {
        let page = component.get('v.page');
        page -= 1;
        component.set('v.page', page);
        helper.changePage(component, event);
    },

    setPage : function(component, event, helper) {
        let page = event.getSource().get('v.label');
        console.log(page);
        component.set('v.page', parseInt(page));
        helper.changePage(component, event);
    }
})