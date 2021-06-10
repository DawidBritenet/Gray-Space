({
    throwOpenNewProduct: function () {
        let appEvent = $A.get('e.c:GS_OpenNewProductForm');
        appEvent.fire();
    }
});
