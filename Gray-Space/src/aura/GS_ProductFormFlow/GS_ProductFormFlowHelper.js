({
    fireReInit: function () {
        let appEvent = $A.get('e.c:GS_ReInit');
        appEvent.fire();
    },

    changeStep: function (component, step) {
        component.set('v.step', step);
    },

    closeModal: function (component, event) {
        component.find("newProductForm").notifyClose();
        let dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    }
});
