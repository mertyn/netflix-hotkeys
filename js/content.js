console.log("Content script started.");

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

function injectScript(urls) {
    function inject(url) {
        var script = document.createElement("script")
        script.classList.add("netflix-hotkeys");
        script.src = chrome.extension.getURL(url);
        document.body.appendChild(script);
    }

    if (!Array.isArray(urls)) inject(urls);
    else {
        for (var i in urls) {
            var url = urls[i];
            inject(url);
        }
    }
}

//==================================================================================

injectScript([
    "js/arrive.min.js",
    "js/mousetrap.min.js",
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