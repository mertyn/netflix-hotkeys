console.log("%cNetflix %cHotkeys started.", "background: black; color: red; font-family: sans-serif; padding: 5px 0 5px 5px", "background: black; color: white; font-family: sans-serif; padding: 5px 5px 5px 0");

function injectMarkup(url, selector) {

    function onload(html) {
        var div = document.createElement("div");
        
        div.classList.add("netflix-hotkeys-ui");
        div.innerHTML = html;
        
        var target = document.querySelector(selector);
        target.appendChild(div);
    }

    url = chrome.extension.getURL(url);

    fetch(url).then(function(response) {
        return response.text()
    }).then(onload);
}

function injectScripts(urls) {
    // Create div with class netflix-hotkeys
    var div = document.createElement("div");
    div.classList.add("netflix-hotkeys");

    // Add all scripts to the div
    for (var i in urls) {
        var script = document.createElement("script");
        script.src = chrome.extension.getURL(urls[i]);
        div.appendChild(script);
    }

    // Append the div to the document
    document.body.appendChild(div);
}

//==================================================================================

injectMarkup("html/ui.html", "body");

injectScripts([
    "js/arrive.min.js",
    "js/mousetrap.min.js",
    "js/ui.js",
    "js/player.js",
    "js/init.js"
]);

document.arrive(".AkiraPlayer video", function() {
    chrome.runtime.sendMessage("enableBrowserAction");
});

document.leave(".AkiraPlayer video", function() {
    chrome.runtime.sendMessage("disableBrowserAction");
});

// Set up communication with background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "browserActionClicked") {
        console.log("BrowserAction has been clicked!");

        var help = document.querySelector("div.nfhk-popup#help");
        if (help) help.classList.toggle("visible");
    }
});