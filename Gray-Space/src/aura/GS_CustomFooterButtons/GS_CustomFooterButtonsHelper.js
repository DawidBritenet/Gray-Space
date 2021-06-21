({
    changePage: function (component, page) {
        let navigate = component.get("v.navigateFlow");
        navigate(page);
    }
});