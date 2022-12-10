// const audio = require("fluent-ffmpeg/lib/options/audio");
// program.getConfig("")
// const { fstat } = require("fs");
$("#pre-loading-text").show();
$("#pre-fail-text").hide();
var specLrc = 0;
var logFather = document.getElementById("log_display");
var musicPlayingIndex = -1;
var musicPlayingList = [];
var DisabledAnimationLrc = false;
var hideMainLrcs = false;
var errid = 0;
var sourceID = 0;
var NowPlayId = undefined;
var DARK_style = document.createElement("link");
DARK_style.href = "./lib/theme/light.css";
DARK_style.rel = "stylesheet";
document.head.appendChild(DARK_style);
var MULITIROW_style = document.createElement("link");
MULITIROW_style.href = "./lib/plugin/collist.css";
MULITIROW_style.rel = "stylesheet";
document.head.appendChild(MULITIROW_style);

var SPRCLRC_style = document.createElement("link");
SPRCLRC_style.href = "./lib/plugin/speclrcshu.css";
SPRCLRC_style.rel = "stylesheet";

var LP_style = document.createElement("link");
LP_style.href = "./lib/plugin/leftpicrightsong.css";
LP_style.rel = "stylesheet";

var enableLeftPic = program.getConfig("leftpicmode", false);
document.head.appendChild(SPRCLRC_style);
document.head.appendChild(LP_style);

function GUIAni(enable) {
    program.setConfig("DisabledAnimation", !enable);
    DisabledAnimation = !enable;

}
function hideMainLrc(enable) {
    program.setConfig("hideMainLrc", enable);
    hideMainLrcs = enable;
    if (hideMainLrcs) {
        document.getElementById("lrycishow").style.display = "none";
    } else {
        document.getElementById("lrycishow").style.display = "inline-block";
    }
}
function LRCSPECAni(enable) {
    program.setConfig("DisabledAnimationLrc", !enable);
    DisabledAnimationLrc = !enable;

}
function specLrcStyle(id) {
    specLrc = id;
    if (document.head.contains(SPRCLRC_style)) {
        document.head.removeChild(SPRCLRC_style);
    }
    switch (id) {
        case 0:
            //关闭
            document.getElementById("lrc-top").style.display = "none";
            document.getElementById("lrc-bottom").style.display = "none";
            showMsg("特殊歌词关闭", "ok");
            break;
        case 1:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（横）开启", "ok");
            //横列
            break;
        case 2:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";

            SPRCLRC_style.href = "./lib/plugin/speclrcshu.css";
            showMsg("特殊歌词（竖列）开启", "ok");
            document.head.appendChild(SPRCLRC_style);
            //竖列
            break;
        case 3:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（竖列、居中）开启", "ok");
            SPRCLRC_style.href = "./lib/plugin/speclrcmiddleshu.css";
            //竖列居中
            document.head.appendChild(SPRCLRC_style);
            break;
        case 4:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（横、底部、居中）开启", "ok");
            SPRCLRC_style.href = "./lib/plugin/speclrcbottommiddle.css";
            document.head.appendChild(SPRCLRC_style);
            //居中，下
            break;
        case 5:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（横、居中）开启", "ok");
            SPRCLRC_style.href = "./lib/plugin/speclrcmiddle.css";
            //居中
            document.head.appendChild(SPRCLRC_style);
            break;
    }
    program.setConfig("specLrcStyle", id);
}

function IsAppleStore() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var iPad = u.indexOf('iPad') > -1;
    var iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    if (ios || iPad || iPhone) {
        return true;
    }
    else {
        return false;
    }
}
function logdata(data) {
    // document.write
    var dt = data;
    if (typeof (data) == 'object') {
        dt = JSON.stringify(data);
        var code = `<span class="logline loginfo"><span class='logtag'>[INFO]</span><span class='logtag'>[OBJECT]</span>${HTMLEncode(dt)}</span><br/>`;
    } else {
        var code = `<span class="logline loginfo"><span class='logtag'>[INFO]</span>${HTMLEncode(dt)}</span><br/>`;
    }
    try {
        var BASE = logFather.innerHTML;
        if (BASE == null) BASE = "";
        logFather.innerHTML = BASE + code;
    } catch (e) { console.log(data); }

}
function logdata_ok(data) {
    // document.write
    var dt = data;
    if (typeof (data) == 'object') {
        dt = JSON.stringify(data);
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(24, 175, 75);">[SUCCESS]</span><span class='logtag'>[OBJECT]</span>${HTMLEncode(dt)}</span><br/>`;
    } else {
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(24, 175, 75);">[SUCCESS]</span>${HTMLEncode(dt)}</span><br/>`;
    }
    try {
        var BASE = logFather.innerHTML;
        if (BASE == null) BASE = "";
        logFather.innerHTML = BASE + code;
    } catch (e) { console.log(data); }
}
function logdata_warn(data) {
    // document.write
    var dt = data;
    if (typeof (data) == 'object') {
        dt = JSON.stringify(data);
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(208, 223, 7);color:black;">[WARN]</span><span class='logtag'>[OBJECT]</span>${HTMLEncode(dt)}</span><br/>`;
    } else {
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(208, 223, 7);color:black;">[WARN]</span>${HTMLEncode(dt)}</span><br/>`;
    }
    try {
        var BASE = logFather.innerHTML;
        if (BASE == null) BASE = "";
        logFather.innerHTML = BASE + code;
    } catch (e) { console.log(data); }
}
function logdata_error(data) {
    // document.write
    var dt = data;
    if (typeof (data) == 'object') {
        dt = JSON.stringify(data);
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(255, 91, 91)">[ERROR]</span><span class='logtag'>[OBJECT]</span>${HTMLEncode(dt)}</span><br/>`;
    } else {
        var code = `<span class="logline loginfo"><span class='logtag' style="background-color:rgb(255, 91, 91)">[ERROR]</span>${HTMLEncode(dt)}</span><br/>`;
    }
    try {
        var BASE = logFather.innerHTML;
        if (BASE == null) BASE = "";
        logFather.innerHTML = BASE + code;
    } catch (e) { console.log(data); }
    console.warn(data);
}
logdata("时间：" + new Date);
const canvas = document.getElementById("effcan");
const ctx = canvas.getContext('2d')
var mplayer = document.getElementById("musicurl");
var fromUrl = false;

// 有可能会变
var picSnow = new Image();
picSnow.src = "./img/practice/snow.png";
var picRain = new Image();
picRain.src = "./img/practice/rain.png";
var picChristmas = new Image();
picChristmas.src = "./img/practice/christmas.png";
var picFlower = new Array();
for (var i = 1; i <= 7; i++) {
    picFlower[i - 1] = new Image();
    picFlower[i - 1].src = "./img/practice/flower (" + i + ").png";
}
var picAi = new Image();
picAi.src = "./img/practice/love.png";
// const valueslist = document.getElementsByClassName('editable');
var norpgsize = 30;
// // textarea 菜单键点击
// for (var i = 0; i < valueslist.length; i++)
//     valueslist[i].addEventListener('contextmenu', ev => {
//         // 阻止默认行为
//         ev.preventDefault();
//         // 获取鼠标位置
//         // 把鼠标位置发送到主进程
//         openeditmenu(ev.clientX, ev.clientY);
//     });
function parseEnter(e, ele) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        searchSongs(ele.value);
    }
}
mplayer.onplay = () => {
    // logdata("!")
    reflushCanvas();
}
var parsesss = false;
var nowpg = 1;
function getQueryString(url, name) {
    if (name == null) {
        name = url;
        if (window.location.hash != null && window.location.hash != "")
            url = window.location.hash;
        else
            url = window.location.search;
    }

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}
function getalarmidafter(data, text) {
    if (data['code'] == 404) {
        showMsg("无法找到该专辑。", "error");
        return;
    }
    if (data != undefined) {
        openalarmbyid_true(data, text);
    }
}
function searchSongs(val, pg, pgsize) {
    location.hash = `#search=${encodeURIComponent(val)}`;

    if (val.substring(0, "[ALARM]".length) == '[ALARM]') {
        showMsg("获取专辑 ID 中...", "info");
        var text = val.substring("[ALARM]".length);
        if (parseInt(text) + "" == text) {
            openalarmbyid_true(text, "专辑ID：" + text);
        } else {
            let urlpath = `http://127.0.0.1/localmusicmanager/apis/local.php?type=getid&value=${encodeURI(text)}`;
            fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, getalarmidafter, text);
        }
        // http://127.0.0.1/localmusicmanager/apis/local.php?type=getid&value=E:\NEWDOWNLOAD
        return;
    }
    if (val.substring(0, "http://".length) == 'http://') {
        var text = val.substring(val.lastIndexOf('/') + 1);
        var id = getQueryString(text, "musicid");
        // console.log(id);
        if (id == null)
            id = text;
        playmusicbyid(id);
        // logdata(id);
        return;
    }
    else if (val.substr(0, "https://".length) == 'https://') {
        var id = val.substr(val.lastIndexOf('/') + 1);
        // logdata(id);
        playmusicbyid(id);
        return;

    } else if (val.substr(0, '#*'.length) == '#*') {
        // var id;
        var id = val.substr('#*'.length);

        playmusicbyid(id);

        return;
    }
    document.getElementById("listbar").innerHTML = "<p>搜索中...</p>";

    if (pg == null) pg = 1;
    if (pgsize == null) pgsize = norpgsize;
    if (parsesss == true) return;
    parsesss = true;
    nowpg = pg;
    $('#autoinfo').hide();
    // alert(":");
    showMsg("搜索中...", "info");

    let urlpath = (MusicApis.search.replaceAll("${key}", encodeURI_special(val)).replaceAll("${pg}", pg).replaceAll("${pgsize}", pgsize));
    // document.getElementById("listbar").innerHTML = "<p>搜索中...</p>";
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listsong);
}

function search_turnto(pg) {
    searchSongs(document.getElementById("searchBox").value, parseInt(pg), null)
}
function search_turnto1(pg) {
    turnPage_xfc(pg - 1);
}
changeCfg(program.getConfig("usingConfig", null), program.getConfig("usingConfigName", "未知名称的"));
function changeCfg(val, name) {

    if (val == null) {
        program.useDef();
        showMsg("切换默认配置文件成功！", "ok");
        program.setConfig("usingConfig", null);


    } else {
        program.useDef();

        program.setConfig("usingConfig", val);
        program.setConfig("usingConfigName", name);

        if (!program.useExample(val)) {
            showMsg("切换失败！", "error");
            program.setConfig("usingConfig", null);

        } else {
            showMsg("切换 " + name + " 配置文件成功！", "ok");

        }
    }
    specLrc = program.getConfig("specLrcStyle", 2);
    specLrcStyle(specLrc);
    //hideMainLrcs
    hideMainLrcs = program.getConfig("hideMainLrc", false);
    hideMainLrc(hideMainLrcs);
    DisabledAnimationLrc = program.getConfig("DisabledAnimationLrc", IsAppleStore());
    flushLrcSetting();
}


