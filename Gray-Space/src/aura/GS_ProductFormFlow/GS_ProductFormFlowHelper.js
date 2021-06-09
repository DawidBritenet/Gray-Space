({
    fireReInit : function () {
        let appEvent = $A.get('e.c:GS_ReInit');
        appEvent.fire();
    },

    nextStep : function (component, event) {
        component.set('v.step', component.get('v.step')+1);
    },

    prevStep : function (component, event) {
        component.set('v.step', component.get('v.step')-1);
    },

    fireReInit: function () {
        let appEvent = $A.get('e.c:GS_ReInit');
        appEvent.fire();
    },
})