<?php
include("listfiles.php");
// reflushLocalCache();
// echo '{"code":200,"msg":"文件列表刷新成功！"}';
$action = 0;
if (empty($_GET['action'])) {
    http_response_code(404);
    include('../ErrorPages/404.html');
    exit(1);
}
$action = $_GET['action'];

if (empty($_GET['psw'])) {
    http_response_code(404);
    include('../ErrorPages/404.html');
    exit(1);
}
$config = null;
if (is_file("cache/config.json.bamboomusic")) {
    $myfiles = fopen("cache/config.json.bamboomusic", "r") or send_error("无法写入配置文件。");
    $flengths = filesize("cache/config.json.bamboomusic");
    if ($flengths > 0) {
        $contentFs = fread($myfiles, $flengths);
    } else {
        $contentFs = '{}';
    }
    fclose($myfiles);
} else {
    $contentFs = '{}';
}
$config = json_decode($contentFs);
if (empty($config->psw)) {
    // echo json_encode($config);
    // exit();
    $defaultpsw = "admin";
    $salt = '19a1b0dd43fca26e6965bf12cadc22ebfe1c925c6821c1d6280f2183866b9735fhewhuwehfuhufhhhuehfuwefnewfduqnw98231ey723dh23hgr634g2r7h32fgergj98345hy745hy-64o64jyuh465yntuu4jhyu4he3uth453nmc2q3n2mq83s7ytvd87qxr72347h98tr534y7t42a2rhTtIRVs5wLG44OmntT4jl2DAKdc9f7Pexkcx8kjhupErbqduF0tANMqaSpN0nY0gmtwojN2xcDCAn8ly4rvMTv1Lfu6dm7xjMMT3JpxoJsjnB2HJfDT78NJTgyav0PSTw4KHLpVjUNTFyR11O32RhxrrjZ9giogoPuLuENJANqZYQ2P1NJjwoV0cTR1LSMQJ8duziN@$&[f,%e#Hzq)yB>V$i8f$oyK<kkJu;F1OW)-$8sx`yWMF^izrT2B:|^P4AnpZj0b=YP/M*c;f%Tt @I/KRo&:q;%FM3OvuN?n@pQg]<y;YY~EE=u6Oda?H7J~wG=(r:?HZP4Nu{Sv1pt_X>{FNC}qmn>+%k|jQZIR)E4EEJVTP+[adthh>it,<-y|o)0kb^xp+9g?';
    mt_srand(time());
    $randomidx = mt_rand(0, strlen($salt) - 30);
    $randomrdx = mt_rand($randomidx + 5, strlen($salt));
    $ransalt = substr($salt, $randomidx, $randomrdx);
    $config->psw = crypt(($defaultpsw), $ransalt);
    $config->salt = $ransalt;
    saveCFG();
}
$epsw = crypt((base64_decode(urldecode($_GET['psw']))), $config->salt);
if ($epsw != $config->psw) {
    echo '{"code":"403","msg":"密码错误。"}';
    exit(1);
}
$value = "";
if (!empty($_GET['value'])) {
    $value = $_GET['value'];
}
Header("content-type: text/json", true);

switch ($action) {
    case -1:
        //啥也没有
        echo '{"code":"200","msg":"操作成功。"}';
        break;
    case 4: //刷新缓存
        reflushLocalCache();
        echo '{"code":"200","msg":"操作成功。"}';
        break;
    case 5: //获取所有目录列表
        readFilesList();
        $result = array();
        foreach ($GLOBALS['filelist'] as $key => $value) {
            $id = substr($key, 1);
            $result[] = getSongPath($id);
        }
        $output = json_decode('{"code":"200","data":[]}');
        $output->data = $result;
        echo json_encode($output);
        break;
    case 1: //获取所有目录别名列表
        loadPathNames();
        $output = json_decode('{"code":"200","data":[]}');
        $output->data = $GLOBALS['pathnames'];
        echo json_encode($output);
        break;
    case 2: //设置目录别名列表
        $POSTP = file_get_contents("php://input");
        // echo $POSTP;
        if(empty($POSTP)){
            echo '{"code":"402","msg":"缺少参数。"}';
            break;
        }
        $value = urldecode($POSTP);
        if ($value == "") {
            echo '{"code":"402","msg":"缺少参数。"}';
            break;
        }
        $mywritefile = fopen("cache/names.json.bamboomusic", "w") or send_error("无法写入文件。");
        fwrite($mywritefile, $value);
        fclose($mywritefile);
        echo '{"code":"200","msg":"操作成功。"}';
        break;
    case 3: //更改密码
        $value = base64_decode($value);
        if (strlen($value) >= 5) {
            $salt = '19a1b0dd43fca26e6965bf12cadc22ebfe1c925c6821c1d6280f2183866b9735fhewhuwehfuhufhhhuehfuwefnewfduqnw98231ey723dh23hgr634g2r7h32fgergj98345hy745hy-64o64jyuh465yntuu4jhyu4he3uth453nmc2q3n2mq83s7ytvd87qxr72347h98tr534y7t42a2rhTtIRVs5wLG44OmntT4jl2DAKdc9f7Pexkcx8kjhupErbqduF0tANMqaSpN0nY0gmtwojN2xcDCAn8ly4rvMTv1Lfu6dm7xjMMT3JpxoJsjnB2HJfDT78NJTgyav0PSTw4KHLpVjUNTFyR11O32RhxrrjZ9giogoPuLuENJANqZYQ2P1NJjwoV0cTR1LSMQJ8duziNfHzqyB>V$i8f$oyK<kkJu;F1OW)-$8sx`yWMF^izrT2B:|^P4AnpZj0b=YP/M*c;f%Tt @I/KRo&:q;%FM3OvuN?n@pQg]<y;YY~EE=u6Oda?H7J~wG=(r:?HZP4Nu{Sv1pt_X>{FNC}qmn>+%k|jQZIR)E4EEJVTP+[adthh>it,<-y|o)0kb^xp+9g?';
            mt_srand(time());
            $randomidx = mt_rand(0, strlen($salt) - 30);
            $randomrdx = mt_rand($randomidx + 5, strlen($salt));
            $ransalt = substr($salt, $randomidx, $randomrdx);
            $config->psw = crypt(($value), $ransalt);
            $config->salt = $ransalt;
            echo '{"code":"200","msg":"操作成功。"}';
        } else {
            echo '{"code":"402","msg":"操作参数缺失。"}';
        }


        saveCFG();
        break;
    default:
        echo '{"code":"401","msg":"未知操作。"}';
}
function saveCFG()
{
    $mywritefile = fopen("cache/config.json.bamboomusic", "w") or send_error("无法写入ID缓存列表。");
    fwrite($mywritefile, json_encode($GLOBALS['config']));
    fclose($mywritefile);
}