function HTMLEncode1(html) {
    if (html == null) return "";
    if (html == undefined) return "";
    var a = html.toString();
    a = a.replaceAll("<", "&lt;");
    a = a.replaceAll(">", "&gt;");
    a = a.replaceAll("\n", "<br/>");
    a = a.replaceAll(" ", "&nbsp;");
    return a;
}
/**
确认是否框
@param title 标题
@param content 内容
@param coded 是否转义
@param OKTitle 'OK' 标题
@param CANCELTitle 'CANCEL' 标题·
@param OKrecallFunc 'OK' 回调函数
@param CANCELrecallFunc 'CANCEL' 回调函数
*/
function c_confirm(title, content, coded, OKTitle, CANCELTitle, OKrecallFunc, CANCELrecallFunc) {
    var titles = title, contents = content;
    if (coded == null) coded = true;

    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    var code = `<div id="alert-${++msgID}" style="display:none;" class="newadd alertBox"><div class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des">${contents}</div>
    <div class="control">
        <button class="button" onclick="cancelAlert(this);${OKrecallFunc}">${(OKTitle == null) ? "确定" : OKTitle}</button>
        <button class="button" onclick="cancelAlert(this);${CANCELrecallFunc}">${(CANCELTitle == null) ? "取消" : CANCELTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");
}
/**
提示框
@param title 标题
@param content 内容
@param coded 是否转义
@param OKTitle 'OK' 标题
@param recallFunc 回调函数
*/
function c_alert(title, content, coded, OKTitle, recallFunc) {
    msgID++;
    var titles = title, contents = content;
    if (coded == null) coded = true;
    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    var code = `<div id="alert-${msgID}" style="display:none;" class="newadd alertBox"><div class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des">${contents}</div>
    <div class="control">
        <button class="button" onclick="cancelAlert(this);${recallFunc}">${(OKTitle == null) ? "确定" : OKTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");

}
function cancelAlert(btn) {
    var bbtn = btn;
    // bbtn.parentNode.parentNode.parentNode.style.display = "none";
    var id = bbtn.parentNode.parentNode.parentNode.id;
    bbtn.parentNode.parentNode.parentNode.style.pointerEvents = "none";
    // logdata(btn);
    $(bbtn.parentNode.parentNode.parentNode).fadeOut(200);
    setTimeout(`document.getElementById("${id}").remove()`, 200);
}
function propmtAlert(eleName, Func, FuncOK, OKmore) {
    // logdata(eleName);
    var ele = document.getElementById(eleName);
    // logdata(ele);

    var value = ele.getElementsByClassName("inputs")[0].value;
    // var value = ele.getElementsByClassName("inputs")[0].value;
    try {
        // logdata(`${Func}("${value.replaceAll("\\","\\\\").replaceAll("\"","\\\"")}", "${OKmore}")`)
        var back = eval(`${Func}("${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", "${OKmore}")`);
        // logdata(back);
        if (back == true || back == null || back == undefined) {
            cancelAlert(ele.getElementsByClassName("button")[0]);
            eval(`${FuncOK}("${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", "${OKmore}")`);
        }
    } catch (e) {
        cancelAlert(ele.getElementsByClassName("button")[0]);
        logdata_warn(e);
    }
}
/**
prompt
@param title 标题
@param content 内容
@param coded 是否转义
@param valueDef value 默认值
@param OKTitle 'OK' 标题
@param CANCELTitle 'CANCEL' 标题
@param inputJundge 输入判断函数
@param JundgeFuc 'OK' 函数 (return false 阻止关闭) 不加括号
@param OKmore 'OK' 更多参数
@param OKFunc 'OK' 回调
@param CANCELrecallFunc 'CANCEL' 回调函数 加括号
*/
function c_prompt(title, content, coded, valueDef, OKTitle, CANCELTitle, JundgeFunc, OKmore, OKFunc, CANCELrecallFunc) {
    var titles = title, contents = content;
    if (coded == null) coded = true;

    if (coded) {
        titles = HTMLEncode1(titles);
        contents = HTMLEncode1(contents);
    }
    msgID++;

    if (valueDef == null) valueDef = "";
    var code = `<div id="al-btn-${msgID}" style="display:none;" class="newadd alertBox"><div style="max-height:324px;" class="bcontent Mcenter">
    <h1>${titles}</h1>
    <div class="des-ipt">${contents}</div>
    <input class="inputs" value="${valueDef}" />
    <div class="control">
        <button class="button okbutton" onclick="">${(OKTitle == null) ? "确定" : OKTitle}</button>
        <button class="button" onclick="cancelAlert(this);${CANCELrecallFunc}">${(CANCELTitle == null) ? "取消" : CANCELTitle}</button>
    </div>
</div>
    </div>`;
    document.getElementById("alertBox").innerHTML += code;
    var ele = document.getElementsByClassName("newadd")[0];
    var ss = `propmtAlert("al-btn-${msgID}", "${JundgeFunc}", "${OKFunc}", "${OKmore}")`;
    ele.getElementsByClassName("okbutton")[0].onclick = () => {
        eval(ss);
    }
    $(ele).fadeIn(200);
    ele.classList.remove("newadd");

}
flushLrcSetting();
function flushLrcSetting() {

    var result = `<div class="configLine"><button onclick="changeCfg(null)" class="button cbutton">></button>默认配置 (深色) [默认]</div>`;
    var data = program.listExampleConfig(true);
    for (var i in data) {
        let idx = data[i].index;
        let name = data[i].name;
        // logdata(name);
        var code = `<div class="configLine"><button onclick="changeCfg(${idx},'${name.replaceAll('\\', "\\\\").replaceAll("'", "\'")}')" class="button cbutton">></button>${HTMLEncode(name)}</div>`;
        result += code;
    }
    // re();
    document.getElementById("configList").innerHTML = result;
    // --norlrccolor: rgb(209, 209, 209);
    // --sellrccolor: rgb(23, 236, 148);
    // --norlineheight: 28px;
    // --sellineheight: 40px;
    // --norfontsize: 16px;
    // --selfontsize: 24px;
    document.documentElement.style.setProperty('--norlrccolor', program.getConfig("lrc.NorLrcColor", "rgb(209, 209, 209)"));
    document.documentElement.style.setProperty('--sellrccolor', program.getConfig("lrc.SelLrcColor", "rgb(23, 236, 148)"));
    document.documentElement.style.setProperty('--norlineheight', program.getConfig("lrc.NorLineHeight", "28px"));
    document.documentElement.style.setProperty('--sellineheight', program.getConfig("lrc.SelLineHeight", "40px"));
    document.documentElement.style.setProperty('--norfontsize', program.getConfig("lrc.NorFontSize", "16px"));
    document.documentElement.style.setProperty('--selfontsize', program.getConfig("lrc.SelFontSize", "24px"));
    document.getElementById("norlrccolor").value = program.getConfig("lrc.NorLrcColor", "rgb(209, 209, 209)");
    document.getElementById("sellrccolor").value = program.getConfig("lrc.SelLrcColor", "rgb(23, 236, 148)");
    document.getElementById("norlineheight").value = program.getConfig("lrc.NorLineHeight", "28px");
    document.getElementById("sellineheight").value = program.getConfig("lrc.SelLineHeight", "40px");
    document.getElementById("norfontsize").value = program.getConfig("lrc.NorFontSize", "16px");
    document.getElementById("selfontsize").value = program.getConfig("lrc.SelFontSize", "24px");
}
function saveLrcConfig() {
    program.setConfig("lrc.NorLrcColor", document.getElementById("norlrccolor").value);
    program.setConfig("lrc.SelLrcColor", document.getElementById("sellrccolor").value);
    program.setConfig("lrc.NorLineHeight", document.getElementById("norlineheight").value);
    program.setConfig("lrc.SelLineHeight", document.getElementById("sellineheight").value);
    program.setConfig("lrc.NorFontSize", document.getElementById("norfontsize").value);
    program.setConfig("lrc.SelFontSize", document.getElementById("selfontsize").value);
    flushLrcSetting();
}
function likemusic(ele) {
    ele1 = ele.parentNode.parentNode.getElementsByClassName("musicinfo")[0];
    // logdata(ele1.innerHTML);
    // var id = ele1.getAttribute("pid");
    // var artistid = ele1.getAttribute("singerid");
    // var singer = ele1.getAttribute("singer");
    // var songname = ele1.getAttribute("songname");
    // var hasMv = ele1.getAttribute("hasMv");
    // var vip = ele1.getAttribute("vip");
    // var moreinfo = ele1.getAttribute("moreinfo");
    // var pic = ele1.getElementsByClassName("list-img")[0].getAttribute("src");
    var likes = LoveSongs['songs'];
    if (likes == null) likes = [];
    var likeflag = null;
    try {
        likeflag = ele.parentNode.parentNode.getElementsByClassName("list-D")[0];
        if (likeflag == undefined) {
            likeflag = document.createElement("span");
            likeflag.className = "list-D";
            likeflag.innerHTML = "已收藏";
            ele.parentNode.parentNode.getElementsByClassName("list-name")[0].appendChild(likeflag);
            logdata_warn("获取标记失败，决定添加标记。");
        }
    } catch (e) {
        likeflag = document.createElement("span");
        likeflag.className = "list-D";
        likeflag.innerHTML = "已收藏";
        ele.parentNode.parentNode.getElementsByClassName("list-name")[0].appendChild(likeflag);
        logdata_warn("获取标记失败，决定添加标记。");
    }
    try {
        var doc = JSON.parse(ele1.innerHTML);

    } catch (e) {
        showMsg("收藏失败：" + e.message);
        logdata_error("收藏失败：");
        logdata_error(e);
        return;
    }
    var flag = false;
    try {
        for (var i in likes) {
            if (likes[i].id == doc.id) {
                flag = true;
                // delete likes[i];
                likes.splice(i, 1);
                break;
            }
        }
    } catch (e) {
        logdata(e);
    }

    //<div class="list-song" singerid="${artistid}" pid="${PID}" songname=\`${songname}\` vip="${vip}" hasMv="${hasMv}" downloaded="${downloaded}" singer=\`${singer}\` moreinfo=\`${moreinfo}\`>
    if (!flag) {
        // console.log(likeflag)
        likes[likes.length] = doc;
        try {
            if (LoveSongs['flag'] == null) LoveSongs['flag'] = {};
            LoveSongs['flag'][doc['id']] = true;
            likeflag.innerHTML = "已收藏";

        } catch (e) {
            logdata_error("收藏标记失败 (PID: " + doc['id'] + ")");
            logdata_error(doc);
            logdata_error(e);

        }
    } else {
        // console.log(likeflag)
        likeflag.innerHTML = "已取消收藏";
        try {
            if (LoveSongs['flag'] == null) throw "错了就对了";
            delete LoveSongs['flag'][doc['id']];
        } catch (e) {
            logdata_error("收藏标记失败 (PID: " + doc['id'] + ")");
            logdata_error(doc);
            logdata_error(e);

        }
    }
    // logdata

    LoveSongs['songs'] = likes;
    saveConfig();

    if (flag)
        showMsg("已删除收藏", "warn");
    else
        showMsg("已添加收藏", "ok");
    flushLike();
}
function sharemusicID(name, id) {
    if (id == 0) return;
    shareUrl("歌名：" + name, location.origin + location.pathname + "?musicid=" + id + "&source=" + sourceID);
}
function sharemusic(ele) {
    var parentNode = ele.parentNode.parentNode;
    var id = parentNode.getAttribute("pid");
    var Name = "歌曲";
    try {
        Name = parentNode.getElementsByClassName('list-name')[0].innerText;
    } catch (e) {
        logdata_warn(e);
    }
    shareUrl(Name, location.origin + location.pathname + "?musicid=" + id + "&source=" + sourceID);
};
function hide_share() {
    $("#sharetext").fadeOut();
};
function shareUrl(name, URL) {
    $("#sharetext").fadeIn();
    $("#shareurl").text(URL);
    $("#sharename").text(name);
}
function downloadmusic(ele) {
    sharemusic(ele);


}
function configSaver3_OK(text, name) {
    var ok = program.saveAs(text, name);
    if (ok) showMsg("配置文件成功保存到 'example/" + text + ".json", "ok");
    else showMsg("保存失败！请重试！", "error");
    flushLrcSetting();
}
function configSaver2_OK(name, text) {
    // if (text == "") {
    //     showMsg("请输入名称!", "error");
    //     return false;
    // }
    var ok = program.saveAs(text, name);
    if (ok) showMsg("配置文件成功保存到浏览器！", "ok");
    else showMsg("保存失败！请重试！", "error");
    flushLrcSetting();

}
function AirJundge(text) {
    // logdata("AirJundge")
    if (text == "") {
        showMsg("请输入名称!", "error");
        return false;
    }
    return true;
}
function configSaver_OK(text) {
    if (text == "") {
        showMsg("请输入名称!", "error");
        return false;
    }
    configSaver2_OK(text, null);
    // func();
    // program.setConfig("name", text);
    // c_prompt("请输入保存后文件的名字", "此名称将决定保存的文件名", true, "myfile", "保存", "取消", "AirJundge", text, "configSaver2_OK");
}
function configSaver() {
    c_prompt("输入保存名称", "此名称将决定保存的内容的显示名称", true, "我的配置", "保存", "取消", "AirJundge", null, "configSaver_OK");
}
function downsong(dat, id) {
    logdata(dat);
    var urlpath = MusicApis.songinfo.replaceAll("${id}", id);
    // logdata(urlpath)
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, downsong2, dat);
}
function downsong2(data, url) {
    // document.getElementById('watchvideo').pause();
    // var jsont = data.data;
    // var lryics = jsont['lrclist'];
    // if (lryics = undefined) lryics = [];
    // var lrc = (JsonToLrc(lryics));
    // // logdata(oLRC)

    // var songname = jsont.songinfo.songName;
    // var singer = jsont.songinfo.artist;
    // var filename = singer + " - " + songname;
    // // logdata(filename, url);
    // writeFile(program.getConfig("savePath", ".\\music") + "\\" + filename + ".lrc", lrc, "gbk");
    // dlFile(filename, url, program.getConfig("savePath", ".\\music") + "\\" + filename + ".mp3", () => { })
}
function playmusicbyid_notlist1(id, index) {
    showMsg("加载歌曲资源中...", "info");
    // showPage(document.getElementById("music"));
    var urlpath = MusicApis.songurl.replaceAll("${id}", id);
    fetchinfo(urlpath, {}, listensong1, id, 1);
    // hideme(document.getElementById("id_114514"));
    // hideme(document.getElementById("id_musiclist"));
    musicPlayingIndex = index;
}
function showMusicLoading() {
    musicloadingtip1.innerHTML = "正在缓冲音乐，请您稍微休息一会儿。";
    musicloadingtip2.innerHTML = "正在缓冲的音乐 ID 为 【";
    musicloadingtip3.innerHTML = "】";
    $("#music-loading").fadeIn(300);
}
function hideMusicLoading() {
    $("#music-loading").fadeOut(300);
}
function retryGetMusicURL1() {
    if (musicidwaitplay == null) return;
    musicloadingtip1.innerHTML = "缓冲歌曲失败。";
    loadingmusicname.innerHTML = `<a href='#' onclick="retryGetMusicURL_1();">点击此处重试</a><br/>或者 <a href='#' onclick="closeMusicLoading();">点击此处关闭</a>`
    musicloadingtip2.innerHTML = "请尝试等待一些时间， ";

    musicloadingtip3.innerHTML = "";
}
function retryGetMusicURL2() {
    if (musicidwaitplay == null) return;
    musicloadingtip1.innerHTML = "缓冲歌曲失败。";
    loadingmusicname.innerHTML = `<a href='#' onclick="retryGetMusicURL_2();">点击此处重试</a><br/>或者 <a href='#' onclick="closeMusicLoading();">点击此处关闭</a>`
    musicloadingtip2.innerHTML = "请尝试等待一些时间， ";

    musicloadingtip3.innerHTML = "";
}
function retryGetMusicURL_1() {
    playmusicbyid_notlist(musicidwaitplay);
}
function retryGetMusicURL_2() {
    playmusicbyid(musicidwaitplay);
}
var musicidwaitplay = null;
function playmusicbyid_notlist(id, index) {
    showMusicLoading();
    musicidwaitplay = id;
    loadingmusicname.innerText = id;
    showMsg("加载歌曲资源中...", "info");
    showPage(document.getElementById("music"));
    var urlpath = MusicApis.songurl.replaceAll("${id}", id);
    fetchinfo(urlpath, {}, listensong1, id, 1, retryGetMusicURL1);
    hideme(document.getElementById("id_114514"));
    hideme(document.getElementById("id_musiclist"));
    musicPlayingIndex = index;
}
function playmusicbyid(id) {
    loadingmusicname.innerText = id;
    musicidwaitplay = id;
    showMusicLoading();
    showMsg("加载歌曲资源中...", "info");
    showPage(document.getElementById("music"));
    var urlpath = MusicApis.songurl.replaceAll("${id}", id);
    fetchinfo(urlpath, {}, listensong, id, 1, retryGetMusicURL2);
    hideme(document.getElementById("id_114514"));
    hideme(document.getElementById("id_musiclist"));
}
function playmusic(ele) {
    var id = ele.parentNode.parentNode.getAttribute("pid");
    try {
        let musicinfo = JSON.parse(ele.parentNode.parentNode.getElementsByClassName('musicinfo')[0].innerHTML);
        // console.log(musicinfo);
        addMusicToList(musicinfo);
        showMsg("已将歌曲加至播放列表。", "ok");
    } catch (e) {
        showMsg("加入歌曲列表失败：" + e, "error");
    }
}
function changeMusic(id) {
    playmusicbyid(id);
}

var oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [], //歌词数组{t:时间,c:歌词}
    hasTranslate: false
};
function to_string(s) {
    return "" + s;
}
function round(s) {
    return Math.round(s);
}
function toLrcTime(second) {
    var result = "";
    var tHour = 0, tMin = 0;
    var tSec = round(second * 100) / 100; //初始化变量，四舍五入秒数。
    tMin = parseInt(tSec / 60);
    tSec = parseInt((tSec * 100) % 6000) / 100; //先乘100再取余，最后除以100。
    tHour = parseInt(tMin / 60);
    tMin = parseInt(tMin % 60);
    if (tHour > 0) { //判断有没有1小时
        if (tHour < 10) result = result + "0"; //小时
        result = result + to_string(tHour);

        result = result + ":";

        if (tMin < 10) result = result + "0"; //分钟
        result = result + to_string(tMin);

        result = result + ":";

        if (tSec < 10) result = result + "0"; //秒
        result = result + to_string(tSec);

        if (tSec * 100 % 100 == 0) result = result + ".0";
        if (tSec * 100 % 10 == 0) result = result + "0";
    }
    else {

        if (tMin < 10) result = result + "0"; //分钟
        result = result + to_string(tMin);

        result = result + ":";

        if (tSec < 10) result = result + "0"; //秒
        result = result + to_string(tSec);
        if (tSec * 100 % 100 == 0) result = result + ".0";
        if (tSec * 100 % 10 == 0) result = result + "0";
    }
    return result;
}
function JsonToLrc(json) {
    //     .版本 2

    // J1.解析 (JSON)
    // .计次循环首 (J1.成员数 (), i)
    //     J2 ＝ J1.取成员 (i － 1)
    //     gc ＝ 选择 (gc ＝ “”, gc, gc ＋ #换行符) ＋ “[” ＋ 转换为时间 (到数值 (去左右文本 (J2.取属性对象 (“time”), #引号))) ＋ “] ” ＋ 去左右文本 (J2.取属性对象 (“lineLyric”), #引号)

    //     ' 调试输出 (J2.取属性对象 (“lineLyric”))
    // .计次循环尾 ()
    var result = "";
    for (var i in json) {
        try {
            var nl = json[i];
            result += (result == "" ? "" : "\r\n") + "[" + toLrcTime(nl.time) + "]" + nl.lineLyric;
        } catch (e) {
            showMsg(e, "error");
        }
    }
    return result;

}

function createLrcObj(lrc) {
    oLRC.ms = [];
    oLRC.hasTranslate = false;
    oLRC.ti = "",
        oLRC.ar = "",
        oLRC.al = "",
        oLRC.by = "",
        oLRC.offset = 0;
    if (lrc.length == 0) return;
    var lrc1 = lrc;
    lrc1.replaceAll("\r\n", "\n");
    lrc1.replaceAll("\n\r", "\n");
    lrc1.replaceAll("\r", "\n"); //处理特殊换行
    var lrcs = lrc1.split('\n');//用回车拆分成数组
    for (var i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if (isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        } else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for (var k in arr) {
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr) {
                var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t - b.t;
    });
    try {
        if (oLRC.ms.length >= 4) {
            if (oLRC.ms[1].c == '//' || oLRC.ms[3].c == '//') {
                oLRC.hasTranslate = true;
            }
        }
    } catch (e) {
        logdata_error(e);
    }
    /*
    for(var i in oLRC){ //查看解析结果
        logdata(i,":",oLRC[i]);
    }*/
    //From https-:-//blog.csdn.net/fenglin247/article/details/86674646
}
var lrcs = [];
var mshowurl = document.getElementById("mshowurl");
document.getElementById("songname").innerHTML = "无歌曲播放";
function lrcinit() {
    var res = "";
    for (var i in oLRC.ms) {
        var line = oLRC.ms[i];
        //t Time c Text
        if (line.c == '') {
            line.c = "//";
        }
        // var code = `<div id='lrc-${i}' class='lrc-line' time='${line.t}'>${HTMLEncode(line.c)}</div>`
        var code = `<div id='lrc-${i}' class='lrc-line' time='${line.t}'><span style="transition: 0ms;" class="lrc-content" onclick='playfromtime(${line.t});'>${HTMLEncode(line.c)}</span></div>`
        res += code;
    }
    if (res == "") res = "<div id='lrc-0' class='lrc-line' time='0'>该歌曲暂时无歌词提供</div>";
    document.getElementById("lrycishow").innerHTML = res;
    windowsResize();
    // document.getElementsByClassName("lrc-line");
    // $(".lrc-line").on("click", (event) => {
    // console.log(event

    // });
    if (document.getElementById("lrconly").style.opacity == 1) {
        updateLrcOnly();
    }
}
function playfromtime(time) {
    // var time = event.target.getAttribute("time");
    var nowTime = mplayer.currentTime;
    showMsg(`从 ${time} 秒开始播放<br/><a onclick="playfromtime(${nowTime})">返回原位置</a>`, "info", true);
    mplayer.currentTime = time;
    // mplayer.currentTime = time;
    // showMsg("已撤销操作", "info");
}
var timer = 0;
function ScrolltoEx(ele, x) {
    if (timer != 0) {
        try {
            clearInterval(timer);
            timer = 0;
        } catch (e) {
            // logdata(e);
            logdata(e);
        }
    }
    var mb = Math.round(x);
    if (mb < 0) mb = 0;
    if (mb > ele.scrollHeight) mb.ele.scrollHeight;
    var g = Math.round(Math.abs(x - ele.scrollTop) / 30);
    // logdata(g);
    if (g <= 0) g = 1;
    var tl = 0;
    timer = setInterval(function () {
        //让滚动条到顶部的距离自动缩减到0;
        // ele.scrollTop = document.body.scrollTop = Math.floor(Ontop - 200);//兼容性设置;
        //设置定时器
        // logdata(ele.scrollTop,mb)
        tl++;
        if (tl >= 50) {
            ele.scrollTop = mb;
            clearInterval(timer);
            timer = 0;
        } else
            if (Math.abs(ele.scrollTop - mb) <= g / 2) {
                ele.scrollTop = mb;
                clearInterval(timer);
                timer = 0;
            } else {
                // if (g < 16 && tt%2==0) g++,tt=1;
                // else tt++;
                if (ele.scrollTop > mb)
                    ele.scrollTop = (ele.scrollTop) - g;
                else
                    ele.scrollTop = (ele.scrollTop) + g;
            }
    }, 10);
}
function pointToLrc(push = false) {
    try {
        var times = mplayer.currentTime + oLRC.offset;
        // logdata(time)
    } catch (e) {
        return;
    }
    var i = 0;
    if (oLRC.ms.length == 0) return;
    try {
        var tmp = parseFloat(oLRC.ms[0].t);
        while (i < oLRC.ms.length && tmp <= times) {
            i++;
            if (i < oLRC.ms.length) tmp = parseFloat(oLRC.ms[i].t);
        }
        // logdata(i);
        i -= 1;
        if (i == -1) i = 0;
        hilightlrc(i, push);
    } catch (e) {
        logdata(e);
    }
}
mplayer.onended = () => {
    nextMusic();
}
mplayer.ontimeupdate = () => {
    pointToLrc();
};
function windowsResize() {
    document.getElementById("lrycishow").style.paddingBottom = (parseInt((document.getElementById("bg").clientHeight - 180) / 2) - 20) + "px";
    document.getElementById("lrycishow").style.paddingTop = (parseInt((document.getElementById("bg").clientHeight - 180) / 2) - 20) + "px";
    if (document.getElementById("bg").clientWidth < 720 && GOLBAL_mulitirow != 1 && ismulitirow == 1) {
        showMsg("检测到您的屏幕宽度较小，已为您自动关闭两列歌词。如需开启请在设置中设置默认开启。", "info");
        ismulitirow = 0;
        reloadLrcStyle();
    }
}
var DEBUG_A = 0, DEBUG_B = 0;
var TimeOuttmp = -1;
function hilightlrc(idx, push = false) {
    var ele = document.getElementsByClassName("lrc-line-sel");
    if (!push)
        for (var i = 0; i < ele.length; i++) {
            if (ele[i].id == ('lrc-' + idx)) return;
            if (ele[i].id == ('s-lrc-' + idx)) return;
            ele[i].classList.remove("lrc-line-sel");
        }
    var bh = window.innerHeight;
    // 显示到： bh/2;
    var schheight = document.getElementById("lrycishow").scrollHeight;
    var topBotH = (document.getElementById("bg").clientHeight - 180) / 2 - 20;
    // ScrolltoEx(document.getElementById("lrycishow"), (idx) / oLRC.ms.length * (schheight - bh / 2 + 80) - bh / 2 + 160);

    try {
        document.getElementById("lrc-" + idx).classList.add("lrc-line-sel");
    } catch (e) {

    }
    if (document.getElementById("lrconly").style.opacity == 1) {
        try {
            document.getElementById("s-lrc-" + idx).classList.add("lrc-line-sel");

            var ViewableHeight = document.documentElement.clientHeight;
            document.getElementById("lrconly-bottom").style.height = (ViewableHeight / 2) + "px";
            var HTMLHeight = document.querySelector("html").scrollHeight;

            ScrolltoEx(document.querySelector("html"), (idx) / oLRC.ms.length * (HTMLHeight - (ViewableHeight / 2) - 212) - (ViewableHeight) / 2 + 152 + DEBUG_B);
            // ViewableHeight
            // console.log(1);
        } catch (e) {
            // console.warn(e)lrconly
        }
    } else {
        ScrolltoEx(document.getElementById("lrycishow"), (idx) / oLRC.ms.length * (schheight - 2 * topBotH - 12 + DEBUG_A) + DEBUG_B + (enableLeftPic ? 12 : 30));
    }



    if (specLrc != 0) {

        if (DisabledAnimationLrc) {
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            document.getElementById("lrc-top").innerText = document.getElementById("lrc-" + idx).innerText;
            document.getElementById("lrc-bottom").innerText = document.getElementById("lrc-" + (idx + 1)).innerText;
        } else {
            $("#lrc-top").fadeOut(100);
            $("#lrc-bottom").fadeOut(100);

            if (TimeOuttmp != -1) {
                clearTimeout(TimeOuttmp);
                TimeOuttmp = -1;
            }
            TimeOuttmp = setTimeout(() => {
                TimeOuttmp = -1;
                $("#lrc-top").fadeIn(100);
                $("#lrc-bottom").fadeIn(100);
                try {
                    document.getElementById("lrc-top").innerText = document.getElementById("lrc-" + idx).innerText;

                } catch (e) {
                    document.getElementById("lrc-top").innerText = "";
                }
                try {
                    document.getElementById("lrc-bottom").innerText = document.getElementById("lrc-" + (idx + 1)).innerText;
                } catch (e) {
                    document.getElementById("lrc-bottom").innerText = "";
                }
            }, 150);
        }

    }
}
function stopPropagation(e) {
    e.stopPropagation();
}

var pageUrl = "";
function turnPage_xfc(page) {
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", page));
    document.getElementById("xfc_list").innerHTML = "加载中...";
    // logdata(urlpath)
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey2, page);
}
function turnPage_xfc2(page) {
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", page));
    document.getElementById("xfc_list").innerHTML = "加载中...";
    // logdata(urlpath)
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey3, page);
}
function opensingerbyid(id, name) {
    if (id == null || id == 0 || id == "") return;
    displaySth(document.getElementById("id_114514"));
    document.getElementById("xfc_title").innerText = "歌手：" + name;
    pageUrl = MusicApis.singersongs.replaceAll("${norpgsize}", norpgsize).replaceAll("${id}", encodeURIComponent(id));
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", 0));
    // logdata(urlpath)
    document.getElementById("xfc_list").innerHTML = "加载中...";

    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey2, 0);
}
function openalarmbyid_true(id, name) {
    if (id == null || id == 0 || id == "") return;
    displaySth(document.getElementById("id_114514"));
    document.getElementById("xfc_title").innerText = "专辑：" + name;
    pageUrl = MusicApis.alarmsongs.replaceAll("${norpgsize}", norpgsize).replaceAll("${id}", id);
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", 0));
    document.getElementById("xfc_list").innerHTML = "加载中...";

    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey2, 0);
}
function openpaihang(id, name) {

    displaySth(document.getElementById("id_114514"));
    document.getElementById("xfc_title").innerText = "" + name;
    pageUrl = MusicApis.topsong.replaceAll("${norpgsize}", norpgsize).replaceAll("${id}", id);
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", 1));
    document.getElementById("xfc_list").innerHTML = "加载中...";

    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey3, 1);
}
function openalarmbyid(id, name, page = 0) {
    if (id == null || id == 0 || id == "") return;
    displaySth(document.getElementById("id_114514"));
    document.getElementById("xfc_title").innerText = "播放列表 【" + name + "】";
    pageUrl = MusicApis.playlist.replaceAll("${norpgsize}", norpgsize).replaceAll("${id}", id);
    var url = encodeURI_special(encodeURI_special(pageUrl.replaceAll("${pn}", page + 1)));
    document.getElementById("xfc_list").innerHTML = "加载中...";

    fetchinfo(url, { csrf: TOKEN_CSRF }, listAlarmKey, page);
}

