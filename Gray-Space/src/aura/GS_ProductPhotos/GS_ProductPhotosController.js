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
         console.log(component.get('v.slide'))
    },

     prevPage : function(component, event, helper) {
         if (1 < component.get('v.slide')+1 ) {
             component.set('v.slide', component.get('v.slide')-1);
         } else {
             component.set('v.slide', component.get('v.photos').length-1);
         }
         console.log(component.get('v.slide'))
     },

})