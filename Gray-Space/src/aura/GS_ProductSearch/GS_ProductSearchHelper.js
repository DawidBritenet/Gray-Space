({
    searchProducts: function (component, event) {
        var name = event.getParam('name');
        var spaceType = event.getParam('spaceType');
        var type = event.getParam('type');
        var page = component.get('v.page');
        var pageSize = component.get('v.pageSize');
        var action = component.get('c.searchProduct');
        action.setParams({
            'name': name,
            'spaceType': spaceType,
            'type': type,
            'resultLimit': pageSize,
            'offset': 0
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    var results = response.getReturnValue();
                    component.set('v.products', results);
                    this.getPagesCount(component, event);
                } else {
                    this.sendMessage('Error', 'Unknown error.', 'Error');
                }
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', 'Search error. Check console', 'Error');
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },

    changePage: function (component, event) {
        var name = event.getParam('name');
        var spaceType = event.getParam('spaceType');
        var type = event.getParam('type');
        var page = component.get('v.page');
        var pageSize = component.get('v.pageSize');
        var offset = (page - 1) * pageSize;
        var action = component.get('c.searchProduct');
        action.setParams({
            'name': name,
            'spaceType': spaceType,
            'type': type,
            'resultLimit': pageSize,
            'offset': offset
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.products', response.getReturnValue());
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', 'Search error. Check console', 'Error');
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },

    getPagesCount: function (component, event) {
        var name = event.getParam('name');
        var spaceType = event.getParam('spaceType');
        var type = event.getParam('type');
        var action = component.get('c.getSearchCount');
        action.setParams({
            'name': name,
            'spaceType': spaceType,
            'type': type
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                var results = response.getReturnValue();

                component.set('v.productsCount', results);
                var pageCount = results / component.get('v.pageSize');
                pageCount = Math.ceil(pageCount);
                if (pageCount == 0) {
                    pageCount = 1;
                }
                component.set('v.pageCount', pageCount);
                var pages = [];
                for (var i = 1; i <= pageCount; i++) {
                    pages.push(i);
                }
                component.set('v.pagesList', pages);
                if (results > 0) {
                    this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Search_Success_1') + ' ' + results + ' ' + $A.get('$Label.c.GS_Search_Success_2'), 'success');
                } else {
                    this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Search_Without_Results'), 'info');
                }
                ;
            }
            if (response.getState() === "INCOMPLETE") {
                console.log('incomplete');
            }
            if (response.getState() === "ERROR") {
                this.sendMessage('Error', $A.get('$Label.c.GS_Search_Error'), 'Error');
                console.log(response.getError());
            }
        })
        $A.enqueueAction(action);
    },

    sendMessage: function (title, message, type) {
        var toastParams = {
            title: title,
            message: message,
            type: type
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
})