console.log("content script started...");

// Inject function and execute it
// This could be made to accept multiple functions for more modularity
function inject(func) {
    var scriptElement = document.createElement("script");

    var script = func.toString()                                // function to string
    // script = script.replace(/(\/\/.+(\n|\r))|\/\/\n/g, "");     // remove comments
    // script = script.replace(/\n|\t|\r/g, " ");                  // minify script

    scriptElement.innerHTML = `(${script})()`;
    scriptElement.classList.add("netflix-hotkeys");
    document.body.appendChild(scriptElement);
}

inject(init);