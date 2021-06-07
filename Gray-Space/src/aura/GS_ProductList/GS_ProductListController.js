({
    doInit : function(component, event, helper) {
        helper.getProducts(component, event);
        component.set('v.columns', [
            {label: 'Name', fieldName: 'GS_Name_Link__c', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'} },
            {label: 'Product Code', fieldName: 'ProductCode', type: 'text'},
            {label: 'Product SKU', fieldName: 'StockKeepingUnit', type: 'text'},
            {label: 'Type', fieldName: 'GS_Type__c', type: 'text'},
        ]);
    },

    newProduct : function(component, event, helper) {
        var event = $A.get('e.c:GS_OpenNewProductForm');
        event.fire();
    }
})