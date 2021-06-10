({
    doInit: function (component, event, helper) {
        helper.getProducts(component, event);
        helper.getPagesCount(component, event);

        let actions = [
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
        let action = event.getParam('action');
        let row = event.getParam('row');

        switch (action.name) {
            case 'edit':
                helper.createEditProductModal(component, event, row.Id);
                break;
            case 'delete':
                helper.deleteProduct(component, row.Id);
                break;
        }
    },

    newProduct: function () {
        let event = $A.get('e.c:GS_OpenNewProductForm');
        event.fire();
    },

    setPageSize: function (component, event, helper) {
        component.set('v.pageSize', component.find('pageSizePickList').get('v.value'));
        component.set('v.maxRowSelection', component.find('pageSizePickList').get('v.value'));
        component.set('v.page', 1);
        helper.getProducts(component, event);
        helper.getPagesCount(component, event);
    },

    previousPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') - 1);
        helper.getProducts(component, event);
        helper.resetSelection(component);
    },

    firstPage: function (component, event, helper) {
        component.set('v.page', 1);
        helper.getProducts(component, event);
        helper.resetSelection(component);
    },
    nextPage: function (component, event, helper) {
        component.set('v.page', component.get('v.page') + 1);
        helper.getProducts(component, event);
        helper.resetSelection(component);
    },

    lastPage: function (component, event, helper) {
        component.set('v.page', component.get('v.pageCount'));
        helper.getProducts(component, event);
        helper.resetSelection(component);
    },

    updateRowSelection: function (component, event) {
        component.set('v.selectedRows', event.getParam('selectedRows'));
    },

    deleteSelectedProducts: function (component, event, helper) {
        let productsIds = [];
        component.get('v.selectedRows').forEach(row => productsIds.push(row.Id));
        helper.deleteProducts(component, productsIds);
    },

    closeEditForm: function (component, event, helper) {
        component.get('v.modalPromise').then(
            function (modal) {
                modal.close();
            }
        );
        helper.fireReInit();
    },

});
