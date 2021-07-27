({
    nextPage: function (component, event, helper) {
        helper.changePage(component, 'NEXT');
    },

    prevPage: function (component, event, helper) {
        helper.changePage(component, 'BACK');
    },
});