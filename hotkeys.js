const debugMode = true;

function select(selector) {
    return document.querySelectorAll(selector)
}

function elementExists(selector) {
    var elements = select(selector);
    return !(elements.length < 1);
}

// Wait for element to exist
function waitForElement(selector, callback) {
    var poller = setInterval( function() {
        var elements = select(selector);

        if (elements.length < 1) return;
        else {
            clearInterval(poller);
            callback();
        }
    });
}

function waitForNotElement(selector, callback) {
    var poller = setInterval( function() {
        var eloments = select(selector);

        if (eloments.length > 0) {
            var elements = select(selector);

            if (elements.length > 0) return;
            else {
                clearInterval(poller);
                callback();
            }
        }
    });
}

// Get videoplayer to interact with
function getNetflixPlayer() {
    var videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    var sessionId = videoPlayer.getPlayerSessionIds()[0];
    
    return videoPlayer.getVideoPlayerBySessionId(sessionId);
}

// Init debug functionality
waitForElement(".AkiraPlayer", function() {
    // window.n_player = getNetflixPlayer();
    console.log("AkiraPlayer");

    setTimeout(function() {
        waitForNotElement(".nf-loading-spinner", function() {
            console.log("finished loading?");
        });
    }, 1000); 
});