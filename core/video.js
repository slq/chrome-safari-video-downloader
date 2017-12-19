function video() {
    var jsSrc = 'https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/29375172/partner_id/1926081';

    var a = jsSrc.match(/\d+/g);
    var apiParams = {
        wid: a[0],
        uiconfId: a[2],
        refList: []
    };

    let dataUrls = $('ol').find('li').map(function () {
        return $(this).attr('data-api-url')
    })
    console.log('Attrs', dataUrls)

    let promises = []
    for (let i = 0; i < dataUrls.length; i++) {
        promises.push($.get(dataUrls[i]));
    }

    let videos = []
    $.when.apply($, promises).done(function () {
        let data = Array.prototype.slice.call(arguments);

        console.log('All done', data)

        for (let i = 0; i < data.length; i++) {
            console.log('json', data[i])
            let json = data[i][0]
            videos.push({
                referenceId: json.videoclips[0].reference_id,
                title: json.title,
                isVideo: true
            })
        }

        console.log('Videos', videos)

        chrome.storage.local.set({
            wid: apiParams.wid,
            uiconfId: apiParams.uiconfId,
            videos: videos
        })
    });
}
