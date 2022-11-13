// const audio = require("fluent-ffmpeg/lib/options/audio");
// program.getConfig("")
// const { fstat } = require("fs");
$("#pre-loading-text").show();
$("#pre-fail-text").hide();
var onmove = false;
var specLrc = 0;
var logFather = document.getElementById("log_display");
var musicPlayingIndex = -1;
var musicPlayingList = [];
var DisabledAnimationLrc = false;
var hideMainLrcs = false;
var nowTime = 0;
var totalTime = 0;
var pid = 0;
var state = 0;
var SPRCLRC_style = document.createElement("link");
SPRCLRC_style.href = "../lib/plugin/speclrcshu.css";
SPRCLRC_style.rel = "stylesheet";
document.head.appendChild(SPRCLRC_style);
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

            SPRCLRC_style.href = "../lib/plugin/speclrcshu.css";
            showMsg("特殊歌词（竖列）开启", "ok");
            document.head.appendChild(SPRCLRC_style);
            //竖列
            break;
        case 3:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（竖列、居中）开启", "ok");
            SPRCLRC_style.href = "../lib/plugin/speclrcmiddleshu.css";
            //竖列居中
            document.head.appendChild(SPRCLRC_style);
            break;
        case 4:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（横、底部、居中）开启", "ok");
            SPRCLRC_style.href = "../lib/plugin/speclrcbottommiddle.css";
            document.head.appendChild(SPRCLRC_style);
            //居中，下
            break;
        case 5:
            // specLrc = true;
            document.getElementById("lrc-top").style.display = "inline-block";
            document.getElementById("lrc-bottom").style.display = "inline-block";
            showMsg("特殊歌词（横、居中）开启", "ok");
            SPRCLRC_style.href = "../lib/plugin/speclrcmiddle.css";
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

// 有可能会变
var picSnow = new Image();
picSnow.src = "../img/practice/snow.png";
var picRain = new Image();
picRain.src = "../img/practice/rain.png";
var picChristmas = new Image();
picChristmas.src = "../img/practice/christmas.png";
var picFlower = new Array();
for (var i = 1; i <= 7; i++) {
    picFlower[i - 1] = new Image();
    picFlower[i - 1].src = "../img/practice/flower (" + i + ").png";
}
var picAi = new Image();
picAi.src = "../img/practice/love.png";
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

