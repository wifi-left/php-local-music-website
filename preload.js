var keywords = [
    ["snow", "雪", "冰", "封", "寂寞", "冷", "孤独"], ["jingel", "圣诞", "christmas"], ["rain", "雨", "sad", "伤", "bye"], ["remember me", "father", "mother", "home", "祖国", "lonely", "love", "爱", "愛", "恋", "温暖", "感恩", "alone", "自闭", "thank"], ["celebrat", "庆祝", "lemon tree", "lucky", "good", "happiness", "happy", "好运", "开心", "花", "缤纷", "五彩斑斓", "春天", "colorful"]
];
var _SETTING = {};
var LoveSongs = {};
const languageNameList = [
    "英文/未知",
    "中文",
    "日文",
    "韩文",
    "俄语"
]
let pathname = location.href.substring(0,location.href.lastIndexOf("/"));
const localApis = {
    root: location,
    search: pathname + "/apis/local.php?type=search&value=${key}&offset=${pg}&limit=${pgsize}",
    songurl: pathname + "/apis/local.php?type=url&value=${id}",
    songinfo: pathname + "/apis/local.php?type=info&value=${id}",
    kwpicPrefix: "",
    mvplayUrl: pathname + "/apis/void.json",
    kwplaylist: pathname + "/apis/local.php?type=folder",
    hottopsong: pathname + "/apis/local.php?type=random",
    searchHelpKey: pathname + "/apis/local.php?type=suggestKey&value=${value}",
    singersongs: pathname + "/apis/local.php?type=singer&value=${id}&offset=${pn}&limit=${norpgsize}",
    alarmsongs: pathname + "/apis/local.php?type=alarm&value=${id}&offset=${pn}&limit=${norpgsize}",
    topsong: pathname + "/apis/local.php?type=random&value=${norpgsize}&seed=${pn}",
    mv: pathname + "/apis/local.php?type=mv&value=${id}",
    playlist: pathname + "/apis/local.php?type=playlist&value=${id}&offset=${pn}&limit=${norpgsize}",
    randomSong: pathname + "/apis/local.php?type=random"
}
var MusicApis = localApis;

/* START TEST

*/
//MusicApis['search'] = wyApis.search;
//MusicApis['songurl'] = wyApis.songurl;
/*
ENDTEST
*/
//reqId=a91f9f50-fa24-11ea-bd02-1f48de173c95
const defaultCSS = ``;
try {
    LoveSongs = JSON.parse(localStorage.getItem("lovesongss"));
    _SETTING = JSON.parse(localStorage.getItem("defaultconfigs"));
} catch (e) {
    console.log("出现错误，在初始化时：")
    console.error(e);
}
console.log("出现错误了？请查看设置页面的日志而不是这里！")

