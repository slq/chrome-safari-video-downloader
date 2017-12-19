function leftPad(num) {
    var str = num + "";
    var pad = "000";
    return pad.substring(0, pad.length - str.length) + str;
}


function start() {
    // var jsSrc = $('#metadata_flashactive > div > div.sdwBoxContent > div.brightcove_video > script', html).attr('src');

    var jsSrc = 'https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/29375172/partner_id/1926081';

    var a = jsSrc.match(/\d+/g);
    var apiParams = {
        wid: a[0],
        uiconfId: a[2],
        refList: []
    };

    var script = document.getElementsByTagName("script")
    var apiSettings = "";
    for (var i = 0; i < script.length; i++) {
        if (script[i].innerText.includes("var APP_SETTINGS")) {
            apiSettings = script[i].innerText
        }

    }
    var json = JSON.parse(apiSettings.substring(24, apiSettings.length - 4))
    let refs = json.refwork_response.refids;


    apiParams.refList = refs.map(function (ref) {
        return ref.linkid;
    });

    let titles = []
    refs.forEach((value, index) => titles.push(leftPad(index + 1) + ' - ' + value.title.replace(/\W+/g, " ") + '.mp4'))

    console.log('titles', titles)

    chrome.storage.local.set({
        wid: apiParams.wid,
        uiconfId: apiParams.uiconfId,
        referenceIds: apiParams.refList,
        titles: titles,
    })
}