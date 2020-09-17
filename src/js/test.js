// Test how long arrive.js takes to load
console.time("arrive load")
console.time("init load")

var poller1 = setInterval(function() {
    if (document.arrive) {
        console.timeEnd("arrive load");
        clearInterval(poller1);
    }
});

var poller2 = setInterval(function() {
    if (initHere) {
        console.timeEnd("init load");
        clearInterval(poller2);
    }
});