({
    moveToHomePage: function (component, event) {
        let navigation = component.find('navigation');
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navigation.navigate(pageReference);
    }
});