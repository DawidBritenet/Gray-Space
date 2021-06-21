({
    rate: function (component, event, helper) {
        component.set('v.rate', event.currentTarget.dataset.value);
    },

    sendComment: function (component, event, helper) {
        helper.addComment(component, event);
    },
});