function listAlarmKey(data, d2) {
    var finallyCode = "";
    var kwlist = data;
    var maxPG = 0;
    try {
        kwlist = data;
        nowpg = d2 + 1;
        var kwlist = data;
        // showMsg("整理结果中...", "info");
        var pp = parseInt(kwlist['data']['total']);
        // logdata(pp, pp == null)
        if (isNaN(pp) || pp == null || pp == 0) pp = 0;
        // logdata(pp,kwlist.songnum)
        maxPG = (parseInt(pp / norpgsize));
    } catch (e) {
        //1855
        // kwlist = data;
        logdata_error("打开播放列表时出现错误：")
        logdata_error(data);
    }
    // logdata(data)
    try {

        // logdata(kwlist)
        showMsg("整理结果中...", "info");
        // var maxPG = (parseInt(parseInt(kwlist.total) / norpgsize));
        var lists = kwlist['data']['musicList'];
        var numberPrefix = 0;
        if (norpgsize * maxPG > 99) {
            numberPrefix = nowpg + ":<br/>"
        } else {
            numberPrefix = norpgsize * (nowpg - 1);
        }
        for (var i = 0; i < lists.length; i++) {
            var nowline = lists[i];
            var PID = nowline['musicrid'];
            // console.log(PID);
            PID = PID.replaceAll("MUSIC_", "");
            var songname = nowline.name;
            var singer = HTMLEncode(nowline.artist);
            var vipget = "";
            try {
                vipget = nowline['payInfo']['feeType']['vip'];
            } catch (e) {
                //Do nothing.
            }
            var vip = (vipget == "1");
            var hasMv = nowline.hasmv;
            // logdata(nowline.hasmv);
            var releaseDate = nowline.releaseDate;
            var pic = "./img/music.png";
            pic = nowline['pic'];
            if (pic == null || pic == "") pic = "./img/music.png";
            var artistid = nowline.artistid;
            var mvid = 0;
            if (hasMv == 1) {
                mvid = nowline.rid;
            }
            var downloaded = false;
            try {
                downloaded = LoveSongs['flag'][PID];
            } catch (e) {
                logdata("搜索时出错：");
                logdata_warn(e);
            }

            var moreinfo = ((nowline.album != "" && nowline.album != null) ? HTMLEncode("专辑：" + nowline.album) : "");
            // logdata()
            if (pic == undefined) pic = "./img/unknown-record.png";
            moreinfo += (moreinfo == "" ? "" : "<br/>") + ((releaseDate != "" && releaseDate != null) ? (HTMLEncode("发布日期：" + nowline.releaseDate)) : "")
            var jsons = { id: PID, songname: songname, singer: singer, pic: pic, artistid: artistid, vip: vip, hasMv: hasMv, mvid: mvid, moreinfo: moreinfo };
            var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(jsons)}</div>
            <div class="list-check">
                ${(numberPrefix + (i + 1))}
            </div>
            <img class="list-img" src="${pic}" style="display:inline-block" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="downloadmusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div></div>
            </div>`
            finallyCode += code;
        }

    } catch (e) {
        // console.log(e)
        logdata_error(e);
        finallyCode = ("出现错误：" + e);
        // return;
    }
    try {
        var lastpg = nowpg - 1;
        var nextpg = nowpg + 1;
        if (lastpg <= 0) lastpg = 1;
        if (nextpg > maxPG + 1) nextpg = maxPG + 1;
        var pageselcode = `<div class="pgid" onclick="search_turnto2(1);">
                        1
                    </div>
                    <div class="pgid" onclick="search_turnto2(${lastpg});">
                        &lt;
                    </div>
                    <div class="pgid" onclick="search_turnto2(document.getElementById('pginput1').value);">
                        To
                    </div>
                    <input id='pginput1' value="${nowpg}" />
                    <div class="pgid" onclick="search_turnto2(${nextpg});">
                        &gt;
                    </div>
                    <div class="pgid" onclick="search_turnto2(${maxPG + 1});">
                    ${maxPG + 1}
                    </div>`
        document.getElementById("pagesel1").innerHTML = pageselcode;
    } catch (e) {
        logdata_error(e);
    }
    if (finallyCode == "") {
        finallyCode = "<p>无搜索结果</p>";
    } else {

        finallyCode += `<a onclick="search_turnto2(${lastpg});">&lt; 上一页</a> &nbsp; &nbsp; &nbsp;<a class="pgid" onclick="search_turnto2(${nextpg});"> 下一页 &gt;</a>`;
    }

    // document.getElementById("pagesel1").innerHTML = pageselcode;

    // logdata(kwlist);
    // kwlist.data.list

    document.getElementById("xfc_list").innerHTML = finallyCode;
    // parsesss = false;
}
function search_turnto2(page) {
    urlpath = encodeURI_special(pageUrl.replaceAll("${pn}", page));
    document.getElementById("xfc_list").innerHTML = "加载中...";
    // logdata(urlpath)
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listAlarmKey, page - 1);
}
function listAlarmKey2(data, d2) {
    var finallyCode = "";
    // logdata(data)
    try {

        // var flag = false;
        var pic1 = data.img;
        if (pic1 == null || pic1 == "")
            pic1 = "./img/music.png"
        else {
            pic1 = pic1;
            // flag = true;
        }
        nowpg = d2 + 1;
        var kwlist = data;
        showMsg("整理结果中...", "info");
        var pp = parseInt(kwlist.total);
        // logdata(pp, pp == null)
        if (isNaN(pp) || pp == null || pp == 0) pp = parseInt(kwlist.songnum);
        // logdata(pp,kwlist.songnum)
        var maxPG = (parseInt(pp / norpgsize));

        var lists = kwlist.musiclist;
        for (var i = 0; i < lists.length; i++) {
            var nowline = lists[i];
            var PID = nowline.musicrid;
            if (PID == null || PID == "")
                PID = nowline.id;
            var songname = nowline.name;
            var singer = HTMLEncode(nowline.artist);
            var vipget = "";
            try {
                vipget = nowline['payInfo']['feeType']['vip'];
            } catch (e) {
                //Do nothing.
            }
            var vip = (vipget == "1");
            var hasMv = nowline.hasmv;
            // logdata(nowline.hasmv);
            var releaseDate = nowline.releaseDate;
            var pic = nowline.web_albumpic_short;
            if (pic == null || pic == "")
                pic = pic1;
            else
                pic = MusicApis.kwpicPrefix + pic;
            var artistid = nowline.artistid;
            var mvid = 0;
            if (hasMv == 1) {
                mvid = nowline.rid;
            }
            var downloaded = false;
            try {
                downloaded = LoveSongs['flag'][PID];
            } catch (e) {
                logdata("搜索时出错：");
                logdata_warn(e);
            }
            var moreinfo = ((nowline.album != "" && nowline.album != null) ? HTMLEncode("专辑：" + nowline.album) : "");
            // logdata()

            moreinfo += (moreinfo == "" ? "" : "<br/>") + ((releaseDate != "" && releaseDate != null) ? (HTMLEncode("发布日期：" + nowline.releaseDate)) : "")
            var jsons = { id: PID, songname: songname, singer: singer, pic: pic, artistid: artistid, vip: vip, hasMv: hasMv, mvid: mvid, moreinfo: moreinfo };
            var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(jsons)}</div>
            <div class="list-check">
                ${norpgsize * nowpg - norpgsize + i + 1}
            </div>
            <img class="list-img" src="${pic}" style="display:inline-block" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="downloadmusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div>
            </div>`
            finallyCode += code;
        }
        var lastpg = nowpg - 1;
        var nextpg = nowpg + 1;
        if (lastpg <= 0) lastpg = 1;
        if (nextpg > maxPG + 1) nextpg = maxPG + 1;
        var pageselcode = `<div class="pgid" onclick="search_turnto1(1);">
                        1
                    </div>
                    <div class="pgid" onclick="search_turnto1(${lastpg});">
                        &lt;
                    </div>
                    <div class="pgid" onclick="search_turnto1(document.getElementById('pginput1').value);">
                        To
                    </div>
                    <input id='pginput1' value="${nowpg}" />
                    <div class="pgid" onclick="search_turnto1(${nextpg});">
                        &gt;
                    </div>
                    <div class="pgid" onclick="search_turnto1(${maxPG + 1});">
                    ${maxPG + 1}
                    </div>`
        document.getElementById("pagesel1").innerHTML = pageselcode;

    } catch (e) {
        logdata_error(e);
        finallyCode = ("出现错误：" + e);
        // return;
    }

    if (finallyCode == "") {
        finallyCode = "<p>无搜索结果</p>";
    } else
        finallyCode += `<a onclick="search_turnto1(${lastpg});">&lt; 上一页</a> &nbsp; &nbsp; &nbsp;<a class="pgid" onclick="search_turnto1(${nextpg});"> 下一页 &gt;</a>`;
    // logdata(kwlist);
    // kwlist.data.list
    /*
    
    */

    document.getElementById("xfc_list").innerHTML = finallyCode;
    // parsesss = false;
}
function listAlarmKey3(data, d2) {
    var finallyCode = "";
    // logdata(data)
    try {

        // var flag = false;
        // var pic1 = data.data;
        nowpg = d2;
        var kwlist = data.data;
        showMsg("整理结果中...", "info");
        var pp = parseInt(kwlist.num);
        // logdata(pp, pp == null)
        // if (isNaN(pp) || pp == null || pp == 0) pp = parseInt(kwlist.songnum);
        // // logdata(pp,kwlist.songnum)
        var maxPG = (parseInt(pp / norpgsize) - 1);

        var lists = kwlist.musicList;
        for (var i = 0; i < lists.length; i++) {
            var nowline = lists[i];
            var PID = nowline.musicrid;
            PID = PID.replaceAll("MUSIC_", "");
            var songname = nowline.name;
            var singer = HTMLEncode(nowline.artist);
            var vipget = "";
            try {
                vipget = nowline['payInfo']['feeType']['vip'];
            } catch (e) {
                //Do nothing.
            }
            var vip = (vipget == "1");
            var hasMv = nowline.hasmv;
            // logdata(nowline.hasmv);
            var releaseDate = nowline.releaseDate;
            var pic = nowline.pic;
            if (pic == null || pic == "")
                pic = "./img/music.png";
            var artistid = nowline.artistid;
            var mvid = 0;
            if (hasMv == 1) {
                mvid = nowline.rid;
            }
            var downloaded = false;
            try {
                downloaded = LoveSongs['flag'][PID];
            } catch (e) {
                logdata("搜索时出错：");
                logdata_warn(e);
            }
            var moreinfo = ((nowline.album != "" && nowline.album != null) ? HTMLEncode("专辑：" + nowline.album) : "");
            // logdata()

            moreinfo += (moreinfo == "" ? "" : "<br/>") + ((releaseDate != "" && releaseDate != null) ? (HTMLEncode("发布日期：" + nowline.releaseDate)) : "")
            var jsons = { id: PID, songname: songname, singer: singer, pic: pic, artistid: artistid, vip: vip, hasMv: hasMv, mvid: mvid, moreinfo: moreinfo };
            var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(jsons)}</div>
            <div class="list-check">
                ${norpgsize * nowpg - norpgsize + i + 1}
            </div>
            <img class="list-img" src="${pic}" style="display:inline-block" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="downloadmusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div></div>
            </div>`
            finallyCode += code;
        }
        var lastpg = nowpg - 1;
        var nextpg = nowpg + 1;
        if (lastpg <= 0) lastpg = 1;
        if (nextpg > maxPG + 1) nextpg = maxPG + 1;
        var pageselcode = `<div class="pgid" onclick="turnPage_xfc2(1);">
                        1
                    </div>
                    <div class="pgid" onclick="turnPage_xfc2(${lastpg});">
                        &lt;
                    </div>
                    <div class="pgid" onclick="turnPage_xfc2(document.getElementById('pginput1').value);">
                        To
                    </div>
                    <input id='pginput1' value="${nowpg}" />
                    <div class="pgid" onclick="turnPage_xfc2(${nextpg});">
                        &gt;
                    </div>
                    <div class="pgid" onclick="turnPage_xfc2(${maxPG + 1});">
                    ${maxPG + 1}
                    </div>`
        document.getElementById("pagesel1").innerHTML = pageselcode;

    } catch (e) {
        logdata_error(e);
        finallyCode = ("出现错误：" + e);
        // return;
    }
    finallyCode += `<a onclick="turnPage_xfc2(${lastpg});">&lt; 上一页</a> &nbsp; &nbsp; &nbsp;<a class="pgid" onclick="turnPage_xfc2(${nextpg});"> 下一页 &gt;</a>`;
    if (finallyCode == "") {
        finallyCode = "<p>无搜索结果</p>";
    }
    // logdata(kwlist);
    // kwlist.data.list

    document.getElementById("xfc_list").innerHTML = finallyCode;
    // parsesss = false;
}
function NewopenUrl(URL) {
    logdata(URL)
}

function flushpic(data) {
    // logdata(data);
    AirLrc = false;
    try {
        flushLrcSetting();

        document.getElementById('watchvideo').pause();
        var jsont = data.data;
        var lryics = [];
        if (jsont != undefined)
            lryics = jsont['lrclist'];
        if (lryics == undefined) lryics = [];
        let lrc = JsonToLrc(lryics);
        createLrcObj(lrc);
        // logdata_ok("flushpic");

        if ((oLRC.hasTranslate && GOLBAL_mulitirow == 0 || GOLBAL_mulitirow == 1) && !hideMainLrcs) LRCmuliti_Temp(true);
        else ismulitirow = 0;
        // logdata(oLRC)
        lrcinit();
        var pic = jsont.songinfo.pic;
        if (pic == undefined) pic = "./img/unknown-record.png";
        var artist = jsont.songinfo.artist;
        var artistid = jsont.songinfo.artistId;
        var album = jsont.songinfo.album;
        var hasMv = jsont.songinfo.hasMv;
        var MvUrl = "";
        efftype = 0;
        // logdata()
        // logdata(hasMv)
        if (hasMv == 1 || hasMv == "1") {
            hasMv = true;
            MvUrl = MusicApis.mvplayUrl + jsont.songinfo.id;
            document.getElementById("mmvurl").innerHTML = "点击打开 (" + jsont.songinfo.id + ")";
            // document.getElementById("mmvurl").href = MvUrl;
            document.getElementById("mmvurl").setAttribute('mvid', jsont.songinfo.id);
            document.getElementById("mmvurl").onclick = () => {
                parseMv(document.getElementById("mmvurl"));
            };
            // getMv(jsont.songinfo.id);
        } else {
            document.getElementById("mmvurl").innerHTML = "无MV";
            document.getElementById("mmvurl").href = "";
            document.getElementById("mmvurl").setAttribute('mvid', "");
            document.getElementById("mmvurl").onclick = () => {
                return;
            };
        }
        //mshowalb
        var lidx = checkLanguage(jsont.songinfo.songName);
        if (languagename == null) languagename = "未知";
        var languagename = languageNameList[lidx];
        document.getElementById("languagename").innerText = languagename;
        document.getElementById("sinfoimg").src = pic;
        document.getElementById("mshowalb").innerText = album;
        document.getElementById("mshowalb").setAttribute("alid", jsont.songinfo.albumId);
        //albumId
        // showMsg("获取链接成功！", "ok");
        document.getElementById("ssongname").innerText = jsont.songinfo.songName;
        document.getElementById("ssingername").innerText = " - " + jsont.songinfo.artist;
        document.getElementById("minfoimg").src = pic;
        showMsg("获取链接成功！", "ok");
        document.getElementById("songname").innerText = jsont.songinfo.songName;
        document.getElementById("singername").innerText = " - " + artist;
        document.getElementById("mshowsinger").innerText = artist;
        document.getElementById("mshowsinger").setAttribute("singerid", artistid);
        var musicinfo = { id: jsont.songinfo.id, songname: jsont.songinfo.songName, singer: artist, pic: pic, artistid: artistid, vip: 0, hasMv: hasMv, mvid: jsont.songinfo.id };
        musicPlayingIndex = addMusicToList(musicinfo, musicPlayingIndex);
        mdownloadmusic.setAttribute("downloadname", `${artist} - ${jsont.songinfo.songName}.mp3`);
        mdownloadlrc.href = "data:text/plain;charset=utf-8," + encodeURIComponent(lrc);
        mdownloadlrc.setAttribute("download", `${artist} - ${jsont.songinfo.songName}.lrc`);
        if (program.getConfig("effect", true) == true) {
            flushEffectType(jsont.songinfo.songName);
        }
        // mshowurl.setAttribute("download") = `${artist} - ${jsont.songinfo.songName}.mp3`;
        mshowurl.setAttribute("download", `${artist} - ${jsont.songinfo.songName}.mp3`);


    } catch (e) {
        showMsg("出错：" + e, 'error');
    }
    try {
        if (GOLBAL_mulitirow == 1) ismulitirow = 1;
        reloadLrcStyle();
        // mplayer.setAttribute("autoplay","autoplay");
        if (fromUrl == true) {
            showMsg("音乐加载完毕，由于浏览器原因，将尝试在1s后播放。如不行，请请手动播放。", "warn");
            fromUrl = false;
            setTimeout(() => { mplayer.play(); }, 1000);
        } else {
            mplayer.play();
        }
    } catch (e) {
        logdata_warn(e);
    }
    musicidwaitplay = null;
    hideMusicLoading()

}
function flushpic1(data) {
    // logdata(data);
    AirLrc = false;

    try {
        flushLrcSetting();
        // logdata_ok("flushpic");

        document.getElementById('watchvideo').pause();
        var jsont = data.data;
        var lryics = [];
        if (jsont != undefined)
            lryics = jsont['lrclist'];
        if (lryics == undefined) lryics = [];
        let lrc = JsonToLrc(lryics);
        createLrcObj(lrc);

        if ((oLRC.hasTranslate && GOLBAL_mulitirow == 0 || GOLBAL_mulitirow == 1) && !hideMainLrcs) LRCmuliti_Temp(true);
        else ismulitirow = 0;
        // logdata(oLRC)
        lrcinit();
        var pic = jsont.songinfo.pic;
        if (pic == undefined) pic = "./img/unknown-record.png";
        var artist = jsont.songinfo.artist;
        var artistid = jsont.songinfo.artistId;
        var album = jsont.songinfo.album;
        var hasMv = jsont.songinfo.hasMv;
        var MvUrl = "";
        efftype = 0;
        // logdata()
        // logdata(hasMv)
        if (hasMv == 1 || hasMv == "1") {
            hasMv = true;
            MvUrl = MusicApis.mvplayUrl + jsont.songinfo.id;
            document.getElementById("mmvurl").innerHTML = "点击打开 (" + jsont.songinfo.id + ")";
            // document.getElementById("mmvurl").href = MvUrl;
            document.getElementById("mmvurl").setAttribute('mvid', jsont.songinfo.id);
            document.getElementById("mmvurl").onclick = () => {
                parseMv(document.getElementById("mmvurl"));
            };
            // getMv(jsont.songinfo.id);
        } else {
            document.getElementById("mmvurl").innerHTML = "无MV";
            document.getElementById("mmvurl").href = "";
            document.getElementById("mmvurl").setAttribute('mvid', "");
            document.getElementById("mmvurl").onclick = () => {
                return;
            };
        }
        //mshowalb
        var lidx = checkLanguage(jsont.songinfo.songName);
        var languagename = languageNameList[lidx];
        if (languagename == null) languagename = "未知";
        document.getElementById("languagename").innerText = languagename;

        document.getElementById("sinfoimg").src = pic;
        document.getElementById("mshowalb").innerText = album;
        document.getElementById("mshowalb").setAttribute("alid", jsont.songinfo.albumId);
        //albumId
        // showMsg("获取链接成功！", "ok");
        document.getElementById("ssongname").innerText = jsont.songinfo.songName;
        document.getElementById("ssingername").innerText = " - " + jsont.songinfo.artist;
        document.getElementById("minfoimg").src = pic;
        showMsg("获取链接成功！", "ok");
        document.getElementById("songname").innerText = jsont.songinfo.songName;
        document.getElementById("singername").innerText = " - " + artist;
        document.getElementById("mshowsinger").innerText = artist;
        document.getElementById("mshowsinger").setAttribute("singerid", artistid);
        mdownloadmusic.setAttribute("downloadname", `${artist} - ${jsont.songinfo.songName}.mp3`);
        mdownloadlrc.href = "data:text/plain;charset=utf-8," + encodeURIComponent(lrc);
        mdownloadlrc.setAttribute("download", `${artist} - ${jsont.songinfo.songName}.lrc`);
        mshowurl.setAttribute("download", `${artist} - ${jsont.songinfo.songName}.mp3`);

        if (program.getConfig("effect", true) == true) {
            flushEffectType(jsont.songinfo.songName);
        }

    } catch (e) {
        showMsg("出错：" + e, 'error');
    }
    try {
        if (GOLBAL_mulitirow == 1) ismulitirow = 1;
        reloadLrcStyle();
        // mplayer.setAttribute("autoplay","autoplay");
        if (fromUrl == true) {
            showMsg("音乐加载完毕，由于浏览器原因，将尝试在1s后播放。如不行，请请手动播放。", "warn");
            fromUrl = false;
            setTimeout(() => { mplayer.play(); }, 1000);
        } else {
            mplayer.play();
        }
    } catch (e) {
        logdata_warn(e);
    }
    musicidwaitplay = null;
    hideMusicLoading()
}

function parseMv(ele) {
    // logdata(ele);
    // logdata(ele.getAttribute("mvid"));
    watchMv(ele.getAttribute("mvid"))
}
function flushMv(data) {
    $('#watchvideo').show();
    document.getElementById('watchvideo').src = data;

    if (fromUrl == true) {
        showMsg("Mv 加载完毕，由于浏览器原因，请手动播放。", "warn");
        fromUrl = false
    } else {
        mplayer.pause();
        // logdata(data);

        document.getElementById('watchvideo').play();
    }

}
function watchMv(id) {
    hideme(document.getElementById("id_114514"))

    var urlpath = MusicApis.mv.replaceAll("${id}", id);
    // logdata(urlpath);
    location.hash = `#mvid=${encodeURIComponent(id)}`;
    NowPlayId = id;
    showPage(document.getElementById("mv"));

    fetchinfo(urlpath, {}, flushMv, null, 1);
}
function flushPicErr1() {
    if (musicidwaitplay == null) return;
    musicloadingtip1.innerHTML = "缓冲歌曲失败。";
    loadingmusicname.innerHTML = `<a href='#' onclick="retryFlushPic_1();">点击此处重试</a><br/>或者 <a href='#' onclick="closeMusicLoading();">点击此处关闭</a>`
    musicloadingtip2.innerHTML = "请尝试等待一些时间， ";
    musicloadingtip3.innerHTML = "";
}
function closeMusicLoading() {
    $("#music-loading").fadeOut(100);
}
function retryFlushPic_1() {
    var urlpath = MusicApis.songinfo.replaceAll("${id}", errid);
    // logdata(urlpath)
    fetchinfo(urlpath, {}, flushpic1, 0, 1, flushPicErr1);
}
function flushPicErr2() {
    if (musicidwaitplay == null) return;
    musicloadingtip1.innerHTML = "缓冲歌曲失败。";
    loadingmusicname.innerHTML = `<a href='#' onclick="retryFlushPic_2();">点击此处重试</a><br/>或者 <a href='#' onclick="closeMusicLoading();">点击此处关闭</a>`
    musicloadingtip2.innerHTML = "请尝试等待一些时间， ";
    musicloadingtip3.innerHTML = "";
}
function retryFlushPic_2() {
    var urlpath = MusicApis.songinfo.replaceAll("${id}", errid);
    // logdata(urlpath)
    // fetchinfo(urlpath, {}, flushpic);
    fetchinfo(urlpath, {}, flushpic, 0, 1, flushPicErr2);

}
function listensong1(data, id) {
    musicloadingtip1.innerHTML = "正在缓冲音乐歌词，请您稍微休息一会儿。";
    document.getElementById("ssongname").setAttribute("mid", id);
    mplayer.src = data;
    if (data == "") {
        showMsg("无法获得此歌曲的播放链接！", "error");
        return;
    }
    mshowurl.innerHTML = "【点击打开】";
    mshowurl.href = data;

    mdownloadmusic.setAttribute("musicurl", data);
    mdownloadmusic.setAttribute("downloadname", "歌曲名称加载中.mp3");
    mdownloadlrc.href = "data:text/plain;charset=utf-8,"
    mdownloadlrc.setAttribute("download", "歌曲歌词加载中.lrc");
    var urlpath = MusicApis.songinfo.replaceAll("${id}", id);
    errid = id;
    location.hash = `#musicid=${encodeURIComponent(id)}`;
    NowPlayId = id;
    // logdata(urlpath)
    fetchinfo(urlpath, {}, flushpic1, 0, 1, flushPicErr1);
    //logdata(data);
    // hideMusicLoading();
}

function listensong(data, id) {
    musicloadingtip1.innerHTML = "正在缓冲音乐歌词，请您稍微休息一会儿。";
    document.getElementById("ssongname").setAttribute("mid", id);
    mplayer.src = data;
    if (data == "") {
        showMsg("无法获得此歌曲的播放链接！", "error");
        return;
    }
    mshowurl.innerHTML = "【点击打开】";
    mshowurl.setAttribute("download", "歌名加载中.mp3");
    // mshowurl.href = data;
    mdownloadmusic.setAttribute("musicurl", data);

    mdownloadmusic.setAttribute("downloadname", "歌曲名称加载中.mp3");
    mdownloadlrc.href = "data:text/plain;charset=utf-8,"
    mdownloadlrc.setAttribute("download", "歌曲歌词加载中.lrc");
    mshowurl.href = data;
    var urlpath = MusicApis.songinfo.replaceAll("${id}", id);
    // logdata(urlpath)
    errid = id;
    location.hash = `#musicid=${encodeURIComponent(id)}`;
    NowPlayId = id;
    fetchinfo(urlpath, {}, flushpic, 0, 1, flushPicErr2);
    //logdata(data);
    // hideMusicLoading();
}
function downloadsong(url_, filename) {
    showMsg("正在下载文件请稍后...", "info");
    logdata("Http Request -> " + url_);
    logdata("Filename -> " + filename);
    var url = url_;
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('GET', url, true); // 异步
        xhr.responseType = 'blob'; // blob 类型
        xhr.onload = function () {
            if (xhr.status != 200) {
                showMsg(`下载失败！请手动打开歌曲链接保存。(Return Code: ${xhr.status})`, "error");
                return;
            }
            if (xhr.status == 200) {
                var newUrl = window.URL.createObjectURL(xhr.response);
                var a = document.createElement('a');
                a.setAttribute('href', newUrl);
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename); // 自定义文件名（有效）
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showMsg("已唤起浏览器下载，若无法下载请手动打开歌曲链接保存。", "ok");
            }


        };
        xhr.onerror = function (ev) {
            showMsg("下载失败！请手动打开歌曲链接保存。", "error");
            logdata_error(ev);
        }
    } catch (e) {
        showMsg("下载失败！请手动打开歌曲链接保存。(Error: " + e.message + ")", "error");
        logdata_error(e);
    }

    xhr.send();
}
function copyurl() {
    try {
        navigator.clipboard.writeText("【Bamboo Music】\n" + document.getElementById("sharename").innerText + "\n播放地址：" + document.getElementById("shareurl").innerText);
        showMsg("已将文本复制到剪辑版", "ok");
    } catch (e) {
        showMsg("无法复制。请手动选择复制。或在网页设置中允许剪贴板权限。", "error");
    }
}
function flushLike() {
    /*
    迁移
    */
    var OldLikes = program.getConfig("likes");
    if (OldLikes != null) {
        LoveSongs['songs'] = OldLikes;
        delete _SETTING['likes'];
        saveConfig();
        showMsg("发现旧版数据，迁移完毕。", "ok")
    }
    var likes = LoveSongs['songs'];
    if (likes == null) likes = [];
    var res = "";
    for (var i in likes) {
        try {

            var PID = likes[i].id;
            var artistid = likes[i].artistid;
            var pic = likes[i].pic;
            var songname = likes[i].songname;
            var vip = likes[i].vip;
            var downloaded = false;
            try {
                downloaded = LoveSongs['flag'][PID];
            } catch (e) {
                logdata("搜索时出错：");
                logdata_warn(e);
            }
            var hasMv = likes[i].hasMv;
            var mvid = likes[i].mvid;
            var singer = likes[i].singer;
            var moreinfo = likes[i].moreinfo;
            if (pic == undefined) pic = "./img/unknown-record.png";
            var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(likes[i])}</div>
            <div class="list-check">
                <input onclick="setItemColorFromCheckbox(this);" class="list-checkbox" type="checkbox" />
            </div>
            <img class="list-img" src="${pic}" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="downloadmusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div></div>
            </div>`
            res += code;
        } catch (e) {
            logdata_warn(e);
        }

    }
    if (res === "") res = "<p>暂无收藏</p>"
    document.getElementById("mlistbar").innerHTML = res;
}
function listsong(data) {
    var finallyCode = "";
    // logdata(data)
    try {
        var kwlist = data.data;
        showMsg("整理结果中...", "info");
        if (kwlist != null || kwlist != undefined) {
            var maxPG = (parseInt(parseInt(kwlist.total) / norpgsize));
            var lists = kwlist.list;
            for (var i = 0; i < lists.length; i++) {
                var nowline = lists[i];
                var PID = nowline.musicrid.toString();
                PID = PID.substr("MUSIC_".length);
                var songname = nowline.name;
                var singer = HTMLEncode(nowline.artist);
                var vipget = "";
                try {
                    vipget = nowline['payInfo']['feeType']['vip'];
                } catch (e) {
                    //Do nothing.
                }
                var vip = (vipget == "1");
                var hasMv = nowline.hasmv;
                // logdata(nowline.hasmv);
                var releaseDate = nowline.releaseDate;
                var pic = nowline.pic;
                var artistid = nowline.artistid;
                var mvid = 0;
                if (hasMv == 1) {
                    mvid = nowline.rid;
                }
                var downloaded = false;
                try {
                    downloaded = LoveSongs['flag'][PID];
                } catch (e) {
                    logdata("搜索时出错：");
                    logdata_warn(e);
                }
                var moreinfo = ((nowline.album != "" && nowline.album != null) ? HTMLEncode("专辑：" + nowline.album) : "");
                // logdata()
                if (pic == undefined) pic = "./img/unknown-record.png";

                moreinfo += (moreinfo == "" ? "" : "<br/>") + ((releaseDate != "" && releaseDate != null) ? (HTMLEncode("发布日期：" + nowline.releaseDate)) : "")
                var jsons = { id: PID, songname: songname, singer: singer, pic: pic, artistid: artistid, vip: vip, hasMv: hasMv, mvid: mvid, moreinfo: moreinfo };
                var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(jsons)}</div>
            <div class="list-check">
                <input onclick="setItemColorFromCheckbox(this);" class="list-checkbox" type="checkbox" />
            </div>
            <img class="list-img" src="${pic}" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="downloadmusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div></div>
            </div>`
                finallyCode += code;
            }
            var lastpg = nowpg - 1;
            var nextpg = nowpg + 1;
            if (lastpg <= 0) lastpg = 1;
            if (nextpg > maxPG + 1) nextpg = maxPG + 1;
            var pageselcode = `<div class="pgid" onclick="search_turnto(1);">
                        1
                    </div>
                    <div class="pgid" onclick="search_turnto(${lastpg});">
                        &lt;
                    </div>
                    <div class="pgid" onclick="search_turnto(document.getElementById('pginput').value);">
                        To
                    </div>
                    <input id='pginput' value="${nowpg}" />
                    <div class="pgid" onclick="search_turnto(${nextpg});">
                        &gt;
                    </div>
                    <div class="pgid" onclick="search_turnto(${maxPG + 1});">
                    ${maxPG + 1}
                    </div>`
            document.getElementById("pagesel").innerHTML = pageselcode;
        } else {
            var pageselcode = `<div class="pgid" onclick="search_turnto(1);">
                        1
                    </div>
                    <div class="pgid" onclick="search_turnto(${1});">
                        &lt;
                    </div>
                    <div class="pgid" onclick="search_turnto(document.getElementById('pginput').value);">
                        To
                    </div>
                    <input id='pginput' value="${1}" />
                    <div class="pgid" onclick="search_turnto(${1});">
                        &gt;
                    </div>
                    <div class="pgid" onclick="search_turnto(${1});">
                    ${1}
                    </div>`
            document.getElementById("pagesel").innerHTML = pageselcode;
            finallyCode = `<div class="no-song-found center-title"><h1>无法找到歌曲</h1><br/><a onclick="searchSongs(document.getElementById('searchBox').value);">点击此处重试</a></div>`;
        }

    } catch (e) {
        logdata_error(e);
        showMsg("出现错误：" + e, "error");
        finallyCode = "出现错误：" + e;

        // return;
    }

    if (finallyCode == "") {
        finallyCode = `<div class="no-song-found center-title"><h1>暂无搜索结果</h1><br/><a onclick="searchSongs(document.getElementById('searchBox').value);">点击此处重试</a></div>`;
    }
    // logdata(kwlist);
    // kwlist.data.list

    document.getElementById("listbar").innerHTML = finallyCode;
    parsesss = false;
    showMsg("搜索完毕。", "ok");
}

