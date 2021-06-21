({
    goToBank: function (component, event) {
        let navigation = component.find('navigation');
        let pageReference = {
            "type": "standard__webPage",
            "attributes": {
                "url": "https://pekao24.pl/logowanie"
            }
        };
        navigation.navigate(pageReference);

        let navigate = component.get("v.navigateFlow");
        navigate('NEXT');
    }
});