({
    doInit : function(component, event, helper) {
        helper.getPhotos(component, event)
    },

    nextPage : function(component, event, helper) {
        if (component.get('v.photos').length > component.get('v.slide')+1 ) {
            component.set('v.slide', component.get('v.slide')+1);
        } else {
            component.set('v.slide', 0);
        }
        component.set('v.selectedPhoto', component.get('v.photos')[component.get('v.slide')])
    },

     prevPage : function(component, event, helper) {
         if (1 < component.get('v.slide')+1 ) {
             component.set('v.slide', component.get('v.slide')-1);
         } else {
             component.set('v.slide', component.get('v.photos').length-1);
         }
         component.set('v.selectedPhoto', component.get('v.photos')[component.get('v.slide')])
     },

    selectPage : function (component, event, helper) {
        var index = event.currentTarget.dataset.value;
        component.set('v.slide', parseInt(index));
        component.set('v.selectedPhoto', parseInt(index))
    },

    openLarge : function (component, event, helper) {
        component.set('v.selectedPhoto', component.get('v.photos')[component.get('v.slide')])
        component.set('v.modalOpen', true);
        console.log('v.selectedPhoto');
    },

    closeLarge : function (component, event, helper) {
        component.set('v.modalOpen', false);
    }

})