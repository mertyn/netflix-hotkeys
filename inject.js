console.log("content script started");

// Inject function and execute it
function inject(func) {
    var scriptElement = document.createElement("script");

    var script = func.toString()                                // function to string
    // script = script.replace(/(\/\/.+(\n|\r))|\/\/\n/g, "");     // remove comments
    // script = script.replace(/\n|\t|\r/g, " ");                  // minify script

    scriptElement.innerHTML = `(${script})()`;
    scriptElement.classList.add("netflix-hotkeys");
    document.body.appendChild(scriptElement);
}

function init() {
    // Function definitions
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
            var current = player.getCurrentTime();
            player.seek(current + millis);
        }

        // TODO: find better name
        function setChapter(number) {
            var duration = player.getDuration();
            player.seek( (duration / 9) * number );
        }

        // TODO: clean this mess up
        document.onkeyup = function(e) {
            var key = e.key.toLowerCase();

            if (key == "n" && e.shiftKey) {
                var next = document.querySelector(".button-nfplayerNextEpisode");
                next.click();
            }

            else if (e.keyCode >= 48 && e.keyCode <= 57) {
                setChapter(e.keyCode - 48);
            }

            else {
                switch(key) {
                    case "j": skip(-5000); break;
                    case "k": playPause(); break;
                    case "l": skip(5000); break;
                }
            }
            
        }
    }


    // TODO: make this cleaner
    // Wait for player being loaded -> wait for .AkiraPlayer
    waitForElement(".AkiraPlayer", function(){
        console.log("player loaded...");
        // Wait for player ready -> wait for spinner deletion
        waitForNotElement(".nf-loading-spinner", function() {
            console.log("player ready");
            setup();

            // Make player global for debug purposes
            window.nf_player = getNetflixPlayer();
        });
    });
}

inject(init);