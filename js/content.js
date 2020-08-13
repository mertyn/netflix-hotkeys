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

if (location.href.match(/.+:\/\/www\.netflix\.com\/watch.+/g)) {
    chrome.runtime.sendMessage("enableBrowserAction");
}
else {
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
}


// Set up communication with background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "browserActionClicked") {
        console.log("BrowserAction has been clicked!");
    }
});