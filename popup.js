document.addEventListener('DOMContentLoaded', () => {
    let button = $('button#download')

    console.log('Button ' + button.text())

    chrome.storage.local.get(null, (items) => {
        console.log('Loaded items', items)

        let index = 0
        items.videos.forEach((video) => {
            let title = parseTitle(video, index)

            let div = $('<div>').attr('style', 'padding: 5px; border-top: 1px solid black;').text(title)

            if (video.isVideo) {
                div.addClass('video')
                div.click(function () {
                    downloadPlayerConfig(items.wid, items.uiconfId, title, video.referenceId)
                })
                index = index + 1
            } else {
                div.addClass('chapter')
                div.prop('disabled', true);
            }

            $('div#titles').append(div)
        })

        button.click(function () {
            $('div.video').click()
        })
    })
});

function downloadPlayerConfig(wid, uiconfId, title, referenceId) {
    const url = `http://cdnapi.kaltura.com/html5/html5lib/v2.50/mwEmbedFrame.php?&wid=_${wid}&uiconf_id=${uiconfId}&flashvars[referenceId]=${referenceId}&callback=o`;

    $.get(url).always(function (o) {
        let frm = o.indexOf('downloadUrl') + 'downloadUrl'.length + 5;
        let to = o.indexOf('",', frm);
        let finalUrl = o.substring(frm, to).split('\\').join('');

        console.log(title, finalUrl)

        downloadVideo(title, finalUrl);
    });
}

function downloadVideo(title, url) {
    let http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            // this.responseURL
            // http://cdnbakmi.kaltura.com/p/1926081/sp/192608100/serveFlavor/entryId/0_tk80t49k/v/2/flavorId/0_82qewob9/fileName/The_Case_for_Kafka_(Source).mp4/clipTo/180000/name/a.mp4

            // finalUrl
            // http://cdnbakmi.kaltura.com/p/1926081/sp/192608100/serveFlavor/entryId/0_tk80t49k/v/2/flavorId/0_82qewob9/fileName/The_Case_for_Kafka_(Source).mp4/
            let finalUrl = this.responseURL.slice(0, -1 * '/clipTo/60000/name/a.mp4'.length);

            chrome.runtime.sendMessage({
                url: finalUrl,
                title: title
            }, function (response) {
            });
        }
    };
    http.send()
}

function parseTitle(video, index) {
    if (!video.isVideo) {
        return video.title
    }

    return leftPad(index + 1) + ' - ' + video.title.replace(/\W+/g, " ") + '.mp4'
}

function leftPad(num) {
    let str = num + "";
    let pad = "000";
    return pad.substring(0, pad.length - str.length) + str;
}

