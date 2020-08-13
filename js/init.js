function getNetflixPlayer() {
    var videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    var sessionId = videoPlayer.getAllPlayerSessionIds()[0];
    
    return videoPlayer.getVideoPlayerBySessionId(sessionId);
}

document.arrive("video", function() {
    console.log("Player ready.");
});