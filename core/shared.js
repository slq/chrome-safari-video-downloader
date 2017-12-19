function draw(title, url) {
    chrome.runtime.sendMessage({
        url: url,
        title: title
    }, function(response) {});
}
