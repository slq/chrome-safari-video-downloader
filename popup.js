document.addEventListener('DOMContentLoaded', () => {
    var button = $('button#download')

    console.log('Button ' + button.text())

    chrome.storage.local.get(null, (items) => {
        console.log('Loaded items', items)

        items.titles.forEach((title, index) => {

            let div = $('<div>').attr('style', 'margin: 5px;').text(title)
            div.click(function () {
                console.log('Downloading video: ', title)

                download(items.wid, items.uiconfId, title, items.referenceIds[index])
            })

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
    }, function(response) {});
}