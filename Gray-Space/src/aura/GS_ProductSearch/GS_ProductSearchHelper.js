({
    searchProducts: function (component, event) {
        let name = event.getParam('name');
        let spaceType = event.getParam('spaceType');
        let type = event.getParam('type');
        let page = component.get('v.page');
        let pageSize = component.get('v.pageSize');
        let action = component.get('c.searchProduct');
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
                    this.getPagesCount();
                    component.set('v.recordsStart', 1);
                    component.set('v.recordsEnd', response.getReturnValue().length);
                    component.set('v.products', response.getReturnValue());
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
        });
        $A.enqueueAction(action);
    },

    changePage: function (component, event) {
        let name = event.getParam('name');
        let spaceType = event.getParam('spaceType');
        let type = event.getParam('type');
        let page = component.get('v.page');
        let pageSize = component.get('v.pageSize');
        let offset = (page - 1) * pageSize;
        let action = component.get('c.searchProduct');
        action.setParams({
            'name': name,
            'spaceType': spaceType,
            'type': type,
            'resultLimit': pageSize,
            'offset': offset
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
                this.sendMessage('Error', 'Search error. Check console', 'Error');
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    getPromotedProducts: function (component, event) {
        let action = component.get('c.getPromotedProducts');
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set('v.products', response.getReturnValue());
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

    getPagesCount: function (component, event) {
        let name = event.getParam('name');
        let spaceType = event.getParam('spaceType');
        let type = event.getParam('type');
        let action = component.get('c.getSearchCount');
        action.setParams({
            'name': name,
            'spaceType': spaceType,
            'type': type
        });
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
                let pages = [];
                for (let i = 1; i <= pageCount; i++) {
                    pages.push(i);
                }
                component.set('v.pagesList', pages);
                if (results > 0) {
                    this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Search_Success_1') + ' ' + results + ' ' + $A.get('$Label.c.GS_Search_Success_2'), 'success');
                } else {
                    this.sendMessage($A.get('$Label.c.GS_Success'), $A.get('$Label.c.GS_Search_Without_Results'), 'info');
                };
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
        let toastParams = {
            title: title,
            message: message,
            type: type
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
})