function setupHotkeys() {
    var player = getNetflixPlayer();
    ui.init(player);

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

        player.setAudioTrack(trackList[currentTrackNum]);
        ui.updateAudio(player);
        console.log("Audio set to " + nextTrack.displayName);
    }

    function switchSubtitles() {
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
        if (nextTrack.bcp47 === null) {
            currentTrackNum = (currentTrackNum + 1) % trackList.length;
            nextTrack = trackList[currentTrackNum];
        }

        player.setTextTrack(nextTrack);
        ui.updateSubtitles(player);
        console.log("Subtitles set to " + nextTrack.displayName);
    }

    var lastSubtitles;

    function toggleSubtitles() {
        var currentTrack = player.getTextTrack();
        var trackList = player.getTextTrackList();

        if (currentTrack.bcp47 !== null) {
            lastSubtitles = currentTrack;
            var offTrack;

            for (var i = 0; i < trackList.length; i++) {
                if (trackList[i].bcp47 === null) {
                    offTrack = trackList[i];
                    break;
                }
            }

            player.setTextTrack(offTrack);
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
        // console.log(keyString);

        // Set the chapter
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            setChapter(e.keyCode - 48);
        }
        else {
            // Assign actions to hotkeys
            switch(keyString) {
                case "j": skip(-5000); break;
                case "k": playPause(); break;
                case "l": skip(5000); break;

                // case ",": if (player.isPaused) skip(-41); break;
                // case ".": if (player.isPaused) skip(41); break;

                case "shift+n": nextEpisode(); break;

                case "shift+c": switchSubtitles(); break;
                case "c": toggleSubtitles(); break;
                case "v": switchAudio(); break;

                case "shift+*": increaseSubtitles(); break;
                case "shift+_": decreaseSubtitles(); break;

                case "t": ui.toggle("audio"); break;
                case "g": ui.toggle("subtitles"); break;
                case "h": ui.toggle("hotkeys-help"); break;
            }
        }
    }
}

function removeHotkeys() {
    document.onkeypress = null;
}