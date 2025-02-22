function getSkuModelJson() {
    const scripts = document.getElementsByTagName('script');
    /*for (let script of scripts) {
        if (script.textContent.includes('skuModel')) {
            return script;
        }
    }*/
    return "Hello World";
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "getSkuModel") {
            const skuModelJson = getSkuModelJson();
            sendResponse({skuModelJson: skuModelJson});
        }
    }
);
