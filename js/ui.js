const ui = {
    init: function(player) {
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
            if (closeButton) {  
                closeButton.onclick = function(e) {
                    element.classList.remove("visible");
                }
            }
        });

        // Init audio UI
        var audioList = document.querySelector("div.nfhk-popup#audio div>ul");
        var audioTracks = player.getTextTrackList();
        
        audioTracks.forEach(function(item) {
            var li = document.createElement("li");
            li.innerText = item.displayName;
            audioList.appendChild(li);
        });

        // Init subtitles UI
        var textList = document.querySelector("div.nfhk-popup#subtitles div>ul");
        var textTracks = player.getAudioTrackList();
        
        textTracks.forEach(function(channel) {
            var li = document.createElement("li");
            li.innerText = channel.displayName;
            textList.appendChild(li);
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
    },

    updateAudio: function() {

    },

    updateSubtitles: function() {
        
    }
};