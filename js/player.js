class PlayerInterface {
    constructor() {
        this.player = this.#getNetflixPlayer();
    }
    
    #getNetflixPlayer() {
        var videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var sessionId = videoPlayer.getAllPlayerSessionIds()[0];
        
        return videoPlayer.getVideoPlayerBySessionId(sessionId);    
    }

    playPause() {
        if (this.player.isPlaying()) this.player.pause();
        else this.player.play();
    }
}