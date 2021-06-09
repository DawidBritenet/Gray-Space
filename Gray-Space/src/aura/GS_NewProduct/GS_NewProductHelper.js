({
    createNewProductForm : function(component, event) {
        $A.createComponent('c:GS_ProductFormFlow', {}, function(content, status) {
            if (status === "SUCCESS") {
                component.find('newProductForm').showCustomModal({
                    header: $A.get('$Label.c.GS_New_Product'),
                    body: content,
                    showCloseButton: true
                })
            }
        });
    },

})