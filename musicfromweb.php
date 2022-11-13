<?php
//URI://play/?musicrid0=[ID的BASE64编码]
if(empty($_GET['musicrid0'])) {
    echo "缺少参数";
    header("Location: index.html",true,302);
    return;
}
$ID = base64_decode($_GET['musicrid0']);
$ID = str_replace("MUSIC_","",$ID);
header("Location: index.html?musicid=" . $ID,true,302);
