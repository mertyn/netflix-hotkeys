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

        // TODO: find better name
        function setChapter(number) {
            var duration = player.getDuration();
            player.seek( (duration / 9) * number );
        }

        function skipIntro() {
            var skipButton = document.querySelector(".skip-credits>a>span");
            skipButton.click();
        }

        function nextEpisode() {
            var nextButton = document.querySelector(".button-nfplayerNextEpisode");
            nextButton.click();
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

                    case "shift+s": skipIntro(); break;
                    case "shift+n": nextEpisode(); break;
                }
            }
            
        }
    }

    // Wait for player being loaded -> wait for .AkiraPlayer
    waitForElement(".AkiraPlayer", function(){
        console.log("player loaded...");
        // Wait for player ready -> wait for spinner deletion
        waitForNotElement(".nf-loading-spinner", function() {
            console.log("player ready");
            setup();

            // Make player global for debug purposes
            window.nf_player = getNetflixPlayer();
            window.getNetflixPlayer = getNetflixPlayer;
        });
    });
}
