function init() {
    // Functions for setup
    // ==========================================================================================

    // Wait for element to exist
    function waitForElement(selector, callback) {
        var poller = setInterval( function() {
            var elements = document.querySelectorAll(selector);
            if (elements.length < 1) return;
            else {
                clearInterval(poller);
                callback();
            }
        });
    }

    // Wait for element to not exist anymore
    function waitForNotElement(selector, callback) {
        var poller = setInterval( function() {
            var elements = document.querySelectorAll(selector);
            if (elements.length > 0) return;
            else {
                clearInterval(poller);
                callback();
            }
        });
    }

    // Get videoplayer to interact with
    function getNetflixPlayer() {
        var videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var sessionId = videoPlayer.getAllPlayerSessionIds()[0];
        
        return videoPlayer.getVideoPlayerBySessionId(sessionId);
    }

    // Setup
    // ==========================================================================================
    function setup() {
        var player = getNetflixPlayer();

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
        }

        function nextEpisode() {
            var nextButton = document.querySelector(".button-nfplayerNextEpisode");
            nextButton.click();
        }

        // TODO: Make this whole mess better
        function openSubtitles() {
            var controls = document.querySelector(".PlayerControls--control-element.text-control.video-title");
            var subtitleButton = document.querySelector(".button-nfplayerSubtitles");

            controls.click();
            subtitleButton.click();
        }

        function getCurrentSubtitles() {
            // Maybe only execute if subtitle menu is open
            var subs = document.querySelectorAll(".track-list-subtitles>ul>.track");

            for (var i = 0; i < subs.length; i++) {
                if ( subs[i].classList.value.search("selected") != -1) return i;
            }
        }

        function nextSubtitle() {
            openSubtitles();

            var current = getCurrentSubtitles();
            var subs = document.querySelectorAll(".track-list-subtitles>ul>.track");
            
            subs[(current + 1) % subs.length].click();

            var subtitleButton = document.querySelector(".button-nfplayerSubtitles");
            var controls = document.querySelector(".controls-full-hit-zone");
            setTimeout(function() {controls.click();}, 500);
            subtitleButton.click();
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

            player.setTextTrack(trackList[currentTrackNum]);
            console.log("Subtitles set to " + nextTrack.displayName);
        }

        function toggleSubtitles() {
            
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
            console.log("Audio set to " + nextTrack.displayName);
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

                    case "c": switchSubtitles(); break;
                    case "v": switchAudio(); break;
                }
            }
            
        }
    }
    
    // Setup when player ready
    function onPlayerReady() {
        console.log("player ready.");
        setup();

        // Make player global for debug purposes
        window.nf_player = getNetflixPlayer();
    }

    // Wait for player ready -> wait for spinner deletion
    function onPlayerLoaded() {
        console.log("player loaded...");
        waitForNotElement(".nf-loading-spinner", onPlayerReady);
    }

    // Wait for player being loaded -> wait for .AkiraPlayer
    waitForElement(".AkiraPlayer", onPlayerLoaded);
}