var parsesss = false;
var nowpg = 1;
function getQueryString(url, name) {
    if (name == null) name = url, url = window.location.search;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
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
    // var urlpath = "-http:-//antiserver.kuwo.cn/anti.s?type=convert_url&rid=" + id + "&format=mp3&response=url" + id + "="
    // fetchinfo(urlpath, {}, downsong, id);
    if (flag)
        showMsg("已删除收藏", "warn");
    else
        showMsg("已添加收藏", "ok");
    flushLike();
}
function sharemusicID(name, id) {
    if (id == 0) return;
    shareUrl("歌名：" + name, location.origin + location.pathname + "?musicid=" + id);
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
    shareUrl(Name, location.origin + location.pathname + "?musicid=" + id);
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
    //     showMsg("已添加到下载列表。", "info");
    //     var id = ele.parentNode.parentNode.getAttribute("pid");
    //     var urlpath = "-http:-//antiserver.kuwo.cn/anti.s?type=convert_url&rid=" + id + "&format=mp3&response=url" + id + "="
    //     fetchinfo(urlpath, {}, downsong, id);

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
    musicloadingtip1.innerHTML = "正在缓冲音乐音乐信息";
    musicloadingtip2.innerHTML = "请稍后 ...";
    $("#music-loading").fadeIn(300);
}
function hideMusicLoading() {
    $("#music-loading").fadeOut(300);
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
// document.getElementById("songname").innerHTML = "无歌曲播放";
var mplayer = {
    paused: false
}
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
}
function playfromtime(time) {
    // var time = event.target.getAttribute("time");
    showMsg(`从 ${time} 秒开始播放<br/><a onclick="playfromtime(${nowTime / 1000})">返回原位置</a>`, "info", true);
    //mplayer.currentTime = time;
    runcommand("settime|" + time);
    // mplayer.currentTime = time;
    // showMsg("已撤销操作", "info");
}
function settime(step) {
    //console.log(step, parseInt(step) / 10000 * totalTime);
    runcommand("settime|" + parseFloat((parseInt(step) * totalTime / 10000) / 1000));
}
function songchange(isnext) {
    if (isnext) {
        runcommand("next");
    } else {
        runcommand("last");
    }
}
function pause() {
    runcommand("pause");
}
function play() {
    runcommand("play");
}
function Playingtick(push = false) {
    if (state == -1) return;
    runcommand_yb("getstate");

    var tnowTime = parseInt(runcommand("gettime"));
    var ttotalTime = parseInt(runcommand("gettotaltime"));
    if (!isNaN(tnowTime)) {
        nowTime = tnowTime;
        if (!onmove)
            progressset.value = parseInt(nowTime * 10000 / totalTime);
    }
    if (!isNaN(ttotalTime)) {
        totalTime = ttotalTime;
    }
    if (state != 1) mplayer.paused = true;
    else mplayer.paused = false;
    if (push) {
        reloadSongInfo();
    } else {
        var ppid = parseInt(runcommand("getid"));
        if (!isNaN(ppid))
            if (parseInt(ppid) != parseInt(pid)) {
                pid = ppid;
                reloadSongInfo();
            }
    }
    pointToLrc();
    if (IsAppleStore()) {
        setTimeout(Playingtick, 150);
    } else {
        setTimeout(Playingtick, 100);
    }
}
function reloadSongInfo() {
    reflushCanvas();
    windowsResize();
    showMusicLoading();
    var text = runcommand("getname");
    var arr = text.split(" - ");
    if (arr.length <= 1) {
        singer = "未知";
        sname = text;
    } else {
        singer = arr[0];
        sname = text.substring(text.indexOf(" - ") + 3);
    }
    var path = runcommand("getpath");
    var lrc = runcommand("getlrc");
    mdownloadlrc.href = "data:text/plain;charset=utf-8," + encodeURIComponent(lrc);
    mdownloadlrc.setAttribute("download", `${singer} - ${sname}.lrc`);
    createLrcObj(lrc);
    lrcinit();

    if ((oLRC.hasTranslate && GOLBAL_mulitirow == 0 || GOLBAL_mulitirow == 1) && !hideMainLrcs) LRCmuliti_Temp(true);
    else {
        ismulitirow = false;
        LRCmuliti_Temp(false);
    }
    if (program.getConfig("effect", true) == true) {
        flushEffectType(sname);
    }
    ssongname.innerText = sname;
    var lidx = checkLanguage(sname);
    if (languagename == null) languagename = "未知";
    var languagename = languageNameList[lidx];
    document.getElementById("languagename").innerText = languagename;
    document.getElementById("languagename").innerText = languagename;
    mshowurl.href = path;
    document.getElementById("ssingername").innerText = " - " + singer;
    hideMusicLoading();

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
        var times = nowTime / 1000 + oLRC.offset;
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
function windowsResize() {
    document.getElementById("lrycishow").style.paddingBottom = (parseInt((document.getElementById("bg").clientHeight - 180) / 2)) + "px";
    if (document.getElementById("bg").clientWidth < 720 && GOLBAL_mulitirow != 1 && ismulitirow) {
        showMsg("检测到您的屏幕宽度较小，已为您自动关闭两列歌词。如需开启请在设置中设置默认开启。", "info");
        ismulitirow = false;
        reloadLrcStyle();
    }
}
var TimeOuttmp = -1;
function hilightlrc(idx, push = false) {
    var ele = document.getElementsByClassName("lrc-line-sel");
    if (!push)
        for (var i = 0; i < ele.length; i++) {
            if (ele[i].id == ('lrc-' + idx)) return;
            ele[i].classList.remove("lrc-line-sel");
        }
    var bh = window.innerHeight;
    // 显示到： bh/2;
    var schheight = document.getElementById("lrycishow").scrollHeight;
    var aclientHeight = lrycishow.clientHeight;
    ScrolltoEx(document.getElementById("lrycishow"), (idx) / oLRC.ms.length * (schheight - bh / 2 + 80) - bh / 2 + 160);
    document.getElementById("lrc-" + idx).classList.add("lrc-line-sel");
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


var lasterr = "";
function showPage(whom) {
    if (whom.id == 'setting') {
        flushLrcSetting();
    }
    else if (whom.id == "music") {
        reflushCanvas();
    }
    else if (whom.id == 'mylove') {
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
            waitT = random(10, 80);
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

}
var TOKEN_CSRF = undefined;
function HideLoadingPane() {
    setTimeout(() => {
        $("#pre-loadding").fadeOut(300);
    });
}
var DisabledAnimation = true;
window.onload = () => {
    // changeSource(program.getConfig("source", 0));
    DisabledAnimation = program.getConfig("DisabledAnimation", IsAppleStore());
    specLrc = program.getConfig("specLrcStyle", 2);
    specLrcStyle(specLrc);
    //hideMainLrcs
    hideMainLrcs = program.getConfig("hideMainLrc", false);
    hideMainLrc(hideMainLrcs);
    DisabledAnimationLrc = program.getConfig("DisabledAnimationLrc", IsAppleStore());
    // TOKEN_CSRF = program.getConfig("csrf", undefined);
    windowsonload();
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
var port = 11351;
var server = "http://127.0.0.1:11351";
function init() {
    // TCP 初始化
    server = prompt("请输入您本地播放器API的地址（不输入则默认http://127.0.0.1:11351）");
    if (server == null || server == "") {
        server = "http://127.0.0.1:11351";
    }
    if (testPort(server)) {
        HideLoadingPane();
        initmusicinfo();
    } else {
        loadsub1.innerHTML = "加载失败：";
        loadsub2.innerHTML = "无法连接至 " + server;
    }
}
var singer = "", sname = "";
function initmusicinfo() {
    reloadSongInfo();
    Playingtick();
    //console.log(singer + "\n" + sname);
}

/*getuid
getname
getpath
getid
gettotaltime
gettime
getlrc
next
last
pause
play
getstate
settime
quit
*/
function testPort() {
    logdata("Runtime UID: " + uid);
    var xhttp = new XMLHttpRequest();
    try {
        xhttp.onreadystatechange = function () {
            console.log(xhttp);
            if (xhttp.readyState == 4 && xhttp.status == 0) {
                logdata_error("Unknown Error Occured. Server response not received.");
                loadsub1.innerHTML = "加载失败，" + "无法连接至 " + server;
                loadsub2.innerHTML = "请确认您的端口是正确的。"
            }
        };
        xhttp.open("POST", server, true);
        xhttp.send("getuid");
    } catch (e) {
        console.log('catch', e);
    }
    var uid = runcommand("getuid");

    if (uid != "" && uid != null) return true;
    return false;

}
function runfetch(command) {
    try {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 0) {
                loadsub1.innerText = ("Unknown Error Occured. Server response not received.");
                return null;
            }
        };
        request.open('POST', `${server}`, false);
        request.onerror = (ev) => {
            logdata_error("XHR ERROR: " + JSON.stringify(ev));
            return null;
        }

        request.ontimeout = (ev) => {
            logdata_error("XHR ERROR: (TIMEOUT) " + JSON.stringify(ev));
            return null;
        }
        request.send(command);

        if (request.status === 200) {
            // console.log(request.responseText);
            return request.responseText;
        }
    } catch (e) {
        return null;
    }
}

function runcommand_yb(command) {
    var xhttp = new XMLHttpRequest();
    try {
        xhttp.onreadystatechange = function () {
            // console.log(xhttp);
            if (xhttp.readyState == 4 && xhttp.status == 0) {
                logdata_error("Unknown Error Occured. Server response not received.");
                loadsub1.innerHTML = "加载失败，" + "无法连接至 " + server;
                loadsub2.innerHTML = "请确认您的端口是正确的。然后重新加载这个页面。或者<a href='#' onclick='state=0;this.parentNode.removeChild(this);Playingtick(true);HideLoadingPane();'>点击此处重试</a>。";
                state = -1;

                $("#pre-loadding").fadeIn(300);
            }
            if (xhttp.status === 200) {

                var tstate = parseInt(xhttp.responseText);
                if (!isNaN(tstate)) state = tstate;
            }
        };
        xhttp.open("POST", server, true);
        xhttp.send("getstate");
    } catch (e) {
        console.log('catch', e);
    }
}

function runcommand(command) {
    var result = runfetch(command);
    return result;
}

var css = program.getConfig('usercss', null);
if (css == undefined) css = "";
css = HTMLEncode(css);
document.getElementById("editor").innerText = css;

function saveUserCSS() {
    program.setConfig("usercss", editor.innerText);
    showMsg("用户自定义 CSS 保存成功。", "ok");
}
var DARK_style = document.createElement("link");
DARK_style.href = "../lib/theme/light.css";
DARK_style.rel = "stylesheet";
document.head.appendChild(DARK_style);
var MULITIROW_style = document.createElement("link");
MULITIROW_style.href = "../lib/plugin/collist.css";
MULITIROW_style.rel = "stylesheet";
document.head.appendChild(MULITIROW_style);

var ismulitirow = false;
GOLBAL_mulitirow = false;
function reloadLrcStyle() {
    // windowsResize();

    if (ismulitirow) {
        if (!document.head.contains(MULITIROW_style)) {
            document.head.appendChild(MULITIROW_style);
        }
    } else {
        if (document.head.contains(MULITIROW_style)) {
            document.head.removeChild(MULITIROW_style);
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
        editor.innerText = (css);
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

    //showMsg("歌词两列模式临时" + (Control ? "<span style='color:green;'>启用</span>" : "<span style='color:red;'>关闭</span>"), "ok", true);
    ismulitirow = Control;
    reloadLrcStyle();
}

function LRCmuliti(Control) {
    program.setConfig('mulitirow', Control);
    showMsg("歌词默认两列模式：" + (Control == 0 ? "自动" : (Control == 1 ? "开启" : "关闭")), "ok");
    if (Control == 1)
        ismulitirow = true;
    else if (Control == 2)
        ismulitirow = false;
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
        localStorage.removeItem("lovesongs");
        LoveSongs = {};
    } else {
        _SETTINGList = defaultConfigsList;
        //全部删除
        localStorage.removeItem("lovesongs");
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

function nextMusic() {

}

