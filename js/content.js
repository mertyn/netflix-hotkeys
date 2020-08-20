console.log("Content script started.");

// Listen for url changes
function setUrlListener(callback) {
    var currentUrl = location.href;

    var poller = setInterval(function() {
        if (location.href != currentUrl) {
            currentUrl = location.href
            callback(currentUrl);
        }
    });

    return poller;
}

function clearUrlListener(id) {
    clearInterval(id);
}

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

// If location.href.match("*://www.netflix.com/watch/*")
if (location.href.match(/.+:\/\/www\.netflix\.com\/watch.+/g)) {
    chrome.runtime.sendMessage("enableBrowserAction");
}

// Listen for URL change while not on netflix.com/watch
setUrlListener(function(url) {
    console.log(`Href changed to ${url}`);

    // If url.match("*://www.netflix.com/watch/*")
    // TODO: make function for matching url patterns
    if (url.match(/.+:\/\/www\.netflix\.com\/watch.+/g)) {
        chrome.runtime.sendMessage("enableBrowserAction");
    }
    else {
        chrome.runtime.sendMessage("disableBrowserAction");
    };
});

// Set up communication with background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "browserActionClicked") {
        console.log("BrowserAction has been clicked!");
    }
});