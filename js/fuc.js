function url_search(search) {
    var json = [];
    if (search == "") {
        json["upg"] = "";
        return json;
    }
    var str = search.substring(1);
    var ar = str.split("&");
    for (i = 0; i < ar.length; i++) {
        var tstring = ar[i].split("=");
        var tmparray = [];
        json[tstring[0]] = tstring[1];
    }
    return json;
}

function get_csv(csv, data_index) {
    var string = csv;
    var spilt_csv = csv.split(/\r\n|\n/);
    var array = [];
    for (i in spilt_csv) {
        if (spilt_csv[i] != "") {
            var tmp = spilt_csv[i].split(',');
            var tmpa = new Array();
            for (j in data_index) {
                tmpa[data_index[j]] = tmp[j];
            }
            array.push(tmpa);
        }
    }
    return array;
}

function readText(filePath) {


}

function newimage(image, srcProperty) {
    var imageObject = new Image();
    imageObject.onload = function () {
        if (typeof image === "object") {
            image[srcProperty] = imageObject.src;
        } else if (typeof image === "string") {
            image = imageObject.src;
        }
        deferred.resolve(image);
        return deferred.promise;
    };


}

function s_menu_ajax(a, index, typea) {
    //console.log(index)
    $.ajax({
        url: 'data/' + typea.link + ".csv",
        cache: false,
        type: "get",
        dataType: 'text',
        success: function (result) {
            var tpk_smenu = {};
            var ts_menu = get_csv(result, ["name", "link", "context", "page", "image"]);
            for (ts in ts_menu) {
                var tmp = ts_menu[ts];
                var lk = "reindex.html?upg=" + tmp.link + "&context=" + tmp.context + "&sub=" + tmp.page;
                a[index]["tpk_smenu"][ts] = {
                    link: lk,
                    name: tmp.name,
                    image: tmp.image,
                    context: {}
                };
                s_menu_list(a, index, ts, tmp);
            }
        }
    });
}
function s_menu_list(a, index, s_menu_index, tmp) {
    $.ajax({
        url: 'data/sub_menu/' + tmp.context + ".csv",
        cache: false,
        type: "get",
        dataType: 'text',
        success: function (tts) {
            var tpks_smenu = {};
            var tss_menu = get_csv(tts, ["name", "page"]);
            for (tss in tss_menu) {
                var tmpa = tss_menu[tss];
                var lo = {
                    name: tmpa['name'],
                    url: "reindex.html?upg=" + tmp.link + "&context=" + tmp.context + "&sub=" + tmpa.page
                };
                a[index]["tpk_smenu"][s_menu_index]['context'][tss] = lo;

            }
            console.log(a);
        }
    })
}
