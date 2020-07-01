const ui = {
    init: function() {
        // Copy ui elements
        var uiElement = document.querySelector("div.netflix-hotkeys");
        var copy = uiElement.cloneNode(true);
        var wrapper = document.querySelector("div.sizing-wrapper");
        wrapper.prepend(copy);
            
        // Disable right click on UI
        document.querySelector("div.netflix-hotkeys").oncontextmenu = function(e) { e.preventDefault() };

        // Make all popups closable
        var popups = document.querySelectorAll("div.nfhk-popup");
        popups.forEach(function(element) {
            var closeButton = element.querySelector("span.nfhk-popup-close");
            closeButton.onclick = function(e) {
                element.classList.remove("visible");
            }
        });
    },

    show: function(id) {
        var element = document.querySelector(`div.nfhk-popup#${id}`);
        element.classList.add("visible");
    },

    hide: function(id) {
        var element = document.querySelector(`div.nfhk-popup#${id}`);
        element.classList.remove("visible");
    },

    toggle: function(id) {
        var element = document.querySelector(`div.nfhk-popup#${id}`);
        element.classList.toggle("visible");
    },

    showAll: function() {
        var elements = document.querySelectorAll("div.nfhk-popup");
        elements.forEach(function(element) {
            element.classList.add("visible")
        });
    },

    hideAll: function() {
        var elements = document.querySelectorAll("div.nfhk-popup");
        elements.forEach(function(element) {
            element.classList.remove("visible")
        });
    }
};