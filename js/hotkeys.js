function setupHotkeys() {
    // Init player and UI
    var player = getNetflixPlayer();
    ui.init(player);

    // Init other variables
    var audioMenuTimer;
    var lastSubtitles;

    function playPause() {
        if (player.isPlaying()) player.pause();
        else player.play();
    }

    function skip(millis) {
        // Round current time to full seconds
        var current = Math.round( player.getCurrentTime() / 1000 ) * 1000;
        // Skip by specified amount
        player.seek(current  + millis);
    }

    function setChapter(number) {
        var duration = player.getDuration();
        player.seek( (duration / 10) * number );

        var progressBar = document.querySelector("div.current-progress");
        var scrubber = document.querySelector("div.scrubber-head");

        progressBar.style.width = `${number}0%`;
        scrubber.style.left = `${number}0%`;
    }

    function nextEpisode() {
        var nextButton = document.querySelector(".button-nfplayerNextEpisode");
        if (nextButton) nextButton.click();
    }

    function switchAudio() {
        ui.show("audio");
        var currentTrack = player.getAudioTrack();
        var trackList = player.getAudioTrackList();
        var currentTrackNum;

        // Find position of current track
        for (var i = 0; i < trackList.length; i++) {
            if (currentTrack == trackList[i]) {
                currentTrackNum = i;
                break;
            }
        }
        
        // Go to next position
        currentTrackNum = (currentTrackNum + 1) % trackList.length;
        var nextTrack = trackList[currentTrackNum];

        player.setAudioTrack(nextTrack);
        ui.updateAudio(player);
        console.log("Audio set to " + nextTrack.displayName);
        
        clearTimeout(audioMenuTimer);
        audioMenuTimer = setTimeout(function() {
            ui.hide("audio");
        }, 900);
    }

    function getOffSubtitles() {
        var trackList = player.getTextTrackList();
        var offTrack;

        for (var i in trackList) {
            var track = trackList[i];

            if (
                track.displayName == "Off" ||
                track.displayName == "Aus"
            ) {
                offTrack = track;
                break;
            }
        }

        return offTrack;
    }

    function switchSubtitles() {
        ui.show("subtitles");
        var currentTrack = player.getTextTrack();
        var trackList = player.getTextTrackList();
        var currentTrackNum;

        // Find position of current track
        for (var i = 0; i < trackList.length; i++) {
            if (currentTrack == trackList[i]) {
                currentTrackNum = i;
                break;
            }
        }
        
        // Go to next position
        currentTrackNum = (currentTrackNum + 1) % trackList.length;
        var nextTrack = trackList[currentTrackNum];

        // Skip off
        if (nextTrack == getOffSubtitles()) {
            currentTrackNum = (currentTrackNum + 1) % trackList.length;
            nextTrack = trackList[currentTrackNum];
        }

        player.setTextTrack(nextTrack);
        ui.updateSubtitles(player);
        console.log("Subtitles set to " + nextTrack.displayName);

        ui.showTimed("subtitles", 900);
    }

    function toggleSubtitles() {
        ui.show("subtitles");
        var currentTrack = player.getTextTrack();
        var trackList = player.getTextTrackList();

        if (currentTrack != getOffSubtitles()) {
            lastSubtitles = currentTrack;
            player.setTextTrack(getOffSubtitles());
        }

        else {
            if (lastSubtitles === undefined) {
                var onTrack;

                for (var i = 0; i < trackList.length; i++) {
                    if (trackList[i].bcp47 !== null) {
                        onTrack = trackList[i];     
                        break;
                    }
                }

                player.setTextTrack(onTrack);
            }
            else {
                player.setTextTrack(lastSubtitles);
            }
        }

        ui.updateSubtitles(player);
        console.log("Toggled subtitles to: " + player.getTextTrack().displayName);

        ui.showTimed("subtitles", 900);
    }

    function speedUp() {
        var currentSpeed = player.getPlaybackRate();
        currentSpeed += 0.25;
        player.setPlaybackRate(currentSpeed);
        displaySpeed();
    }

    function speedDown() {
        var currentSpeed = player.getPlaybackRate();
        if (currentSpeed > 0.25) currentSpeed -= 0.25;
        player.setPlaybackRate(currentSpeed);
        displaySpeed();
    }

    function displaySpeed() {
        var speed = player.getPlaybackRate();
        ui.showTooltip(speed + "x", 700);
    }

    function displayVolume() {
        var volume = Math.round( player.getVolume() * 100 );
        ui.showTooltip(volume + "%", 700);
    }

    function increaseSubtitles() {
        var size = player.getTimedTextSettings().size;

        if (size == "SMALL") size = "MEDIUM";
        else if (size == "MEDIUM") size = "LARGE";

        player.setTimedTextSize(size);
    }

    function decreaseSubtitles() {
        var size = player.getTimedTextSettings().size;

        if (size == "LARGE") size = "MEDIUM";
        else if (size == "MEDIUM") size = "SMALL";

        player.setTimedTextSize(size);
    }

    // Add commands to hotkeys
    document.onkeypress = function(e) {
        // Detect if player has changed and update
        if (!player.isReady()) {
            player = getNetflixPlayer();
            window.nf_player = player;
        }

        // Hotkey parser
        var key = e.key.toLowerCase();
        var shift = e.shiftKey ? "shift+" : "";
        var keyString = shift + key;

        // Set the chapter
        if (e.keyCode >= 48 && e.keyCode <= 57) setChapter(e.keyCode - 48);

        else {
            // Assign actions to hotkeys
            switch(keyString) {
                case "j": skip(-5000); break;
                case "k": playPause(); break;
                case "l": skip(5000); break;

                case "Home": setChapter(0); break;
                case "End": setChapter(10); break;

                // case ",": if (player.isPaused) skip(-41); break;
                // case ".": if (player.isPaused) skip(41); break;

                case "shift+n": nextEpisode(); break;

                case "shift+c": switchSubtitles(); break;
                case "c": toggleSubtitles(); break;
                case "v": switchAudio(); break;

                case "shift+:": speedUp(); break;
                case "shift+;": speedDown(); break;

                case "shift+*": increaseSubtitles(); break;
                case "shift+_": decreaseSubtitles(); break;

                case "h": ui.toggle("hotkeys-help"); break;

                // Debugging hotkeys
                case "shift+q": ui.toggle("subtitles"); break;
                case "shift+w": ui.toggle("audio"); break;         
            }
        }
    };

    document.onkeydown = function(e) {
        if (e.key == "ArrowUp" || e.key == "ArrowDown") displayVolume();
    };

    // Close UI when reloading
    window.onbeforeunload = function() {
        ui.hideAll();
    };
}

function removeHotkeys() {
    document.onkeypress = null;
    ui.remove();
}