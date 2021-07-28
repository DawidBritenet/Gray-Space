({
    nextPage: function (component, event, helper) {
        console.log('payment+' + component.get('v.payment'));
        helper.navigateToPage(component, event, 'NEXT');
        if (component.get('v.payment').equals('Card')) {
            helper.navigateToBank(component, event);
        }
    },

    prevPage: function (component, event, helper) {
        helper.navigateToPage(component, event, 'BACK');
    },
});