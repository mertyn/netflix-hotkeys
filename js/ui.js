class UserInterface {
    constructor(player) {
        // Variables
        this.player = player;
        this.tooltipTimer = null;

        // Init

        // Copy ui into .AkiraPlayer
        var element = document.querySelector("div.netflix-hotkeys-ui");
        var copy = element.cloneNode(true);
        var player = document.querySelector(".AkiraPlayer");
        player.prepend(copy);

        // Disable right click for UI
        var ui = document.querySelector(".AkiraPlayer>div.netflix-hotkeys-ui");
        ui.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        });

        // Add onclick to close buttons
        var closeButtons = document.querySelectorAll(".nfhk-popup-close");
        closeButtons.forEach(function(button) {
            button.addEventListener("click", function(e) {
                var parent = button.parentElement;
                if (parent.classList.contains("nfhk-popup"))
                    parent.classList.remove("visible");
            });
        });

        // Init subtitle and audio menus
        var listElement, tracks;
        
        // Audio
        listElement = document.querySelector("div.nfhk-popup#audio div.nfhk-list>ul");
        tracks = this.player.getAudioTrackList();

        tracks.forEach(function(track) {
            var li = document.createElement("li");
            li.innerText = track.displayName;
            listElement.appendChild(li);
        });

        // Subtitles
        listElement = document.querySelector("div.nfhk-popup#subtitles div.nfhk-list>ul");
        tracks = this.player.getTextTrackList();

        tracks.forEach(function(track) {
            var li = document.createElement("li");
            li.innerText = track.displayName;
            listElement.appendChild(li);
        });
    }

    isVisible(id) {
        var element = document.querySelector(`div.nfhk-popup#${id}`);
        return element.classList.contains("visible");
    }

    showPopup(id) {
        this.hideAllPopups();
        var target = document.querySelector(`div.nfhk-popup#${id}`);
        target.classList.add("visible");
    }

    hidePopup(id) {
        var target = document.querySelector(`div.nfhk-popup#${id}`);
        target.classList.remove("visible");
    }
    
    hideAllPopups() {
        var elements = document.querySelectorAll("div.nfhk-popup");
        elements.forEach(function(element) {
            element.classList.remove("visible");
        });
    }

    togglePopup(id) {
        if (!this.isVisible(id)) {
            this.hideAllPopups();
            this.showPopup(id);
        }
        else this.hidePopup(id);
    }

    showTooltip(text) {
        var tooltip = document.querySelector("div.nfhk-tooltip");
        tooltip.textContent = text;

        tooltip.classList.add("visible");
        clearTimeout(this.tooltipTimer);

        this.tooltipTimer = setTimeout(function() {
            tooltip.classList.remove("visible");
        }, 900);
    }
}