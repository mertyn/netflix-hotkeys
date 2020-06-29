console.log("content script started...");

// Load and inject an html structure
function injectHTML(url, selector) {

    function onload(html) {
        var div = document.createElement("div");
        
        div.classList.add("netflix-hotkeys");
        div.innerHTML = html;
        
        var target = document.querySelector(selector);
        target.appendChild(div);
    }

    fetch(url).then(function(response) {
        return response.text()
    }).then(onload);
}

// Load js file(s) and inject to page
function injectJS(urls) {
    function injectScript(script) {
        script = script.replace(/(\/\/.+(\n|\r))|\/\/\n/g, "");     // remove comments
        script = script.replace(/\n|\t|\r/g, " ");                  // minify script
        script = script.replace(/ +/g, " ");                        // Remove unneeded spaces
        
        var scriptElement = document.createElement("script");
        scriptElement.innerHTML = `(function(){${script}})()`;
        scriptElement.classList.add("netflix-hotkeys");
        document.body.appendChild(scriptElement);
    }


    if (Array.isArray(urls)) {
        function onload(texts) {
            var script = texts.join("");
            injectScript(script);
        }

        Promise.all(urls.map(u => fetch(u))).then(responses =>
            Promise.all(responses.map(res => res.text()))
        ).then(onload);
    }
    else {
        fetch(urls).then(function(response) {
            return response.text();
        }).then(injectScript);
    };
}

function inject() {
    injectHTML(chrome.extension.getURL("html/ui.html"), "div.sizing-wrapper");
    injectJS([chrome.extension.getURL("js/ui.js"), chrome.extension.getURL("js/hotkeys.js"), chrome.extension.getURL("js/init.js")]);
}

inject();