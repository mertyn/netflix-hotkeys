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

    skip(millis) {
        // Round current time to full seconds
        var current = Math.round( this.player.getCurrentTime() / 1000 ) * 1000;
        // Skip by specified amount
        this.player.seek(current  + millis);
    }

    seekPercentage(percentage) {
        // Seek percentage
        var duration = this.player.getDuration();
        this.player.seek( (duration / 100) * percentage);

        // Set progressbar
        var progressBar = document.querySelector("div.current-progress");
        var scrubber = document.querySelector("div.scrubber-head");

        progressBar.style.width = `${percentage}%`;
        scrubber.style.left = `${percentage}%`;
    }

    nextEpisode() {
        // Get next episode button and click it
        var nextButton = document.querySelector(".button-nfplayerNextEpisode");
        if (nextButton) nextButton.click();
    }

    speedUp() {
        var speed = this.player.getPlaybackRate();
        if (speed < 2) speed += 0.25;
        this.player.setPlaybackRate(speed);

        // Replace this with ui function
        console.log(`${speed}x`);
    }

    speedDown() {
        var speed = this.player.getPlaybackRate();
        if (speed > 0.25) speed -= 0.25;
        this.player.setPlaybackRate(speed);

        // Replace this with ui function
        console.log(`${speed}x`);
    }
}