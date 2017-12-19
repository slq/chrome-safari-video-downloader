chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Downloading', message.title, 'from', message.url)

    chrome.downloads.download({
        url: message.url,
        filename: message.title,
        saveAs: false
    });
});
