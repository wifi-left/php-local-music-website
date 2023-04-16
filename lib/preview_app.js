var rootmenu = document.getElementsByClassName("root-left-part")[0];
function show_or_hide_the_menubar(op = null) {
    if (op == true) {
        rootmenu.classList.add("show");
        return;
    } else if (op == false) {
        rootmenu.classList.remove("show");
        return;
    }
    if (rootmenu.classList.contains("show")) {
        rootmenu.classList.remove("show");
    } else {
        rootmenu.classList.add("show");
    }
}

function changeWindow(winname) {
    let wid = "win-" + winname;
    let winele = document.getElementById(wid);
    let allwins = document.getElementsByClassName("app-content-window");
    let winbtn = document.getElementById("btn-" + winname);
    let allbtns = document.querySelector(".active");
    if (allbtns != undefined) {
        if (winbtn.id == allbtns.id) return;
        allbtns.classList.remove("active");
    }

    let dsTop = winbtn.getBoundingClientRect().top + 22;
    for (var i = 0; i < allwins.length; i++) {
        // $(allwins[i]).fadeOut(1);
        allwins[i].style.display = "none";
    }

    document.getElementById("left-sel-display-bar").style.top = dsTop + "px";
    winbtn.classList.add("active")
    $(winele).fadeIn(100);
}

function showPage(whom) {
    // hideme(document.getElementById("id_114514"));
    hideme(document.getElementById("id_musiclist"));
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