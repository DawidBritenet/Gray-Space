({
    sendMessage : function(title, message, type) {
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