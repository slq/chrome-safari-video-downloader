chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var filename = leftPad(message.index + 1) + ' - ' + message.title.replace(/\W+/g, " ") + '.mp4';
    console.log('Downloading', filename, 'from', message.vedioUrl)

    // if(message.index > 10) {
    //     return;
    // }

    chrome.downloads.download({
        url: message.vedioUrl,
        filename: filename,
        saveAs: false
    });
});

function leftPad(num) {
    var str = num + "";
    var pad = "000";
    return pad.substring(0, pad.length - str.length) + str;
}
