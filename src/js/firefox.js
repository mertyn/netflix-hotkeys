console.log("firefox.js started...");

function onarrive(selector) {
    var observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {

            console.log(document.querySelector(selector));

            // mutation.addedNodes.forEach(node => {
            //     console.log(node.matches(".AkiraPlayer"));
            // });
        });
    });

    observer.observe(document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true/* ,
        attributeFilter: true */
    });
}

onarrive(".AkiraPlayer");
console.log(document.querySelector(".AkiraPlayer"));