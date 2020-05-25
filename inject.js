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
    // Wait for element to exist
    function waitForElement(selector, callback) {
        var poller = setInterval( function() {
            var elements = document.querySelector(selector);
            if (elements.length < 1) return;
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

    document.onkeyup = function(e) {
        console.log(e.key);
    }
}

inject(init);