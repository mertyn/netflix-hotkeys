console.log("content script started...");

// Inject function and execute it
// This could be made to accept multiple functions for more modularity
function injectScript(func) {
    var scriptElement = document.createElement("script");

    var script = func.toString()                                // function to string
    script = script.replace(/(\/\/.+(\n|\r))|\/\/\n/g, "");     // remove comments
    script = script.replace(/\n|\t|\r/g, " ");                  // minify script
    script = script.replace(/ +/g, " ");                        // Remove unneeded spaces

    scriptElement.innerHTML = `(${script})()`;
    scriptElement.classList.add("netflix-hotkeys");
    document.body.appendChild(scriptElement);
}

function injectHTML(url) {
    function onload(html) {
        var div = document.createElement("div");
        
        div.classList.add("netflix-hotkeys");
        div.innerHTML = html;
        document.body.appendChild(div);
    }

    fetch(url).then(function(response) {
        return response.text()
    }).then(onload);
}

injectHTML(chrome.extension.getURL("html/ui.html"));
injectScript(init);