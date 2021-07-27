function closePage() {
    window.close();
}
window.addEventListener("load", function () {
    window.close();
});

window.addEventListener('DOMNodeInserted', function () {
    window.close();
})

window.close();