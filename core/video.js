function parseVideoTutorial() {
    let jsSrc = 'https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/29375172/partner_id/1926081';

    let a = jsSrc.match(/\d+/g);
    let apiParams = {
        wid: a[0],
        uiconfId: a[2],
        refList: []
    };

    let dataUrls = []
    $('li.toc-level-1').each(function () {
        if($(this).find('li').length === 0) {
            dataUrls.push({
                dataUrl: $(this).attr('data-api-url'),
                isVideo: true
            })
        } else {
            dataUrls.push({
                dataUrl: $(this).attr('data-api-url'),
                isVideo: false
            })

            $(this).find('li').each(function () {
                dataUrls.push({
                    dataUrl: $(this).attr('data-api-url'),
                    isVideo: true
                })
            })
        }
    })

    console.log('Attrs', dataUrls)

    let promises = []
    for (let i = 0; i < dataUrls.length; i++) {
        promises.push($.get(dataUrls[i].dataUrl));
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
                isVideo: dataUrls[i].isVideo
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

function isLevelTwoTutorial() {
    return $('li.toc-level-2').length > 0
}
