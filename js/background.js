chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Listen for browserAction to be set up
    if (request == "enableBrowserAction") {
        console.log("Enabled browserAction");

        // Set enabled icon
        chrome.browserAction.setIcon({
            tabId: sender.tab.id,
            path: "icons/icon-32.png"
        });

        // Remove popup
        chrome.browserAction.setPopup({
            tabId: sender.tab.id,
            popup: ""
        });
    }

    else if (request == "disableBrowserAction") {
        console.log("Disabled browserAction");
        
        // Set disabled icon
        chrome.browserAction.setIcon({
            tabId: sender.tab.id,
            path: "icons/icon-32-off.png"
        });

        // Remove popup
        chrome.browserAction.setPopup({
            tabId: sender.tab.id,
            popup: "html/popup.html"
        });
    }
});