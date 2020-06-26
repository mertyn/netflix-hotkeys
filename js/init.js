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

// Setup when player ready
function onPlayerReady() {
    console.log("player ready.");
    setupHotkeys();

    // Make player global for debug purposes
    window.nf_player = getNetflixPlayer();
    // Pause and mute immediately for debugging
    window.nf_player.pause();
    window.nf_player.setMuted(true)
}

// Wait for player ready -> wait for spinner deletion
function onPlayerLoaded() {
    console.log("player loaded...");
    waitForNotElement(".nf-loading-spinner", onPlayerReady);
}

// Wait for player being loaded -> wait for .AkiraPlayer
waitForElement(".AkiraPlayer", onPlayerLoaded);