var mplayerobj = document.getElementById("musicurl");
var volumeobj = document.getElementById("volume-set");
var playerobj = document.getElementById("play-progress");
var currentTimeObj = document.getElementById("player-time-current");
var totalTimeObj = document.getElementById("player-time-total");
var videoObj = document.getElementById("watchvideo");

function mplayerF() {
    this.src = "";
    this.paused = true;
    this.volume = 0;
    this.onvolumechange = null;
    this.onplay = null;
    this.currentTime = 0;
    this.onended = null;
    this.duration = 1;
    this.ontimeupdate = null;
    this.trackEvents = true;
    this.changeTime = function () {
        if (!isNaN(this.currentTime)) {
            mplayerobj.currentTime = (this.currentTime);
        }
        currentTimeObj.innerText = secondToTime_int(this.currentTime);
        if (!isNaN(this.duration)) {
            totalTimeObj.innerText = secondToTime_int(this.duration);
        }
    }
    this.play = function (cansel) {
        if (cansel == 0) {
            this.currentTime = 0;
        }
        if (mplayerobj.src !== this.src) {
            mplayerobj.src = this.src;
        }
        mplayerobj.volume = this.volume;
        mplayerobj.currentTime = this.currentTime;
        volumeobj.value = this.volume * 100;
        this.duration = mplayerobj.duration;
        // if (this.duration <= 0) this.duration = 1;
        // this.paused = false;
        currentTimeObj.innerText = secondToTime_int(this.currentTime);
        if (!isNaN(this.duration)) {
            totalTimeObj.innerText = secondToTime_int(this.duration);
        }
        try {
            mplayerobj.play().then(() => {
                // console.log("Promise")
                document.getElementById("pause-song").classList.add("player-paused");

            }).catch((reason) => {
                if (reason.name == 'NotAllowedError') {
                    showMsg("根据浏览器播放规则，自动播放失败。请手动点击播放。", "warn");
                }
                console.warn("无法播放：", reason.name, reason.message);
                // console.warn(reason);
                this.paused = true;
            });
        } catch (e) {
            // console.warn(e);
        }

    };
    this.pause = function () {
        this.paused = true;
        mplayerobj.pause();
        document.getElementById("pause-song").classList.remove("player-paused");
    };
    this.stop = function () {
        this.currentTime = 0;
        mplayerobj.stop();
    }
}
var mplayer = new mplayerF();
let volumes = localStorage.getItem("volume");
if (volumes == null) {
    mplayer.volume = 1;
} else {
    mplayer.volume = volumes;
}
volumeobj.value = parseFloat(mplayer.volume) * 100;
changePos(volumeobj);
mplayerobj.volume = mplayer.volume;
mplayerobj.onended = function () {
    mplayer.currentTime = 0;
    mplayer.onended();
    mplayer.paused = true;
}
function cancelTrack() {
    mplayer.trackEvents = false;
    // mplayer.trackEvents = false;
}
function startTrack() {
    mplayer.trackEvents = true;

}
// mplayerobj.onvolumechange = function(){
//     mplayer.volume = mplayerobj.volume;
//     mplayer.onvolumechange();
// }
mplayerobj.onplay = function () {
    mplayer.paused = false;
    mplayer.volume = mplayerobj.volume;
    mplayer.currentTime = mplayerobj.currentTime;
    mplayer.duration = mplayerobj.duration;
    if (!isNaN(mplayer.currentTime)) {
        currentTimeObj.innerText = secondToTime_int(mplayer.currentTime);
    }

    if (!isNaN(mplayer.duration)) {
        //console.log(1, mplayer.duration)
        totalTimeObj.innerText = secondToTime_int(mplayer.duration);
    }
    mplayer.onplay();
}
mplayerobj.ontimeupdate = function () {
    mplayer.currentTime = mplayerobj.currentTime;
    if (!isNaN(mplayerobj.duration)) {
        if (mplayer.duration != mplayerobj.duration) {
            mplayer.duration = mplayerobj.duration;
            totalTimeObj.innerText = secondToTime_int(mplayer.duration);
        }
    }

    if (mplayer.trackEvents) {
        let value = parseFloat(mplayer.currentTime / mplayer.duration * 1000);
        if (!isNaN(value)) {
            playerobj.value = value;
            changePos(playerobj);
            currentTimeObj.innerText = secondToTime_int(mplayer.currentTime);
        }

    } else {
        if (!isNaN(mplayer.currentTime)) {
            playerobj.style.backgroundSize = parseFloat(mplayer.currentTime / mplayer.duration * 100) + "% 100%";
            currentTimeObj.innerText = secondToTime_int(mplayer.currentTime);
        }
    }
    mplayer.ontimeupdate();

}
function changePos(ele) {
    let Nvalue = parseInt(ele.value);
    let Nmax = parseInt(ele.max);
    ele.style.backgroundSize = parseFloat(Nvalue / Nmax * 100) + "% 100%";
}
playerobj.onchange = function () {
    changePos(this);
    mplayer.currentTime = parseInt(playerobj.value) / 1000 * mplayer.duration;
    mplayer.changeTime();
}
volumeobj.onchange = function () {
    changePos(this);
    let volumes = parseInt(volumeobj.value) / 100;
    mplayer.volume = volumes;
    mplayerobj.volume = mplayer.volume;
    localStorage.setItem("volume", volumes);
}
mplayer.volume = mplayerobj.volume;
mplayer.currentTime = mplayerobj.currentTime;

function pauseMusic() {
    if (!mplayer.paused) {
        mplayer.pause();
    } else {
        mplayer.play();
    }
}
function secondToTime_int(second) {
    if (isNaN(second)) {
        second = 0;
    }
    let min = parseInt(second / 60) + "";
    let sec = parseInt(second % 60) + "";
    if (min.length == 1) min = "0" + min;
    if (sec.length == 1) sec = "0" + sec;
    return `${min}:${sec}`;
}
function lastMusic() {
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
        musicPlayingIndex--;
        if (musicPlayingIndex < 0) musicPlayingIndex = musicPlayingList.length - 1;
        document.getElementById("lrycishow").innerHTML = `<div class="lrc-line">正在缓冲下一首歌曲，请稍后...</div>`;
        let musicid = musicPlayingList[musicPlayingIndex]['id'];
        if (musicPlayingIndex == lastMusicIndex) {
            mplayer.play(0);
            lrcinit();
            return;
        }
        playmusicbyid_notlist1(musicid, musicPlayingIndex);
        flushMusicList();
    } catch (e) {
        showMsg("切换歌曲时出错：" + e, "error");
    }

}
function muteVolume() {
    if (mplayerobj.muted) {
        mplayerobj.muted = false;
        document.getElementById("mute-volume").classList.remove("volume-muted");
    } else {
        mplayerobj.muted = true;
        document.getElementById("mute-volume").classList.add("volume-muted");

    }
}