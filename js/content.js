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