function reflushMain() {
    // 播放列表
    let urlpath = encodeURI_special(MusicApis.kwplaylist);
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listMainKey);
    urlpath = encodeURI_special(MusicApis.hottopsong); //排行榜
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listMainBangKey);

    // openalarmbyid();
}

function reflushkeyHelp(value) {
    let val = value;
    // $("#autoinfo").hide();
    // console.log(val)
    if (val.substring(0, "http://".length) == 'http://') {
        var text = val.substring(val.lastIndexOf('/') + 1);
        var id = getQueryString(text, "musicid");
        // console.log(id);
        if (id == null)
            id = text;
        // playmusicbyid(id);
        // logdata(id);
        var tmp = `<li onclick=\"searchSongs(document.getElementById('searchBox').value);\"><span><b>歌曲ID</b> [${id}]</span></li>`
        // if (tmp === "") tmp = "<li>暂无搜索建议</li>"
        fillinfo.innerHTML = tmp;
        $("#autoinfo").css("display", "inline-block");
        return;
    }
    else if (val.substr(0, "https://".length) == 'https://') {
        var id = val.substr(val.lastIndexOf('/') + 1);
        // logdata(id);
        // playmusicbyid(id);
        var tmp = `<li onclick=\"searchSongs(document.getElementById('searchBox').value);\"><span><b>歌曲ID</b> [${id}]</span></li>`
        // if (tmp === "") tmp = "<li>暂无搜索建议</li>"
        fillinfo.innerHTML = tmp;
        $("#autoinfo").css("display", "inline-block");
        return;

    } else if (val.substr(0, '#*'.length) == '#*') {
        // var id;
        var id = val.substr('#*'.length);
        var tmp = `<li onclick=\"searchSongs(document.getElementById('searchBox').value);\"><span><b>歌曲ID</b> [${id}]</span></li>`
        // if (tmp === "") tmp = "<li>暂无搜索建议</li>"
        fillinfo.innerHTML = tmp;
        $("#autoinfo").css("display", "inline-block");
        // playmusicbyid(id);

        return;
    }
    let urlpath = encodeURI_special(MusicApis.searchHelpKey.replaceAll("${value}", value));
    fetchinfo(urlpath, { csrf: TOKEN_CSRF, referer: MusicApis.root, cookie: "kw_token=" + TOKEN_CSRF + "" }, listHelpKeys, null, 3);
}
function randomSong() {
    let url = MusicApis['randomSong'];
    if (url == undefined) return;
    fetchinfo(url, {}, randomSong_Play);
}
function randomSong_Play() {

}
function listMainKey(data) {

    try {
        var dat = data;
        // logdata(dat)
        //     <div class="list-song" pid="-1"><div class="musicinfo"></div><div class="list-check">
        //     ${1}
        // </div><img class="list-img"src="./img/unknown-record.png"/><div class="list-info"><span class="list-name"onclick="randomSong();">${disname}</span><br/>随机播放</div><div class="list-control"><button class="li-play imgbutton"onclick="randomSong();"></button></div></div></div>
        var ress = dat.data.list;
        var code = ``;
        var number = 0;
        for (var res in ress) {
            try {
                number++;
                var disname = (ress[res].name);
                var id = (ress[res].id);
                var uid = (ress[res].uname);
                var pic = (ress[res].img);
                if (pic == null || pic == "") {
                    pic = "./img/unknown-record.png"
                }
                code += `<div class="list-song" pid="${id}"><div class="musicinfo"></div><div class="list-check">
                ${number}
            </div><img class="list-img"src="${pic}"/><div class="list-info"><span class="list-name"onclick="openalarmbyid('${id}','${disname.replaceAll("\\", "\\\\")}');">${disname}</span><br/>收集用户：${uid}</div><div class="list-control"><button class="li-play imgbutton"onclick="openalarmbyid('${id}','${disname}');"></button></div></div></div>`
            } catch (e) {
                logdata(e);
                code = `<p>无法获取列表：${e}</p>`

            }
            // logdata(res);
        }
    } catch (e) {
        logdata_warn(e);
        code = `<p>无法获取列表：${e}</p>`

    }

    if (code == ``) {
        code = `<p>无法获取列表：连接失败。</p>`
    }
    document.getElementById("hotsongs").innerHTML = code;
}
function listMainBangKey(data) {

    try {
        var number = 0;
        var dat = data;
        // logdata(dat)
        var ress = dat.data.musicList;
        var finallyCode = ``;
        for (var res in ress) {
            try {
                number++;
                var nowline = ress[res];
                // var nowline = lists[i];
                var PID = nowline.rid.toString();
                // PID = PID.substr("MUSIC_".length);
                var songname = nowline.name;
                var singer = HTMLEncode(nowline.artist);
                var vipget = "";
                try {
                    vipget = nowline['payInfo']['feeType']['vip'];
                } catch (e) {
                    //Do nothing.
                }
                var vip = (vipget == "1");
                var hasMv = nowline.hasmv;
                // logdata(nowline.hasmv);
                var releaseDate = nowline.releaseDate;
                var pic = nowline.pic;
                var artistid = nowline.artistid;
                var mvid = 0;
                if (hasMv == 1) {
                    mvid = nowline.rid;
                }
                var downloaded = false;
                try {
                    downloaded = LoveSongs['flag'][PID];
                } catch (e) {
                    logdata("搜索时出错：");
                    logdata_warn(e);
                }
                var moreinfo = ((nowline.album != "" && nowline.album != null) ? HTMLEncode("专辑：" + nowline.album) : "");
                // logdata()

                moreinfo += (moreinfo == "" ? "" : "<br/>") + ((releaseDate != "" && releaseDate != null) ? (HTMLEncode("发布日期：" + nowline.releaseDate)) : "")
                var jsons = { id: PID, songname: songname, singer: singer, pic: pic, artistid: artistid, vip: vip, hasMv: hasMv, mvid: mvid, moreinfo: moreinfo };
                var code = `<div class="list-song" singerid="${artistid}" pid="${PID}">
            <div style="" class="musicinfo">${JSON.stringify(jsons)}</div>
            <div class="list-check">
                ${number}
            </div>
            <img class="list-img" src="${pic}" />
            <div class="list-info">
                <span class="list-name" onclick="playmusicbyid('${PID}');">歌名：${songname}</span>
                ${vip ? `<span class="list-V">MNF</span>` : ""}
                ${downloaded ? `<span class="list-D">已收藏</span>` : ""}
                ${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}
                <br/>
                <span class='list-singer'>歌手：${singer}</span><br /><span class='list-otherinfo'>${moreinfo}</span></div><div class="list-control"><button class="li-like imgbutton" onclick="likemusic(this);"></button><button class="li-download imgbutton" onclick="sharemusic(this);"></button><button class="li-play imgbutton" onclick="playmusic(this);"></button></div></div>
            </div>`

            } catch (e) {
                logdata(e);
                code = `<p>无法获取列表：${e}</p>`

            }
            // logdata(res);
            finallyCode += code;

        }
    } catch (e) {
        logdata_warn(e);
        finallyCode = `<p>无法获取列表：${e}</p>`

    }

    if (finallyCode == ``) {
        finallyCode = `<p>无法获取列表：连接失败。</p>`
    }
    document.getElementById("topbang").innerHTML = finallyCode;
}
function listHelpKeys(data) {
    var dat = data.data;
    var tmp = "";
    for (var i = 0; i < dat.length; i++) {
        if (dat[i].toString().substr(0, "RELWORD=".length) === "RELWORD=") {
            var in1 = "RELWORD=".length;
            var in2 = dat[i].search("\r\n");
            var text = dat[i].substr(in1, in2 - in1);
            // <li onclick="autofill('How far i\'ll go')">How Far I'll Go</li>
            tmp += "<li onclick=\"autofill('" + text.replaceAll("'", "\\'").replaceAll("\"", "\\\"") + "')\"><span>" + text + "</span></li>"
            //logdata(text)
        } else {
            tmp += "<li onclick=\"autofill('" + dat[i].replaceAll("'", "\\'").replaceAll("\"", "\\\"") + "')\"><span>" + dat[i] + "</span></li>"
        }
    }
    if (tmp === "") tmp = "<li>暂无搜索建议</li>"
    fillinfo.innerHTML = tmp;
    $("#autoinfo").css("display", "inline-block");
}
var lasterr = "";
function showPage(whom) {
    if (whom == undefined) {
        location.hash = "#"; return;
    }
    if (whom.id == 'main') {
        location.hash = "#page=" + encodeURIComponent(whom.id);
        flushLrcSetting();
    }
    if (whom.id == 'setting') {
        location.hash = "#page=" + encodeURIComponent(whom.id);
        flushLrcSetting();
    }
    else if (whom.id == "music") {
        reflushCanvas();
        location.hash = "#musicid=" + encodeURIComponent(NowPlayId);

    } else if (whom.id == 'mv') {
        location.hash = "#mvid=" + encodeURIComponent(NowPlayId);

    }
    else if (whom.id == 'mylove') {
        location.hash = "#page=" + encodeURIComponent(whom.id);
        flushLike();
    }
    var eles = document.getElementsByClassName("barlist-hover");
    for (var i = 0; i < eles.length; i++) {
        eles[i].classList.remove("barlist-hover");
    }
    whom.classList.add("barlist-hover");
    document.getElementById('selectBar').style.top = whom.getBoundingClientRect().top + "px";
    // document.getElementById('selectBar').style.top = whom.offsetTop + "px";
    try {
        var eles = document.getElementsByClassName("page");
        for (var i = 0; i < eles.length; i++) {
            if (DisabledAnimation) {
                $(eles[i]).hide();

            } else {
                $(eles[i]).fadeOut(200);

            }
        }
        if (DisabledAnimation) {
            $(document.getElementById("p" + whom.id)).fadeIn(0);
        } else {
            setTimeout(() => { $(document.getElementById("p" + whom.id)).fadeIn(200) }, 250);
        }

        // logdata(whom.id);

    } catch (e) {
        logdata_error(e);
        lasterr = e;
        document.getElementById("errorPage").style.display = "inline-block";
        // document.getElementById("showerror").style.display = "inline-block";
        // document.getElementById("errormsg").style.display = "none";
    }
};
function showError(ele) {
    ele.style.display = "none";
    // document.getElementById("errormsg").style.display = "inline-block";
    // document.getElementById("errormsg").innerHTML = lasterr;
}
function delEle_A(ele) {
    // logdata(ele);
    $("#" + ele).fadeOut(200);
    setTimeout(`delEle(document.getElementById('${ele}'))`, 200)
}
function delEle(ele) {
    ele.remove();
}
function cancelTask(btn, eleID) {
    btn.classList.remove("btn-cancel")
    btn.classList.add("btn-clear")
    btn.onclick = () => {
        delEle_A((eleID));
    }
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].deleted) {
            continue;
        } else if (taskArr[i].taskId == eleID) {
            // logdata(taskArr[i].type , taskArr[i].waitStart);
            if (taskArr[i].taskType == "download" && taskArr[i].waitStart != true)
                taskArr[i].dlfiler.cancel();
            else if (taskArr[i].taskType == "download" && taskArr[i].waitStart == true) {
                taskArr[i].rename("" + taskArr[i].DisplayName + " 取消下载。");
                showMsg(taskArr[i].DisplayName + "取消下载。", "info");
                taskArr[i].finished();
                taskArr[i].deleted = true;
            } else {
                taskArr[i].rename("" + taskArr[i].DisplayName + " 取消任务。");
                showMsg(taskArr[i].DisplayName + "取消任务。", "info");
                taskArr[i].finished();
                // taskArr[i].deleted = true;
            }
            taskArr[i].deleted = true;
            return;
        }
    }
}
var Rid = 0;
var taskArr = new Array(0);
function dlFile(DisplayName, URL, savePath, afterFunc, downloadNow) {
    var idx = newtask("" + DisplayName + " - 等待下载中...", "download", afterFunc);
    taskArr[idx].DisplayName = DisplayName;
    var downoader = new downloader(URL, savePath, taskArr[idx].downloadParse);
    if (downloadNow == null) downloadNow = false;
    if (downloadNow == true)
        downoader.startDownload();
    taskArr[idx].dlfiler = downoader;
    taskArr[idx].waitStart = !downloadNow;
}
function newtaskEx(taskName, taskId, taskType, atfirst, afterFunc) {
    taskArr[taskArr.length] = new task(taskName, taskId, taskType, atfirst, afterFunc);
    return taskArr.length - 1;
}
function newtask(taskName, taskType, afterFunc) {
    taskArr[taskArr.length] = new task(taskName, null, taskType, false, afterFunc);
    return taskArr.length - 1;
}
var maxDownload = 4;
// var count = 0;
// var downT = setInterval(() => {
//     count = 0;
//     var l = 0;
//     for (var i = 0; i < taskArr.length; i++) {
//         if (taskArr[i - l].deleted) {
//             taskArr.splice(i - l, 1);
//             l++;
//             continue;
//         }
//         if (taskArr[i - l].waitStart == false) count++;
//         taskArr[i - l].update();
//     }
//     if (count < maxDownload && count != taskArr.length) {
//         var l = 0;
//         for (var i = 0; i < taskArr.length; i++) {
//             if (count >= maxDownload) breaklang;
//             if (taskArr[i - l].deleted) {
//                 continue;
//             } else if (taskArr[i - l].waitStart && taskArr[i - l].taskType === "download") {
//                 taskArr[i - l].waitStart = false;
//                 taskArr[i - l].rename("" + taskArr[i - l].DisplayName + " - 正在获取响应");
//                 taskArr[i - l].dlfiler.startDownload();
//                 count++;
//             }
//         }
//     }
// }, 200);
var msgID = 0;
function showMsg(val, type, donot = false) { //Type: info error warn ok
    msgID++;
    var pid = `msg-${msgID + "-" + Math.round(Math.random() * 60 + 2)}`;
    var icontext = "信息";
    if (type == 'warn') icontext = '警告';
    if (type == 'error') icontext = '错误';
    if (type == 'ok') icontext = '通过';
    var VVal = val;
    if (!donot) VVal = VVal.toString().replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;");
    var elcode = `<div id="${pid}" class="messages message${type}" style="display:none;"><span class="messages-icon">${icontext}</span><span class="messages-text">${VVal}</span></div>`;
    var msgBody = document.getElementById("messagebox");
    msgBody.innerHTML = elcode;
    if (type == 'info') {
        console.log('%c 信息 %c ' + val + '\n', 'color: #fff; background: #030307; padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
        logdata(val);
    } else if (type == 'warn') {
        logdata_warn(val);
        console.log('%c 警告 %c ' + val + '\n', 'color: #fff; background: rgb(240, 237, 93); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    } else if (type == 'error') {
        logdata_error(val);
        console.log('%c 错误 %c ' + val + '\n', 'color: #fff; background: rgb(236, 62, 62); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    } else if (type == 'ok') {
        logdata_ok(val);
        console.log('%c 通过 %c ' + val + '\n', 'color: #fff; background: rgb(37, 196, 16); padding:5px 0; margin-top: 1em;', 'background: #efefef; color: #333; padding:5px 0;');
    }
    setTimeout(`delMsg('${pid}');`, 5000);

    $("#" + pid).fadeIn(300);
    // console.log("#" + pid)
}
function startsearching() {
    showPage(document.getElementById("search"));
    document.getElementById("searchBox").focus();
}
function removeMsg(pid) {
    var ele = document.getElementById(pid);
    try {
        ele.remove();

    } catch (e) {
        logdata_warn(e);
    }
}
function delMsg(pid) {
    // var msgBody = document.getElementById("messagebox");

    var ele = document.getElementById(pid);
    // logdata("->",pid,ele);
    if (ele != null) {
        // logdata("!!!",pid);
        $("#" + pid).fadeOut();
        setTimeout(`removeMsg('${pid}')`, 500);
    }
}
function task(taskName, taskId, taskType, atfirst, afterFunc) {
    this.taskId = taskId;
    this.taskType = taskType;
    this.percent = -1;
    this.deleted = false;
    this.afterFunc = afterFunc;
    this.DisplayName = "";//For 'download' type;
    this.dlfiler = null;
    this.waitStart = true;
    if (this.taskId == null) {
        this.taskId = "Task-" + Rid++;
    }
    this.renameEx = (name, des) => {
        document.getElementById(this.taskId).getElementsByClassName("taskname")[0].innerHTML = name;

    }
    this.redes = (des) => {
        // document.getElementById(this.taskId).getElementsByClassName("taskname")[0].innerHTML = name;
        document.getElementById(this.taskId).getElementsByClassName("taskdes")[0].innerHTML = des;
    }
    this.rename = (name) => {
        document.getElementById(this.taskId).getElementsByClassName("taskname")[0].innerHTML = name;
        // document.getElementById(this.taskId).getElementsByClassName("taskdes")[0].innerHTML = des;
    }
    this.taskName = taskName;
    var content = `<div class='tasks ${this.taskType}' id="${this.taskId}"><div onclick="cancelTask(this,'${this.taskId}')" class="btn-cancel imgbutton cancel"></div>
                            <span class="taskname">${this.taskName}</span><span class="taskdes"> </span>
                            <div class="progress">
                                <div class="done"></div>
                            </div>
                    </div>`

    var taskslist = document.getElementById("tasklist");
    if (atfirst == true) {
        taskslist.innerHTML = content + taskslist.innerHTML;
    } else {
        taskslist.innerHTML = content + taskslist.innerHTML;
    }

    this.downloadParse = (val) => {
        if (this.deleted) return;
        if (val.state == 'failed') {
            this.finished();
            this.rename("" + this.DisplayName + " 下载失败！");
            showMsg(this.DisplayName + " 下载失败！", "error")
            this.redes("原因：" + val.msg.toString());
            return;
        }
        if (val.state == 'started') {
            this.rename("开始下载 " + this.DisplayName + " ...")
        }
        if (val.state == 'doing') {
            this.rename("下载 " + this.DisplayName + " 中...")
            this.percent = val.progress.percentage;
        }
        if (val.state == "done") {
            this.rename("" + this.DisplayName + " 下载完成！", "ok");
            showMsg(this.DisplayName + "下载完成！", "ok");
            setTimeout(() => {
                this.finished();
            }, 500);
        }
        if (val.state == "cancel") {
            this.rename("" + this.DisplayName + " 取消下载。");
            showMsg(this.DisplayName + "取消下载。", "info");
            this.finished();
        }
    }
    this.update = () => {
        if (this.percent == -1) {
            document.getElementById(this.taskId).getElementsByClassName("done")[0].classList.add("done-loading")
        } else {
            document.getElementById(this.taskId).getElementsByClassName("done")[0].classList.remove("done-loading")

            document.getElementById(this.taskId).getElementsByClassName("done")[0].style.width = "calc(" + this.percent + "% - 0px";
        }
    }
    this.removeFromBar = () => {
        document.getElementById(this.taskId).getElementsByClassName("progress")[0].style.display = "none";
        document.getElementById(this.taskId).classList.add("taskdone");
        this.deleted = true;

    }
    this.finished = () => {
        this.removeFromBar();
        this.afterFunc();
    }
}
function autofill(value) {
    document.getElementById("searchBox").value = value;
    $("#autoinfo").hide();
    searchSongs(value, 1, 30);
}
function clearAllTask() {
    var eles = document.getElementsByClassName("btn-clear");
    for (var i = 0; i < eles.length; i++) {
        eles[i].onclick();
    }
}
function cancelAllTask() {
    var eles = document.getElementsByClassName("btn-cancel");
    while (eles.length != 0) {
        eles = document.getElementsByClassName("btn-cancel");
        // logdata(eles.length);
        for (var i = 0; i < eles.length; i++) {
            eles[i].onclick();
        }
    }

}
function setItemColorFromCheckbox(ele) {
    // var a = document.getElementById();
    // a.classList.add
    var sel = ele.checked;
    if (sel)
        ele.parentNode.parentNode.classList.add("l-checked");
    else
        ele.parentNode.parentNode.classList.remove("l-checked");
    // .add("l-checked");
}
function setItemColorFromBox(ele) {
    var sel = ele.classList.contains("l-checked");
    if (!sel) {
        ele.classList.add("l-checked");
        ele.getElementsByClassName("list-checkbox").checked = true;
    }
    else {
        ele.classList.remove("l-checked");
        ele.getElementsByClassName("list-checkbox").checked = false;

    }
}
function setItemColor(ele, sel) {
    if (sel)
        ele.classList.add("l-checked");
    else
        ele.classList.remove("l-checked");
}

function re(dat) {
    // logdata(dat);
    if (dat.file != undefined)
        document.getElementById("savedir").value = dat.file;
    program.setConfig("savePath", document.getElementById("savedir").value);
}
const links = document.querySelectorAll('a[href]');
links.forEach(link => {
    link.addEventListener('click', e => {
        var url = link.getAttribute('href');
        if (url == null || url == '#' || url == '') {
            e.preventDefault();
        }
    });
});
var effect = document.getElementById("effect");
function random(min, max) {
    return Math.random() * (max - min) + min;
}
// var mousePosOfCanvas = { x: 0, y: 0 };
// musiclrcshow.onmousemove = (evt) => {
//     if (!mplayer.paused && efftype != 0) {
//         var x = evt.clientX;
//         var y = evt.clientY;
//         var rect = canvas.getBoundingClientRect();
//         x -= rect.left;
//         y -= rect.top;
//         mousePosOfCanvas.x = x, mousePosOfCanvas.y = y;
//     }
// }
function dropitem(way, dx, dy, width, height) {
    // this.startX = random(0, canvas.width);
    this.way = way;
    if (way == 0) {
        //up to down
        this.x = random(0, canvas.width - width);
        this.y = -height;
    } else if (way == 1) {
        //down to up
        this.x = random(0, canvas.width - width);
        this.y = canvas.height;
    } else {
        logdata_warn("无效的参数！");
        // return;
        this.x = 0;
        this.y = 0;
        this.way = 0;
    }

    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.type = efftype;
    this.delected = false;
    if (efftype == 0)
        this.deleted = true;
    this.randomPic = 0;
    if (efftype == 5)
        this.randomPic = parseInt(random(0, picFlower.length));
    this.update = () => {
        this.x += this.dx;
        this.y += this.dy;
        if (this.way == 0) {
            if (this.y >= canvas.height) {
                this.deleted = true;
            }
        } else {
            if (this.y <= - this.height) {
                this.deleted = true;
            }
        }
    }
    this.draw = () => {
        if (this.type == 1)//0: none, 1:snow, 2:christmas, 3:rain
            ctx.drawImage(picSnow, this.x, this.y, this.width, this.height);
        else if (this.type == 2)//0: none, 1:snow, 2:christmas, 3:rain
            ctx.drawImage(picChristmas, this.x, this.y, this.width, this.height);
        else if (this.type == 3)//0: none, 1:snow, 2:christmas, 3:rain
            ctx.drawImage(picRain, this.x, this.y, this.width, this.height);
        else if (this.type == 4)//0: none, 1:snow, 2:christmas, 3:rain
            ctx.drawImage(picAi, this.x, this.y, this.width, this.height);
        else if (this.type == 5)//0: none, 1:snow, 2:christmas, 3:rain
            ctx.drawImage(picFlower[this.randomPic], this.x, this.y, this.width, this.height);
    }
}
var dItem = new Array(0);
var efftype = 0;//0: none, 1:snow, 2:christmas, 3:rain
var waitT = 0;
// var nextWait
var specialEffect = setInterval(() => {
    // if(dItem.length == 0 && mplayer.paused) return;
    if (!mplayer.paused && efftype != 0) {
        waitT--;
        if (waitT <= 0) {
            waitT = random(50, 120);
            if (efftype != 1 && efftype != 5) dItem[dItem.length] = new dropitem(0, 0, random(0.2, 0.8), 8, 8);
            else dItem[dItem.length] = new dropitem(0, 0, random(0.2, 0.8), 16, 16);
        }
    }
    for (var i in dItem) {
        dItem[i].update();
    }
    delEff();
    if (dItem.length > 0) {
        paintEff();
    }
}, 10);
function displaySth(ele) {
    ele.style.left = "100%";
    ele.style.display = "inline-block";
    setTimeout(`document.getElementById("${ele.id}").style.left = "0";`, 1);

}
function indisplayme(ele) {
    ele.style.display = "none";
}
function hideme(ele) {
    setTimeout(`indisplayme(document.getElementById("${ele.id}"))`, 200);
    ele.style.left = "100%";
}
function delEff() {
    var l = 0;
    for (var i = 0; i + l < dItem.length; i++) {
        if (dItem[i + l].deleted) {
            dItem.splice(i + l, 1);
            l++;
        }
    }
}
function paintEff() {
    // ctx.clearRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i in dItem) {
        if (!dItem.deleted)
            dItem[i].draw();
    }
}
function reflushCanvas() {
    canvas.width = effect.offsetWidth;
    canvas.height = effect.offsetHeight;
    paintEff();
}
window.onresize = function () {
    reflushCanvas();
    windowsResize();
}
function windowsonload() {
    windowsResize();
    reloadUserCSS();

    init();
    if (program.getConfig("daily", true) == true)
        reflushMain();
    else {
        document.getElementById("topbang").innerHTML = "已在设置中关闭自动排行榜显示。<a href='#' onclick='reflushMain();'>点击此处手动显示</a>";
        document.getElementById("hotsongs").innerHTML = "已在设置中关闭自动推荐歌曲显示。<a href='#' onclick='reflushMain();'>点击此处手动显示</a>";

    }
}
var TOKEN_CSRF = "114514";
function HideLoadingPane() {
    setTimeout(() => {
        $("#pre-loadding").fadeOut(300);
    });
}
var DisabledAnimation = true;
window.onload = () => {
    changeSource(program.getConfig("source", 0));
    DisabledAnimation = program.getConfig("DisabledAnimation", IsAppleStore());
    specLrc = program.getConfig("specLrcStyle", 2);
    specLrcStyle(specLrc);
    //hideMainLrcs
    hideMainLrcs = program.getConfig("hideMainLrc", false);
    hideMainLrc(hideMainLrcs);
    DisabledAnimationLrc = program.getConfig("DisabledAnimationLrc", IsAppleStore());
    TOKEN_CSRF = program.getConfig("csrf", undefined);
    if (TOKEN_CSRF == undefined) {
        try {
            console.log(data);
            windowsonload();
            TOKEN_CSRF = data;
            HideLoadingPane()

        } catch (e) {
            windowsonload();
            logdata_error(e);
            TOKEN_CSRF = "114514";
            HideLoadingPane()
        }
    } else {
        HideLoadingPane()
    }
}
function flushEffectType(text) {
    var tt = text.toString().toLowerCase();
    // logdata(tt);
    for (var i = 0; i < keywords.length; i++) {
        for (var j = 0; j < keywords[i].length; j++) {
            // logdata(tt, "->", keywords[i][j]);

            if (tt.search(keywords[i][j]) != -1) {
                efftype = i + 1;
                return;
            }
        }
    }
    efftype = 0;
}
var mvid = "";
var musicid = "";
function addmusictolist_info(id, location = -1) {
    var urlpath = MusicApis.songinfo.replaceAll('${id}', id);
    // logdata(urlpath)
    fetchinfo(urlpath, {}, getmusicinfo, location);
}
function getmusicinfo(data, location) {
    try {
        var jsont = data.data;
        var pic = jsont.songinfo.pic;
        if (pic == undefined) pic = "./img/unknown-record.png";
        var artist = jsont.songinfo.artist;
        var artistid = jsont.songinfo.artistId;
        var album = jsont.songinfo.album;
        var hasMv = jsont.songinfo.hasMv;
        var musicinfo = { id: jsont.songinfo.id, songname: jsont.songinfo.songName, singer: artist, pic: pic, artistid: artistid, vip: 0, hasMv: hasMv, mvid: jsont.songinfo.id };
        addMusicToList(musicinfo, location, true);

    } catch (e) {
        logdata_error(e);
    }
    // console.log("GOODJOB",fromUrl);
    if (fromUrl) {
        setTimeout(() => { updatemusiclistfromurl_nextstep(++updateindex) }, 100);
    }
}
var updateindex = 0;
function updatemusiclistfromurl_nextstep(index) {
    if (musiclists.length > index) {
        fromUrl = true;
        id_progress_progress.style.width = (index / musiclists.length) * 100 + "%";
        xfc_progress_info.innerHTML = "正在获取ID [" + musiclists[index] + "] 的音乐信息...<br/>" + (index + 1) + " / " + musiclists.length;
        updateindex = index;
        addmusictolist_info(musiclists[index]);
    }
    else {
        initmusiclistdone();
    }
    // fromUrl = false;
}
var musiclists = [];
function initmusiclistdone() {
    showMsg("音乐列表加载完毕", "ok");
    $("#id_progress").fadeOut();
    fromUrl = false;
    nextMusic();
    id_progress_progress.style.width = "100%";
    xfc_progress_info.innerHTML = "加载完毕。";

}
function sharemusiclist() {
    var shareLists = [];
    for (var i = 0; i < musicPlayingList.length; i++) {
        shareLists[shareLists.length] = musicPlayingList[i]['id'];
    }

    shareUrl("【分享】我的音乐播放列表", `${location.origin + location.pathname}?musiclist=${encodeURI(JSON.stringify(shareLists))}` + "&source=" + sourceID);
}
function checkLanguage(name) {
    var result = 0; //未知 / 英文
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (name.search(reg) != -1) {
        result = 1;//中文
    }
    var reg = /[\u3040-\u309F\u30A0-\u30FF]/;
    if (name.search(reg) != -1) {
        result = 2;//日文
    }
    var reg = /[\uac00-\ud7ff]/;
    if (name.search(reg) != -1) {
        result = 3;//韩文
    }
    var reg = /[а-яА-Я]/;
    if (name.search(reg) != -1) {
        result = 4;//俄语
    }
    return result;
}
function init() {
    var musiclist = "";
    mvid = getQueryString("mvid");
    musicid = getQueryString("musicid");
    if (musicid == 'undefined') musicid = null;
    // console.log(musicid)
    pgid = getQueryString("page");
    console.log(pgid);
    if (pgid != null && pgid != "")
        showPage(document.getElementById(pgid));
    Ksearch = (getQueryString("search"));
    Ksource = (getQueryString("source"));
    if (Ksource != null) {
        var s = parseInt(Ksource);
        if (s >= 0) {
            changeSource(s);
        }
    }
    musiclist = getQueryString("musiclist");
    if (musiclist != "" && musiclist != null) {
        try {
            musiclists = JSON.parse(musiclist);
            fromUrl = true;
            if (musiclists.length > 0) {
                $("#id_progress").fadeIn();
                xfc_title_progress.innerHTML = "正在初始化音乐列表（加载音乐信息）";
                updatemusiclistfromurl_nextstep(0);

            }
        } catch (e) {
            logdata_error(e);
            showMsg("请求参数内容错误", "error");
        }
    }
    if (musicid != "" && musicid != null) {
        playmusicbyid(musicid);
        fromUrl = true;
    } else if (mvid != "" && mvid != null) {
        fromUrl = true;
        watchMv(mvid);
    }
    if (Ksearch != "" && Ksearch != null) {
        document.getElementById("searchBox").value = decodeURIComponent(Ksearch);
        searchSongs(document.getElementById('searchBox').value);
        showPage(search);
    }

}

var editor = null;


var css = program.getConfig('usercss', null);
if (css == undefined) css = "";
css = HTMLEncode(css);
document.getElementById("editor").innerHTML = css;

editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/css");
function saveUserCSS() {
    program.setConfig("usercss", editor.getValue());
    showMsg("用户自定义 CSS 保存成功。", "ok");
}


var ismulitirow = 0;
GOLBAL_mulitirow = false;
function reloadLrcStyle() {
    // windowsResize();
    if (ismulitirow == 1) {
        if (!document.head.contains(MULITIROW_style)) {
            document.head.appendChild(MULITIROW_style);
        }

        // MULITIROW_style.href = "./lib/plugin/collist.css";

    } else {
        if (document.head.contains(MULITIROW_style)) {
            document.head.removeChild(MULITIROW_style);
        }
    }
    if (enableLeftPic) {
        if (!document.head.contains(LP_style)) {
            document.head.appendChild(LP_style);
        }
    } else {
        if (document.head.contains(LP_style)) {
            document.head.removeChild(LP_style);
        }
    }
    pointToLrc(true);

}
function reloadUserCSS() {
    var isdark = program.getConfig("dark", true);
    GOLBAL_mulitirow = program.getConfig("mulitirow", 0);
    // ismulitirow = GOLBAL_mulitirow;
    reloadLrcStyle();
    try {
        if (!isdark) {
            if (!document.head.contains(DARK_style))
                document.head.appendChild(DARK_style);
        } else {
            if (document.head.contains(DARK_style))
                document.head.removeChild(DARK_style);
        }
    } catch (e) {
        logdata_warn(e);
    }

    var css = program.getConfig('usercss', defaultCSS);
    if (css == undefined) css = "";
    GOABLE_style.innerHTML = css;
    // editor.setValue(css);
    // console.log(_SETTING)
    try {
        if (editor == null) return;
        editor.setValue(css);
    } catch (e) {
        logdata_error(e);
    }
}
var AirLrc = false;
function insertHead() {
    if (AirLrc) {
        oLRC.ms.splice(0, 1);
    } else {
        oLRC.ms.splice(0, 0, { t: 0, c: "//" });
    }
    lrcinit();
    AirLrc = !AirLrc;
}
function GUIdark(Control) {
    program.setConfig('dark', Control);
    showMsg("当前主题：" + (Control ? "深色主题" : "浅色主题"), "ok")
}

function LRCmuliti_Temp(Control) {
    if (Control == true) Control = 1;
    else Control = 0;
    showMsg("歌词两列模式临时" + (Control ? "<span style='color:green;'>启用</span>" : "<span style='color:red;'>关闭</span>"), "ok", true);
    ismulitirow = Control;
    reloadLrcStyle();
}
function enableleftpicmode(Control) {
    // if(Control){
    program.setConfig("leftpicmode", Control);
    // }
    enableLeftPic = Control;
    reloadLrcStyle();
}
function LRCmuliti(Control) {
    if (Control > 2) {
        ismulitirow = 2;
        program.setConfig('mulitirow', Control);
        reloadLrcStyle();
        showMsg("专辑歌词凸显模式启用", "ok");
        return;
    }
    program.setConfig('mulitirow', Control);
    showMsg("歌词默认两列模式：" + (Control == 0 ? "自动" : (Control == 1 ? "开启" : "关闭")), "ok");
    if (Control == 1)
        ismulitirow = 1;
    else if (Control == 2)
        ismulitirow = 0;
    reloadLrcStyle();
}
function hideGUI() {
    $("#leftbar").fadeOut();
    $("#spacebeforesinger").html("<br/>");
    $("#textmusicmv").fadeOut();
    $("#textmusicurl").fadeOut();
    showMsg("部分界面已隐藏！", "warn")
}
function clearLocalStorage_Yes(type = 0) {
    if (type == 0) {
        // 删除自定义配置
        localStorage.removeItem("userconfigs");
        _SETTINGList = defaultConfigsList;
    } else if (type == 1) {
        // 收藏夹
        localStorage.removeItem("lovesongss");
        LoveSongs = {};
    } else {
        _SETTINGList = defaultConfigsList;
        //全部删除
        localStorage.removeItem("lovesongss");
        localStorage.removeItem("userconfigs");
        localStorage.removeItem("defaultconfigs");
        _SETTING = {};
    }
    showMsg("内容重置完毕。", "warn");
    saveConfig();
}
function clearLocalStorage(type = 0) {
    c_confirm("警告", "此操作无法恢复。是否继续此操作？", true, "是", "否", "clearLocalStorage_Yes(" + type + ")");
}

function resetConfig_Yes(is) {
    // if (!r) return;
    var res = program.resetConfig(is);
    if (!program.getState() && is) {
        program.useDef();
    }
    if (res) {
        showMsg("重置成功！", "ok");
    } else {
        showMsg("重置失败！", "error");

    }
    flushLrcSetting();
}
function resetConfig(is) {
    c_confirm("警告", "此操作将删除文件！\n请确认后继续！\n确定要删除吗？", true, "是", "否", "resetConfig_Yes(" + is + ")");
}
function showMusicList() {
    if (document.getElementById("id_musiclist").style.display == 'none') {
        displaySth(document.getElementById("id_musiclist"));
        flushMusicList();
    } else {
        hideme(document.getElementById("id_musiclist"));
    }
    /*
    
    */
}
function addMusicToList(musicinfo, position = -1, donotplay = false) {
    if (position == -1) position = musicPlayingList.length;
    musicPlayingList.splice(position, 0, musicinfo);
    flushMusicList();
    // showMsg("","ok");
    if (musicPlayingIndex == -1 && !donotplay) {
        nextMusic();
    }
    return position;

}
function flushMusicList() {
    // localStorage.setItem("playinglist",JSON.stringify(musicPlayingList));
    let finallyCode = `<div class="hr-music"></div>`;
    for (let i = 0; i < musicPlayingList.length; i++) {
        try {
            let musicinfo = musicPlayingList[i];
            let mid = musicinfo['id'];
            let musicname = musicinfo['songname'];
            let singername = musicinfo['singer'];
            let vip = musicinfo['vip'];
            let hasMv = musicinfo['hasMv'];
            let mvid = musicinfo['mvid'];
            // HTMLEncode()
            let downloaded = false;
            try {
                downloaded = LoveSongs['flag'][mid];
            } catch (e) {
                logdata("列举音乐时出错：");
                logdata_warn(e);
            }
            // console.log(`${(i == musicPlayingIndex) ? "l-checked" : ""}`);
            let code = `<div class="list-song ${(i == musicPlayingIndex) ? "l-checked" : ""}"pid="${mid}"><div class="musicinfo">${JSON.stringify(musicinfo)}</div><div class="list-check">${i + 1}</div><div class="list-info2"><span class="list-name"onclick="playmusicbyid_notlist('${mid}',${i});">${musicname}</span><span class="list-singer-2"> - ${singername}</span>${vip ? `<span class="list-V">MNF</span>` : ""}${downloaded ? `<span class="list-D">已收藏</span>` : ""}${(hasMv == 1) ? `<span class="list-MV" onclick='watchMv("${mvid}")'>MV</span>` : ""}</div><div class="list-control2"><button class="li-like imgbutton"onclick="likemusic(this);"></button><button class="li-download imgbutton"onclick="downloadmusic(this);"></button><button class="li-play imgbutton"onclick="playmusicbyid_notlist('${mid}',${i});"></button><button class="deletemusic imgbutton"onclick="deletemusic(this,${i});"></button></div></div>`;
            finallyCode += code;

        } catch (e) {
            showMsg("在处理到第 " + (i + 1) + " 个内容时出错：" + e, "warn");
        }
    }
    music_list.innerHTML = finallyCode;
}
function deletemusic(ele, id = -1) {
    try {
        // document.getElementById("music_list").removeChild(ele.parentNode.parentNode);
        if (id >= 0 && id < musicPlayingList.length) {
            if (id == musicPlayingIndex) {
                musicPlayingList.splice(id, 1);
                // musicPlayingIndex--;
                nextMusic();
            } else {
                musicPlayingList.splice(id, 1);
                if (musicPlayingIndex > id) musicPlayingIndex--;
                if (musicPlayingIndex == -1) musicPlayingIndex = 0;
            }
        } else {
            showMsg("此歌曲不存在于列表中。", "warn");
        }
        flushMusicList();

    } catch (e) {
        showMsg("出现错误：" + e, "error");
    }

}
function nextMusic() {
    if (musicPlayingList.length == 0) {
        showMsg("暂无歌曲可以播放。", "info");
        return;
    }
    try {
        mplayer.pause();
    } catch (e) {
        logdata_error("暂停歌曲时出错：" + e);
    }
    try {
        let lastMusicIndex = musicPlayingIndex;
        musicPlayingIndex++;
        if (musicPlayingIndex >= musicPlayingList.length) musicPlayingIndex = 0;
        document.getElementById("lrycishow").innerHTML = `<div class="lrc-line">正在缓冲下一首歌曲，请稍后...</div>`;
        let musicid = musicPlayingList[musicPlayingIndex]['id'];
        if (musicPlayingIndex == lastMusicIndex) {
            mplayer.play()
            lrcinit();
            return;
        }
        playmusicbyid_notlist1(musicid, musicPlayingIndex);
        flushMusicList();
    } catch (e) {
        showMsg("切换歌曲时出错：" + e, "error");
    }

    // lrcinit();
}

function changeSource(source) {
    MusicApis = localApis;
}
function saveSource(source) {
    program.setConfig("source", source);
    changeSource(source);
}

function showOnlyLrc() {
    $("#bg").fadeOut(100, () => {
        $("#lrconly").fadeIn(100, () => {
            pointToLrc(true);

        });
    });
    updateLrcOnly();
}

function updateLrcOnly() {
    var Singer = $("#mshowsinger").text();
    if (Singer == "" || Singer == null) {
        Singer = "未知";
    }
    flushLrcInLrcOnly();
    $("#lrconly-name").text(Singer + ' - ' + $("#ssongname").text());
}
function flushLrcInLrcOnly() {
    var res = "";
    for (var i in oLRC.ms) {
        var line = oLRC.ms[i];
        //t Time c Text
        if (line.c == '') {
            line.c = "//";
        }
        // var code = `<div id='lrc-${i}' class='lrc-line' time='${line.t}'>${HTMLEncode(line.c)}</div>`
        var code = `<div id='s-lrc-${i}' class='lrc-line' time='${line.t}'><span style="transition: 0ms;" class="lrc-content" onclick='playfromtime(${line.t});'>${HTMLEncode(line.c)}</span></div>`
        res += code;
    }
    if (res == "") res = "<div id='s-lrc-0' class='lrc-line' time='0'>该歌曲暂时无歌词提供</div>";
    res += "<div id='lrconly-bottom'></div>";
    document.getElementById("lrccontentonly").innerHTML = res;
    // windowsResize();
}
function closeLrcOnly() {
    $("#lrconly").fadeOut(100, () => {
        $("#bg").fadeIn(100, () => {
            pointToLrc(true);

        });
    });
}