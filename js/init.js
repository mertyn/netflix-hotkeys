document.arrive("video", function() {
    var player = new PlayerInterface();
    player.player.pause();

    window.player = player;
});