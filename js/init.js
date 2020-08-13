document.arrive(".AkiraPlayer video", function() {
    var player = new PlayerInterface();
    
    Mousetrap.bind("j", function() { player.skip(-5000)});
    Mousetrap.bind("k", function() { player.playPause() });
    Mousetrap.bind("l", function() { player.skip(5000) });
    
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
    
    Mousetrap.bind("shift+n", function() { player.nextEpisode() });
    
    Mousetrap.bind("shift+.", function() { player.speedUp() });
    Mousetrap.bind("shift+,", function() { player.speedDown() });
    
    // Make player global for debugging
    window.player = player;
    player.player.pause();
});

document.releaseEvents(".AkiraPlayer video", function() {
    Mousetrap.reset();
});