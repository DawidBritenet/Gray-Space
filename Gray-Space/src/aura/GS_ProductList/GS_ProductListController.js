({
    doInit: function (component, event, helper) {
        helper.getProducts(component, event);
        helper.getPagesCount(component, event);

        var actions = [
            {label: 'Edit', name: 'edit'},
            {label: 'Delete', name: 'delete'}
        ];

        component.set('v.columns', [
            {
                label: 'Name',
                fieldName: 'GS_Name_Link__c',
                type: 'url',
                typeAttributes: {label: {fieldName: 'Name'}, target: '_blank'}
            },
            {label: 'Product Code', fieldName: 'ProductCode', type: 'text'},
            {label: 'Product SKU', fieldName: 'StockKeepingUnit', type: 'text'},
            {label: 'Type', fieldName: 'GS_Type__c', type: 'text'},
            {type: 'action', typeAttributes: {rowActions: actions}},
        ]);
    },

    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch (action.name) {
            case 'edit':
                helper.createEditProductModal(component, event, row.Id);
                break;
            case 'delete':
                helper.deleteProduct(component, row.Id);
                break;
        }
    },

    newProduct: function (component, event, helper) {
        var event = $A.get('e.c:GS_OpenNewProductForm');
        event.fire();
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

    updateRowSelection: function (component, event) {
        component.set('v.selectedRows', event.getParam('selectedRows'));
    },

    deleteButton : function (component, event, helper) {
        var productsIds = [];
        component.get('v.selectedRows').forEach(row => productsIds.push(row.Id));
        helper.deleteProducts(component, productsIds);
    },

    closeEditForm : function (component, event, helper) {
        component.get('v.modalPromise').then(
            function (modal) {
                modal.close();
            }
        );
        helper.fireReInit();
    },

})