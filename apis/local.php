<?php
include("./listfiles.php");
include("./libs.php");
Header("content-type: text/json", true);
if (empty($_GET['type'])) {
    echo '{"success":"fail","message":"缺少请求参数。","code":1}';
    return;
}
if (empty($_GET['value'])) {
    $value = "";
} else {
    $value = $_GET['value'];
}
$type = $_GET['type'];
$offset = 0;
$limit = 30;
if (!empty($_GET['offset'])) {
    $offset = (int)$_GET['offset'];
}
if (!empty($_GET['limit'])) {
    $limit = (int)$_GET['limit'];
}
// $url = str_replace("\~", "%7E", $url);
$headers = "";
$value = urldecode($value);
if ($type != 'alarm') {
    if ($offset < 1) $offset = 1;
    if ($limit < 1) $offset = 10;
} else {
    if ($offset < 0) $offset = 0;
    if ($limit < 1) $offset = 10;
}

$page = (int)$offset - 1;
$offsets = ((int)$offset - 1) * ((int)$limit);
$html = "";
$result = json_decode('{}');
if (substr($value, 0, 6) == 'MUSIC_') {
    $value = substr($value, 6);
}
function searchSong($value)
{
    $result = json_decode('{"data":{"total":0,"list":[],"musicList":[]}}');
    $file = fopen("cache/location.txt.bamboomusic", "r");
    $keyword = $value;
    //检测指正是否到达文件的未端

    while (!feof($file)) {
        $path = fgets($file);
        // echo "<h1>$path</h1>";
        scanAllFile(trim($path), $keyword);
    }
    // saveId();

    fclose($file);
    // echo json_encode($files);
    foreach ($GLOBALS['files'] as $valued) {
        // $line->data[] = $value->filename;
        $res = $valued->path;
        $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
        $filewithoutext = substr($res, 0, strrpos($res, "."));
        $mvres = $filewithoutext . '.mp4';
        if (is_file($mvres)) {
            $line->rid = $value;
            $line->hasmv = 1;
        }
        $filebasename = basename($filewithoutext);
        $filepath = dirname($res);
        $musicid = $valued->id;
        $pathid = getId($filepath);
        $singer = substr($filebasename, 0, strpos($filebasename, " - "));
        if (strpos($filebasename, " - ") != false)
            $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
        else $songname = $filebasename;
        // echo strpos($res, " - ");
        if (!empty($songname)) {
            $line->name = $songname;
            $line->songName = $songname;
        }
        if (!empty($musicid)) {
            $line->rid = $musicid;
            $line->id = $musicid;
            $line->musicrid = "MUSIC_" . $musicid;
        }
        if (!empty($singer)) {
            $line->artist = $singer;
            $line->artistid = base64_encode($singer);
            $line->artistId = base64_encode($singer);
        }
        if (!empty($pathid)) {
            $line->album = $filepath;
            $line->albumid = $pathid;
            $line->albumId = $pathid;
        }
        // $result->data->songinfo = $line;
        $result->data->list[] = $line;
        // echo json_encode($line);
    }
    // $result->data->lrclist = $lrc;
    $result->data->total = $GLOBALS['total'];
    $GLOBALS['result'] = $result;
}
$seed = 1;
if (!empty($_GET['seed'])) $seed = $_GET['seed'];
$seed = strtotime(date('Y-d-m')) . '' . $seed;
// echo $offsets;
switch ($type) {
    case 'random':


        // echo $seed;
        // return;

        $result = json_decode('{"seed":"","total":30,"data":{"total":30,"list":[],"musicList":[],"num":3000},"num":3000}');
        $result->seed = $seed;
        $count = $value;
        // echo $value == null;
        $tmp = $idcaches->all_ids;
        if (count($tmp) <= 0) {
            $result->total = count($tmp);
            echo (json_encode($result));
            return;
        }
        if ($count == null || $count == "" || $count == 0) $count = 10;
        for ($iii = 0; $iii < $count; $iii++) {
            if ($GLOBALS['seed'] != 0) mt_srand($seed + $iii * $iii * 11);

            $rdnum = mt_rand(0, count($tmp) - 1);
            $resid = $tmp[$rdnum];
            // echo $idcaches_OBJ['1'];
            // return;
            // echo json_encode($idcaches_OBJ);
            // return;
            if (!is_numeric($resid)) echo $resid;
            $res = getSongPath($resid);
            // $res = getSongPath($value);
            if ($res != false && $res != "") {
                $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
                $filewithoutext = substr($res, 0, strrpos($res, "."));
                $mvres = $filewithoutext . '.mp4';
                if (is_file($mvres)) {
                    $line->rid = $resid;
                    $line->hasmv = 1;
                }
                $filebasename = basename($filewithoutext);
                $filepath = dirname($res);
                $musicid = $resid;
                $pathid = getId($filepath);
                $singer = substr($filebasename, 0, strpos($filebasename, " - "));
                if (strpos($filebasename, " - ") != false)
                    $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
                else $songname = $filebasename;
                // echo strpos($res, " - ");
                if (!empty($songname)) {
                    $line->name = $songname;
                    $line->songName = $songname;
                }
                if (!empty($musicid)) {
                    $line->rid = $musicid;
                    $line->id = $musicid;
                    $line->musicrid = "MUSIC_" . $musicid;
                }
                if (!empty($singer)) {
                    $line->artist = $singer;
                    $line->artistid = base64_encode($singer);
                    $line->artistId = base64_encode($singer);
                }
                if (!empty($pathid)) {
                    $line->album = $filepath;
                    $line->albumid = $pathid;
                    $line->albumId = $pathid;
                }
                // $result->data->songinfo = $line;
                $result->data->musicList[] = $line;
                // echo json_encode($line);
            }
        }
        // saveId();
        // $result->data-
        $html = json_encode($result);
        break;
    case 'getid':
        $html = getSongPath($value);
        if ($html == false) {
            $html = json_decode('{"code":404,"msg":"404 - 此歌曲不存在"}');
            $html->msg = "404 - $value 不存在！";
            echo json_encode($html);
            http_response_code(200);
            return;
        }
        break;
    case 'info':
        $result = json_decode('{"data":{"lrclist":[],"songinfo":{}}}');

        $res = getSongPath($value);
        if ($res == false) {
            echo '{"code":404,"msg":"404 - 此歌曲不存在"}';
            http_response_code(404);
            return;
        }
        $filewithoutext = substr($res, 0, strrpos($res, "."));
        $lrcres = $filewithoutext . '.lrc';
        $mvres = $filewithoutext . '.mp4';
        if (is_file($lrcres)) {
            $lrctext = file_get_contents($lrcres);

            $charset = mb_detect_encoding($lrctext, array('UTF-8', 'GBK', 'GB2312'));
            $charset = strtolower($charset);
            if ('cp936' == $charset) {
                $charset = 'GBK';
            }
            $lrcstr = $lrctext;
            if ("utf-8" != $charset) {
                $lrcstr = iconv($charset, "UTF-8//IGNORE", $lrctext);
            }
            // return $str; 
        } else {
            $lrcstr = "";
        }
        $lrc = LRCTOOBJ($lrcstr);


        $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
        if (is_file($mvres)) {
            $line->hasmv = 1;
            $line->hasMv = 1;
            $line->rid = $value;
        }
        $filebasename = basename($filewithoutext);
        $filepath = dirname($res);
        $musicid = getId($res);
        $pathid = getId($filepath);
        $singer = substr($filebasename, 0, strpos($filebasename, " - "));
        if (strpos($filebasename, " - ") != false)
            $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
        else $songname = $filebasename;
        // echo strpos($res, " - ");
        if (!empty($songname)) {
            $line->name = $songname;
            $line->songName = $songname;
        }
        if (!empty($musicid)) {
            $line->rid = $musicid;
            $line->id = $musicid;
            $line->musicrid = "MUSIC_" . $musicid;
        }
        if (!empty($singer)) {
            $line->artist = $singer;
            $line->artistid = base64_encode($singer);
            $line->artistId = base64_encode($singer);
        }
        if (!empty($pathid)) {
            $line->album = $filepath;
            $line->albumid = $pathid;
            $line->albumId = $pathid;
        }

        $result->data->songinfo = $line;
        $result->data->lrclist = $lrc;
        $html = json_encode($result);
        break;
    case 'suggestKey':

        $file = fopen("cache/location.txt.bamboomusic", "r");
        $line = json_decode('{"code":200,"data":[]}');
        $keyword = $value;
        //检测指正是否到达文件的未端
        $limit = 12;
        $page = 0;
        while (!feof($file)) {
            $path = fgets($file);
            // echo "<h1>$path</h1>";
            scanAllFile(trim($path), $keyword, false, true);
        }
        fclose($file);
        $suggests = array();
        $count = 0;
        foreach ($files as $value) {
            $val = $value->filename;
            $singer = substr($val, 0, stripos($val, " - "));
            $songname = substr($val, stripos($val, " - ") + 3);
            if (stristr($singer, $keyword) != false) {
                $suggests[] = $singer;
            } else if (stristr($songname, $keyword) != false) {
                $suggests[] = $songname;
            }
            // $suggests[] = $songname;

        }
        $suggests = array_unique($suggests);
        foreach ($suggests as $value) {
            $count++;
            if ($count > 10) break;
            $line->data[] = $value;
        }
        // saveId();
        echo json_encode($line);
        break;
    case 'alarm':
        $result = json_decode('{"total":0,"musiclist":[]}');
        $file = fopen("cache/location.txt.bamboomusic", "r");
        $keyword = "";
        //检测指正是否到达文件的未端
        $path = getSongPath($value);
        if ($path == false) {
            echo '{"code":404,"msg":"404 - 此专辑不存在"}';
            http_response_code(404);
            return;
        }
        $page += 1;
        // $offset;
        scanAllFile(trim($path), $keyword);
        fclose($file);
        // echo json_encode($files);
        foreach ($files as $valued) {
            // $line->data[] = $value->filename;
            $res = $valued->path;
            $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
            $filewithoutext = $valued->filename;
            $filebasename = basename($filewithoutext);
            $filepath = dirname($res);
            $musicid = $valued->id;
            $pathid = getId($filepath);
            $singer = substr($filebasename, 0, strpos($filebasename, " - "));
            if (strpos($filebasename, " - ") != false)
                $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
            else $songname = $filebasename;
            // echo strpos($res, " - ");
            if (!empty($songname)) {
                $line->name = $songname;
                $line->songName = $songname;
            }
            if (!empty($musicid)) {
                $line->rid = $musicid;
                $line->id = $musicid;
                $line->musicrid = "MUSIC_" . $musicid;
            }
            if (!empty($singer)) {
                $line->artist = $singer;
                $line->artistid = base64_encode($singer);
                $line->artistId = base64_encode($singer);
            }
            if (!empty($pathid)) {
                $line->album = $filepath;
                $line->albumid = $pathid;
                $line->albumId = $pathid;
            }
            // $result->data->songinfo = $line;
            $result->musiclist[] = $line;
            // echo json_encode($line);
        }
        // saveId();
        // $result->data->lrclist = $lrc;
        $result->total = $total;
        $html = json_encode($result);
        // http_response_code(404);
        break;
    case 'playlist':
        $result = json_decode('{"data":{"total":0,"musicList":[]}}');
        $file = fopen("cache/location.txt.bamboomusic", "r");
        $keyword = "";
        //检测指正是否到达文件的未端
        $path = getSongPath($value);
        if ($path == false) {
            echo '{"code":404,"msg":"404 - 此列表不存在"}';
            http_response_code(404);
            return;
        }

        scanAllFile(trim($path), $keyword);
        fclose($file);
        // echo json_encode($files);
        foreach ($files as $valued) {
            // $line->data[] = $value->filename;
            $res = $valued->path;
            $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
            $filewithoutext = $valued->filename;
            $filebasename = basename($filewithoutext);
            $filepath = dirname($res);
            $musicid = $valued->id;
            $pathid = getId($filepath);
            $singer = substr($filebasename, 0, strpos($filebasename, " - "));
            if (strpos($filebasename, " - ") != false)
                $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
            else $songname = $filebasename;
            // echo strpos($res, " - ");
            if (!empty($songname)) {
                $line->name = $songname;
                $line->songName = $songname;
            }
            if (!empty($musicid)) {
                $line->rid = $musicid;
                $line->id = $musicid;
                $line->musicrid = "MUSIC_" . $musicid;
            }
            if (!empty($singer)) {
                $line->artist = $singer;
                $line->artistid = base64_encode($singer);
                $line->artistId = base64_encode($singer);
            }
            if (!empty($pathid)) {
                $line->album = $filepath;
                $line->albumid = $pathid;
                $line->albumId = $pathid;
            }
            // $result->data->songinfo = $line;
            $result->data->musicList[] = $line;
            // echo json_encode($line);
        }
        // saveId();
        // $result->data->lrclist = $lrc;
        $result->data->total = $total;
        $html = json_encode($result);
        // http_response_code(404);
        break;
    case 'mv':
        $res = getSongPath($value);
        if ($res == false) {
            echo '{"code":404,"msg":"404 - 此歌曲不存在"}';
            http_response_code(404);
            return;
        }
        $html = "./apis/getlocalmusic.php?type=mp4&id=" . $value;
        break;
    case 'url':

        $res = getSongPath($value);
        if ($res == false) {
            echo '{"code":404,"msg":"404 - 此歌曲不存在"}';
            http_response_code(404);
            return;
        }
        $html = "./apis/getlocalmusic.php?id=" . $value;
        // echo $html;
        break;
    case 'singer':
        $resu = json_decode('{"musiclist":[],"total":0}');
        //不break，进入search
        $valued = base64_decode($value);
        if ($valued != false)
            $value = $valued;
        searchSong($value);
        $resu->musiclist = $result->data->list;
        $resu->total = $result->data->total;
        $html = json_encode($resu);
        // saveId();

        break;
    case 'search':
        searchSong($value);
        $html = json_encode($result);
        // saveId();

        break;
    case 'folder':
        $file = fopen("cache/location.txt.bamboomusic", "r");
        $result = json_decode('{"data":{"list":[]}}');
        while (!feof($file)) {
            $path = trim(fgets($file));
            if (trim($path) == '') continue;
            // echo "<h1>$path</h1>";
            $line = json_decode('{"name":"","uname":"","userName":"","id":""}');
            $pathid = getId($path);
            $line->id = $pathid;
            $line->name = trim($path);
            $line->uname = "Local";
            $line->userName = "Local";
            $result->data->list[] = $line;
            // scanAllFile(trim($path), $keyword);
        }
        // saveId();

        $html = json_encode($result);
        fclose($file);
        // saveId();
        break;
    case 'files':
        $result = json_decode('{"data":{"total":0,"musicList":[]}}');
        $file = fopen("cache/location.txt.bamboomusic", "r");
        $keyword = "";
        //检测指正是否到达文件的未端

        while (!feof($file)) {
            $path = fgets($file);
            // echo "<h1>$path</h1>";
            scanAllFile(trim($path), $keyword);
        }
        // saveId();

        fclose($file);
        // echo json_encode($files);
        foreach ($files as $valued) {
            // $line->data[] = $value->filename;
            $res = $valued->path;
            $line = json_decode('{"id":0,"rid":"0","musicrid":"0","payInfo":{"feeType":{"vip":0}},"artist":"","name":"","album":"","albumid":"","albumId":"","albumpic":"","artistid":"","releaseDate":null,"songName":""}');
            $filewithoutext = $valued->filename;
            $filebasename = basename($filewithoutext);
            $filepath = dirname($res);
            $musicid = $valued->id;
            $pathid = getId($filepath);
            $singer = substr($filebasename, 0, strpos($filebasename, " - "));
            if (strpos($filebasename, " - ") != false)
                $songname = substr($filebasename, strpos($filebasename, " - ") + 3);
            else $songname = $filebasename;
            // echo strpos($res, " - ");
            if (!empty($songname)) {
                $line->name = $songname;
                $line->songName = $songname;
            }
            if (!empty($musicid)) {
                $line->rid = $musicid;
                $line->id = $musicid;
                $line->musicrid = "MUSIC_" . $musicid;
            }
            if (!empty($singer)) {
                $line->artist = $singer;
                $line->artistid = base64_encode($singer);
                $line->artistId = base64_encode($singer);
            }
            if (!empty($pathid)) {
                $line->album = $filepath;
                $line->albumid = $pathid;
                $line->albumId = $pathid;
            }
            // $result->data->songinfo = $line;
            $result->data->musicList[] = $line;
            // echo json_encode($line);
        }
        // saveId();
        // $result->data->lrclist = $lrc;
        $result->data->total = $total;
        $result->data->num = $total;
        $html = json_encode($result);
        break;
    default:
        echo '{"success":"fail","message":"未知的参数","code":1}';
        http_response_code(404);
        return;
}
// saveId();

echo $html;
