({
    getProducts: function (component, event) {
        let action = component.get('c.getProducts');
        let offset = component.get('v.page') - 1;
        offset *= component.get('v.pageSize');
        component.set('v.showSpinner', true);
        action.setParams({
            offset: offset,
            recordLimit: component.get('v.pageSize')
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.recordsStart', offset + 1);
                component.set('v.recordsEnd', offset + response.getReturnValue().length);
                component.set('v.products', response.getReturnValue());
                this.resetSelection(component);
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

    getPagesCount: function (component, event) {
        let action = component.get('c.getProductsCountAll');
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
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    deleteProduct: function (component, productId) {
        let action = component.get('c.deleteProduct');
        action.setParam('productId', productId);
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.fireReInit();
                this.resetSelection(component);
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Deleted_product'), 'success');
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
            }
        });
        $A.enqueueAction(action);
    },

    deleteProducts: function (component, productsId) {
        let action = component.get('c.deleteProducts');
        action.setParam('productsId', productsId.join(','));
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                this.fireReInit();
                this.resetSelection(component);
                this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Deleted_Products'), 'success');
            }
            if (response.getState() === "ERROR") {
                this.sendErrorMessage(response);
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

    resetSelection: function (component) {
        component.set('v.maxRowSelection', 0);
        component.set('v.maxRowSelection', component.get('v.pageSize'));
    },

    sendErrorMessage: function (response) {
        let message;
        try {
            message = response.getError()[0].message;
        } catch (e) {
            message = $A.get('$Label.c.GS_Unknown_Error');
        }
        this.sendMessage('Error', message, 'error');
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
});