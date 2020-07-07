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
        var audioTracks = player.getAudioTrackList();
        
        audioTracks.forEach(function(item) {
            var li = document.createElement("li");
            li.innerText = item.displayName;
            audioList.appendChild(li);
        });

        ui.updateAudio(player);

        // Init subtitles UI
        var textList = document.querySelector("div.nfhk-popup#subtitles div>ul");
        var textTracks = player.getTextTrackList();
        
        textTracks.forEach(function(channel) {
            var li = document.createElement("li");
            li.innerText = channel.displayName;
            textList.appendChild(li);
        });

        ui.updateSubtitles(player);
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
        this.hideAllExcept(id);
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

    hideAllExcept: function(id) {
        var elements = document.querySelectorAll(`div.nfhk-popup:not(#${id})`);
        elements.forEach(function(element) {
            element.classList.remove("visible")
        }); 
    },

    updateAudio: function(player) {
        var audioTracks = document.querySelectorAll("div.nfhk-popup#audio div>ul>li");
        var audioTrack = player.getAudioTrack();

        audioTracks.forEach(function(item) {
            item.classList.remove("selected");

            if (item.innerHTML == audioTrack.displayName) {
                item.classList.add("selected");
            }
        });
    },

    updateSubtitles: function(player) {
        var textTracks = document.querySelectorAll("div.nfhk-popup#subtitles div>ul>li");
        var textTrack = player.getTextTrack();

        textTracks.forEach(function(item) {
            item.classList.remove("selected");

            if (item.innerHTML == textTrack.displayName) {
                item.classList.add("selected");
            }
        });
    }
};