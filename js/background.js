chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Listen for browserAction to be enabled
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

        chrome.browserAction.onClicked.addListener(function(tab) {
            chrome.tabs.sendMessage(tab.id, "browserActionClicked");
            console.log("BroweserAction clicked at", tab.id);
        });
    }

    // Listen for browserAction to be disabled
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