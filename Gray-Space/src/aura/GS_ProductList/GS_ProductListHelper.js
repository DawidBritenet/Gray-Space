({
    getProducts: function (component, event) {
        let action = component.get('c.getProducts');
        let offset = component.get('v.page') - 1;
        offset *= component.get('v.pageSize');
        action.setParams({
            offset: offset,
            recordLimit: component.get('v.pageSize')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.recordsStart', offset + 1);
                component.set('v.recordsEnd', offset + response.getReturnValue().length);
                component.set('v.products', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', $A.get('$Label.c.GS_Check_Console'), 'error');
                console.log(response.getError()[0]);
            }
        });
        $A.enqueueAction(action);
    },

    getPagesCount: function (component, event) {
        let action = component.get('c.getProductsCount');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();

                component.set('v.productsCount', results);
                let pageCount = results / component.get('v.pageSize');
                pageCount = Math.ceil(pageCount);
                if (pageCount == 0) {
                    pageCount = 1;
                }
                component.set('v.pageCount', pageCount);
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    deleteProduct: function (component, productId) {
        let action = component.get('c.deleteProduct');
        action.setParam('productId', productId);
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                console.log('success')
                this.fireReInit();
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Deleted_product'), 'success');
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    deleteProducts: function (component, productsId) {
        let action = component.get('c.deleteProducts');
        action.setParam('productsId', productsId.join(','));
        console.log(productsId.join(','));
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                console.log('success');
                this.fireReInit();
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Deleted_Products'), 'success');
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    createEditProductModal: function (component, event, recordId) {
        $A.createComponent('c:GS_ProductFormFlow', {'recordId': recordId}, function (content, status) {
            if (status === "SUCCESS") {
                var modalPromise = component.find('editProductModal').showCustomModal({
                    header: $A.get('$Label.c.GS_Edit_Product'),
                    body: content,
                    showCloseButton: true,
                    closeCallback: function () {
                        this.fireReInit();
                    }
                });
            }
        });
    },

    fireReInit: function () {
        let appEvent = $A.get('e.c:GS_ReInit');
        appEvent.fire();
    },

    sendMessage: function (title, message, type) {
        let toastParams = {
            title: title,
            message: message,
            type: type
        };
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
})