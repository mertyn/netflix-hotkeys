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
    var sessionId = videoPlayer.getPlayerSessionIds()[0];
    
    return videoPlayer.getVideoPlayerBySessionId(sessionId);
}