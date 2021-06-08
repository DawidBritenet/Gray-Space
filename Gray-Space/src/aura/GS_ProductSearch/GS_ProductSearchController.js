({
    doInit: function (component, event, helper) {
        helper.getPromotedProducts(component, event);
    },

    search: function (component, event, helper) {
        helper.searchProducts(component, event);
    },

    setPageSize: function (component, event, helper) {
        component.set('v.pageSize', component.find('pageSizePickList').get('v.value'));
        component.set('v.page', 1);
        helper.getProducts(component, event);
        helper.getPagesCount(component, event);
    },

    previousPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') - 1);
        helper.getProducts(component, event);
    },

    firstPage: function (component, event, helper) {
        component.set('v.page', 1);
        helper.getProducts(component, event);
    },
    nextPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') + 1);
        helper.getProducts(component, event);
    },

    lastPage: function (component, event, helper) {
        component.set('v.page', component.get('v.pageCount'));
        helper.getProducts(component, event);
    },
})