if (_SETTING == null) _SETTING = { "usingConfig": 0, "usingConfigName": "浅色（默认）主题" };
if (LoveSongs == null) LoveSongs = {};
var _SETTINGList = [];
try {
    _SETTINGList = JSON.parse(localStorage.getItem("userconfigs"));

} catch (e) {
    _SETTINGList = null;
}
function HTMLEncode(html) {
    // html = html.replaceAll(" ","&nbsp;")
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp.remove();
    temp = null;
    return output;
}
function encodeURI_special(val) {
    let str = val;
    str = encodeURI(str);
    str = str.replaceAll("~", "%7E");
    return (str);
}
var GOABLE_style = document.createElement("style");
GOABLE_style.innerHTML = "";
document.head.appendChild(GOABLE_style);
const defaultConfigsList = [{
    "name": "普通字号字体 (浅色)", "lrc.NorLrcColor": "#737373", "lrc.SelLrcColor": "#32c20a", "lrc.NorLineHeight": "28px", "lrc.SelLineHeight": "40px", "lrc.NorFontSize": "16px", "lrc.SelFontSize": "24px", "dark": false, "effect": true, "usercss": "#bg{\r\n    background-image: url(\"./bg/bg4.jpg\");\r\n    background-repeat: no-repeat;\r\n    background-size:cover;\r\n    background-position:center;\r\n}"
}, { "name": "中字号字体 (浅色)", "lrc.NorLrcColor": "#737373", "lrc.SelLrcColor": "#32c20a", "lrc.NorLineHeight": "48px", "lrc.SelLineHeight": "60px", "lrc.NorFontSize": "32px", "lrc.SelFontSize": "48px", "dark": false, "effect": true }, { "name": "大字号字体 (浅色)", "lrc.NorLrcColor": "#737373", "lrc.SelLrcColor": "#32c20a", "lrc.NorLineHeight": "70px", "lrc.SelLineHeight": "80px", "lrc.NorFontSize": "40px", "lrc.SelFontSize": "60px", "dark": false, "effect": true }, { "name": "中号字体 (深色)", "lrc.NorLrcColor": "rgb(209, 209, 209)", "lrc.SelLrcColor": "rgb(23, 236, 148)", "lrc.NorLineHeight": "48px", "lrc.SelLineHeight": "60px", "lrc.NorFontSize": "32px", "lrc.SelFontSize": "48px", "effect": true }, { "name": "大字号字体 (深色)", "lrc.NorLrcColor": "rgb(209, 209, 209)", "lrc.SelLrcColor": "rgb(23, 236, 148)", "lrc.NorLineHeight": "70px", "lrc.SelLineHeight": "80px", "lrc.NorFontSize": "40px", "lrc.SelFontSize": "60px", "effect": true, "usingConfig": "example/bigText.json", "likes": [] }];
if (_SETTINGList == null) _SETTINGList = defaultConfigsList;
var isDef = true;
var _SETTINGIDX = 0;
function saveConfig() {
    if (isDef)
        localStorage.setItem("defaultconfigs", JSON.stringify(_SETTING));
    else {
        _SETTINGList[_SETTINGIDX] = _SETTING;
    }
    localStorage.setItem("lovesongss", JSON.stringify(LoveSongs));
    localStorage.setItem("userconfigs", JSON.stringify(_SETTINGList));
    reloadUserCSS();
    // if (_SETTING == null) _SETTING = {};
}
function fetchinfo(url, headers, recfunc, otherc, count = 0, errFunc = null) {
    if (count > 3) {
        showMsg("请求失败：重试次数过多。", "error");
        try {
            parsesss = false;
        } catch (e) {

        }
        if (errFunc != null) {
            errFunc();
        }
        return;
    }
    var RURL = "./fetch.php?url=" + btoa(url) + "&headers=" + btoa(headers.csrf);
    logdata("Fetch URL: " + RURL);

    $.fetch(RURL, "text").then(data => {
        try {
            try {
                var jsonData = JSON.parse(data);

                if (jsonData['success'] == 'fail') {
                    if (jsonData.code == 3) {
                        showMsg("请求超时，正在重试。(" + (count + 1) + ")", "warn");
                        fetchinfo(url, headers, recfunc, otherc, count + 1);

                        return;

                    } else if (jsonData.code == 5) {
                        showMsg("请求失败：" + jsonData.msg, "error");
                        if (errFunc != null) {
                            errFunc();
                        }
                        return;
                    } else if (jsonData.code == 6) {
                        if (count + 1 > 3) {
                            showMsg("请求失败，" + jsonData.msg + "", "error");
                            try {
                                parsesss = false;
                            } catch (e) {

                            }
                            if (errFunc != null) {
                                errFunc();
                            }
                            return;
                        } else {
                            showMsg("请求失败，2秒后重试。(" + (count + 1) + ")", "warn");
                            setTimeout(() => {
                                showMsg("正在重试中...(" + (count + 1) + ")", "info");
                                fetchinfo(url, headers, recfunc, otherc, count + 1);
                            }, 2000);

                        }
                        return;
                    } else {
                        if (errFunc != null) {
                            errFunc();
                        }
                        showMsg("请求失败：" + jsonData.msg, "error");
                    }
                }
                recfunc(jsonData, otherc);
                return;
            } catch (e) {
                logdata_warn("非 JSON 文本，解析为文本。");
            }
            recfunc(data, otherc);
        } catch (e) {
            logdata_warn(e);
        }
    });

}
var program = {
    hadFile: (filename) => {
        return false;
    },
    getState: () => {
        return isDef;
    },
    getinfo: () => {
        var rjson = { "package": { author: "Gamom", version: "1.0.2" }, "process": { "version": navigator.userAgent } };
        return rjson;
    },
    setConfig: (config, value) => {
        // if (!isDef) {
        // showMsg("无法设置：当前使用预设配置。若要修改配置，请换成自定义配置。", "error");
        // return false;
        // }
        _SETTING[config] = value;
        saveConfig();
        return true;
    },
    getConfig: (config, defaultValue) => {

        var rt = _SETTING[config];
        if (rt == null) rt = defaultValue;
        if (rt == undefined) rt = defaultValue;
        return rt;
    },
    saveAs: (fileName, name) => {
        _SETTING.name = name;
        _SETTINGList[_SETTINGList.length] = _SETTING;
        // localStorage.setItem("userconfigs", JSON.stringify(_SETTINGList));
        saveConfig();
        return true;
    }, useDef: () => {
        _SETTING = {};
        isDef = true;

        try {
            _SETTING = JSON.parse(localStorage.getItem("defaultconfigs"));
            if (_SETTING == null) _SETTING = {};
        } catch (e) {
            _SETTING = {};
            logdata(e);
            // return false;
        }
        logdata("配置文件恢复！");
        // _SETTING = 
        reloadUserCSS();
        return true;

    },
    useExample: (idx) => {
        isDef = false;
        _SETTINGIDX = idx;
        _SETTING = _SETTINGList[_SETTINGIDX];
        // logdata(_SETTING)
        reloadUserCSS();
        if (_SETTING != null) return true;
        // 如果该配置无效
        isDef = true;
        try {
            _SETTING = JSON.parse(localStorage.getItem("defaultconfigs"));
            if (_SETTING == null) _SETTING = {};
        } catch (e) {
            _SETTING = {};
            logdata(e);
            // return false;
        }
        reloadUserCSS();

        return false;
        // return useExample(exampleName);
    },
    listExampleConfig: (dg) => {
        var ress = [];
        for (var i = 0; i < _SETTINGList.length; i++) {
            let name = _SETTINGList[i]['name'];
            // logdata(name)
            ress[ress.length] = { name: name, index: i };
        }
        return ress;
    },
    resetConfig: (a) => {
        if (!isDef && !a) {
            showMsg("重置失败！", "error");
            return false;
        }
        if (!isDef) {
            _SETTINGList.splice(_SETTINGIDX, 1);
            isDef = true;
        }
        try {
            _SETTING = {};
        } catch (e) {
            logdata_warn(e);
        }

        _SETTING = {};
        saveConfig();
        return true;
    },
    returnConfig: () => {
        return _SETTING;
    }
}