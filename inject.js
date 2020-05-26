console.log("content script started");

// Inject function and execute it
function inject(func) {
    var scriptElement = document.createElement("script");

    var script = func.toString()                                // function to string
    script = script.replace(/(\/\/.+(\n|\r))|\/\/\n/g, "");     // remove comments
    script = script.replace(/\n|\t|\r/g, " ");                  // minify script

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