document.addEventListener('DOMContentLoaded', () => {
    var button = $('button#download')

    console.log('Button ' + button.text())

    chrome.storage.local.get(null, (items) => {
        console.log('Loaded items', items)

        let index = 0
        items.videos.forEach((video) => {
            let title = parseTitle(video, index)

            let div = $('<div>').attr('style', 'padding: 5px; border-top: 1px solid black;').text(title)

            if (video.isVideo) {
                div.css('cursor', 'pointer')
                div.click(function () {
                    download(items.wid, items.uiconfId, title, video.referenceId)
                })
                index = index + 1
            } else {
                div.css('font-size', '11pt').css('color', 'white').css('background-color', 'firebrick').css('margin-top', '10px')
                div.prop('disabled', true);
            }

            $('div#titles').append(div)
        })
    })
});

function download(wid, uiconfId, title, referenceId) {
    var url = 'http://cdnapi.kaltura.com/html5/html5lib/v2.50/mwEmbedFrame.php?&wid=_' + wid +
        '&uiconf_id=' + uiconfId + '&flashvars[referenceId]=' + referenceId + '&callback=o';

    $.get(url).always(function (o) {
        var frm = o.responseText.indexOf('downloadUrl') + 'downloadUrl'.length + 5;
        var to = o.responseText.indexOf('",', frm);
        var finalUrl = o.responseText.substring(frm, to).split('\\').join('');

        draw(title, finalUrl);
    });
}

function draw(title, url) {
    chrome.runtime.sendMessage({
        url: url,
        title: title
    }, function (response) {
    });
}

function parseTitle(video, index) {
    if (!video.isVideo) {
        return video.title
    }

    return leftPad(index + 1) + ' - ' + video.title.replace(/\W+/g, " ") + '.mp4'
}

function leftPad(num) {
    var str = num + "";
    var pad = "000";
    return pad.substring(0, pad.length - str.length) + str;
}

