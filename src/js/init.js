// Listen for player initialization
document.arrive(".AkiraPlayer video", function() {
    var player = new PlayerInterface();
    
    // Simple control
    Mousetrap.bind("k", function() { player.playPause() });
    Mousetrap.bind("j", function() { player.skip(-5000)});
    Mousetrap.bind("l", function() { player.skip(5000) });
    
    // Seeking functions
    Mousetrap.bind("home", function() { player.seekPercentage(0) });
    Mousetrap.bind("end", function() { player.seekPercentage(100) });
    
    Mousetrap.bind("0", function() { player.seekPercentage(0) });
    Mousetrap.bind("1", function() { player.seekPercentage(10) });
    Mousetrap.bind("2", function() { player.seekPercentage(20) });
    Mousetrap.bind("3", function() { player.seekPercentage(30) });
    Mousetrap.bind("4", function() { player.seekPercentage(40) });
    Mousetrap.bind("5", function() { player.seekPercentage(50) });
    Mousetrap.bind("6", function() { player.seekPercentage(60) });
    Mousetrap.bind("7", function() { player.seekPercentage(70) });
    Mousetrap.bind("8", function() { player.seekPercentage(80) });
    Mousetrap.bind("9", function() { player.seekPercentage(90) });
    
    // Next episode
    Mousetrap.bind("shift+n", function() { player.nextEpisode() });
    
    // Speed controls
    Mousetrap.bind("shift+.", function() { player.speedUp() });
    Mousetrap.bind("shift+,", function() { player.speedDown() });

    // Audio
    Mousetrap.bind("v", function() { player.switchAudio() });

    // Subtitles
    Mousetrap.bind("c", function() { player.toggleSubtitles() });
    Mousetrap.bind("shift+c", function() { player.switchSubtitles() });

    // Volume display
    // Mousetrap.bind("up", function() { player.showVolume() });
    // Mousetrap.bind("down", function() { player.showVolume() });

    // Help menu
    Mousetrap.bind("h", function() { player.ui.togglePopup("help") });

    // Debug ui toggles
    Mousetrap.bind("q", function() { player.ui.togglePopup("audio") });
    Mousetrap.bind("w", function() { player.ui.togglePopup("subtitles") });
    Mousetrap.bind("e", function() { player.ui.hideAllPopups() });

    document.addEventListener("keydown", (event) => {
        if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            player.showVolume();
        }
    });

    // Make player global for debugging
    window.player = player;
    // player.player.pause();
});

// Listen for player destroy
document.leave(".AkiraPlayer video", function() {
    Mousetrap.reset();

    document.removeEventListener("keydown", (event) => {
        if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            player.showVolume();
        }
    });
});