({
    doInit: function (component, event, helper) {
        helper.getPromotedProducts(component, event);
    },

    search: function (component, event, helper) {
        component.set('v.page', 1);
        helper.searchProducts(component, event);
    },

    setPageSize: function (component, event, helper) {
        component.set('v.pageSize', component.find('pageSizePickList').get('v.value'));
        component.set('v.page', 1);
        helper.searchProducts(component, event);
    },

    previousPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') - 1);
        helper.changePage(component, event);
    },

    firstPage: function (component, event, helper) {
        component.set('v.page', 1);
        helper.changePage(component, event);
    },
    nextPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') + 1);
        helper.changePage(component, event);
    },

    lastPage: function (component, event, helper) {
        component.set('v.page', component.get('v.pageCount'));
        helper.changePage(component, event);
    },
});
