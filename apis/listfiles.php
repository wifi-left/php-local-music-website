<?php
class fileinfo
{
    public $filename = "";
    public $path = "";
    public $id = 0;
    public $cover = -1;
}
class localfileinfo
{
    public $path = "";
    public $type = 0; //0 is file; 1 is folder
    public $cover = -1; // For dir
}
$files = array();
$limit = 30;
$page = 0;
$count = 0;

function send_error($error)
{
    echo '{"code":500,"msg":"500 - ' . $error . '"}';
    http_response_code(500);
    exit(0);
}
$filelist = null;
if (!is_dir("cache")) {
    mkdir("cache");
    if (!is_dir("cache")) {
        send_error("无法创建缓存目录。");
    }
}
$hasLoadedFileList = false;
function readFilesList()
{
    $GLOBALS['hasLoadedFileList'] = true;
    if (is_file("cache/list.json.bamboomusic")) {
        $myfile = fopen("cache/list.json.bamboomusic", "r") or send_error("无法读取文件列表。");
        $flength = filesize("cache/list.json.bamboomusic");
        if ($flength > 0) {
            $contentF = fread($myfile, $flength);
        } else {
            $contentF = '[]';
        }
        fclose($myfile);
    } else {
        $contentF = '[]';
    }
    $GLOBALS['filelist'] = json_decode($contentF);
}
if (is_file("cache/idcache.json.bamboomusic")) {
    $myfile = fopen("cache/idcache.json.bamboomusic", "r") or send_error("无法读取ID缓存列表。");
    $flength = filesize("cache/idcache.json.bamboomusic");
    if ($flength > 0) {
        $content = fread($myfile, $flength);
    } else {
        $content = '{"idx":0,"all_ids":[],"cache":{"##TEMP##":-1}}';
    }
    fclose($myfile);
} else {
    $content = '{"idx":0,"all_ids":[],"cache":{"##TEMP##":-1}}';
}
// echo $content;
// return;
$idcaches = json_decode($content);
if (empty($idcaches->cache)) {
    $idcaches = json_decode('{"idx":0,"all_ids":[],"cache":{}}');
    // http_response_code(500);
    // return;
}
if (empty($idcaches->idx)) {
    // http_response_code(500);
    // echo json_encode($idcaches);
    // echo $idcaches->idx;
    // $idcaches = json_decode('{"idx":0,"cache":{}}');
    // return;
    $idcaches->idx = 0;
}
$idcache = json_decode("{}");
// $idcaches_OBJ = (array) json_decode(json_encode($idcaches->cache), true, 512, JSON_OBJECT_AS_ARRAY);

$idcache = $idcaches->cache;
if (empty($idcache)) {
    $idcache = json_decode("{}");
}
$total = 0;

function getId($file, $type = 0)
{
    if (empty($GLOBALS['idcache']->$file)) {
        $idx = $GLOBALS['idcaches']->idx + 1;
        $GLOBALS['idcaches']->idx = $idx;
        if ($type == 2) {
            $GLOBALS['idcaches']->all_ids[] = $idx;
        }
        // if($GLOBALS['idcache']->$file == null)
        $GLOBALS['idcache']->$file = $idx;
        $GLOBALS['idcache']->$idx = $file;
        return $GLOBALS['idcaches']->idx;
    } else {
        return $GLOBALS['idcache']->$file;
    }
}
$pathnames = null;
function loadPathNames()
{
    if (is_file("cache/names.json.bamboomusic")) {
        $myfile = fopen("cache/names.json.bamboomusic", "r") or send_error("无法读取ID缓存列表。");
        $flength = filesize("cache/names.json.bamboomusic");
        if ($flength > 0) {
            $content = fread($myfile, $flength);
        } else {
            $content = '[]';
        }
        fclose($myfile);
        $GLOBALS['pathnames'] = json_decode($content);
    }
}
function getDirAlName($dir)
{
    if ($GLOBALS['pathnames'] == null)
        loadPathNames();
    foreach ($GLOBALS['pathnames'] as $value) {
        $ele = $value;
        $pps = $ele->path;
        if ($dir == $pps) {
            if ($ele->name == "") $ele->name = dirname($pps);
            return $ele->name;
        };
    }
    foreach ($GLOBALS['pathnames'] as $value) {
        $ele = $value;
        $pps = $ele->path;
        if (strstr($dir, $pps)) {
            if ($ele->name == "") $ele->name = dirname($pps);
            return $ele->name;
        };
    }
    return ($dir);
}

function getSongPath($id)
{

    if (empty($GLOBALS['idcache']->$id)) {
        // echo json_encode($GLOBALS['idcache']);
        return false;
    } else {
        return $GLOBALS['idcache']->$id;
    }
}
function saveId()
{
    $GLOBALS['idcaches']->cache = $GLOBALS['idcache'];
    $mywritefile = fopen("cache/idcache.json.bamboomusic", "w") or send_error("无法写入ID缓存列表。");
    fwrite($mywritefile, json_encode($GLOBALS['idcaches']));
    fclose($mywritefile);
}

function randomFile($path, $filter = "*.*", $deepth = 0)
{
    if (!is_dir($path)) {
        // send_error("Unable to scan " . $path);
        return getId($path);
    }
    $result_tmp = array();
    $arr = scandir($path);
    foreach ($arr as $value) {
        //过滤掉当前目录和上级目录
        if ($value !== "." && $value !== "..") {
            //判断是否是文件夹
            $line = json_decode('{"name":"","type":"d"}');
            $line->name = $path . '\\' . $value;
            if (is_dir($path . '\\' . $value)) {
                //getId($path . '\\' . $value, 0);
                $line->type = "d";
                $result_tmp[] = $line;
                //scanAllFile($path . '\\' . $value, $filter, $needtotal, $suggestMode); //继续遍历
            } else {
                if (fnmatch("*.mp3", $value)) if (stristr($value, $filter) != false) if (is_file($path . '\\' . $value)) {
                    $line->type = "f";
                    $result_tmp[] = $line;
                    // $GLOBALS['count'] = $GLOBALS['count'] + 1;
                }
            }
        }
    }
    if ($GLOBALS['seed'] != 0) mt_srand($GLOBALS['seed'] + $deepth * $deepth);

    $rdnum = mt_rand(0, count($result_tmp) - 1);
    $path = $result_tmp[$rdnum];
    $sname = $path->name;
    if ($sname == "" | $sname == null) return 0;
    if ($path->type == "d") {
        return randomFile($sname, $filter, $deepth + 1);
    } else {
        return getId($sname, 2);
    }
}
$local_files = array();
function scanAllFile_cache($path)
{
    // 初始化文件列表
    if (!is_dir($path)) {
        // send_error("Unable to scan " . $path);
        return;
    }
    $result = array();
    $arr = scandir($path);
    $cover = -1;
    if (file_exists($path . '\\cover.jpg')) {
        $cover = getId($path . '\\cover.jpg', 1);
    } else if (file_exists($path . '\\cover.png')) {
        $cover = getId($path . '\\cover.png', 1);
    }
    foreach ($arr as $value) {
        //过滤掉当前目录和上级目录
        if ($value !== "." && $value !== "..") {
            //判断是否是文件夹
            if (is_dir($path . '\\' . $value)) {
                getId($path . '\\' . $value, 0);
                $tresult = scanAllFile_cache($path . '\\' . $value); //继续遍历
                $pid = 's' . getId(trim($path . '\\' . $value));
                $GLOBALS['result_tmp']->$pid =  $tresult;
                $file = new localfileinfo();
                $file->path = $value;
                $file->type = 1;
                $result[] = $file;
            } else {
                $flag = false;
                if (fnmatch("*.mp3", $path . '\\' . $value)) $flag = true;
                // if (!$flag) if (fnmatch("*.mp4", $path . '\\' . $value)) $flag = true;
                if (!$flag)
                    continue;
                getId($path . '\\' . $value, 2);
                $file = new localfileinfo();
                $file->path = $value;
                $file->type = 0;
                $file->cover = $cover;
                $result[] = $file;
            }
        }
    }
    return $result;
}
$result_tmp = null;
function reflushLocalCache()
{
    $GLOBALS['result_tmp'] = json_decode('{}');
    $GLOBALS['idcaches'] = json_decode('{"idx":0,"all_ids":[],"cache":{}}');
    $GLOBALS['idcaches']->cache = json_decode('{}');
    $GLOBALS['idcache'] = json_decode('{}');
    $file = fopen("cache/location.txt.bamboomusic", "r");
    while (!feof($file)) {
        $GLOBALS['local_files'] = array();
        $path = fgets($file);
        $tpath = trim($path);

        if (is_dir(trim($tpath))) {
            $pid = 's' . getId(trim($tpath));
            $GLOBALS['result_tmp']->$pid = scanAllFile_cache(trim($tpath));
        }
    }
    fclose($file);
    saveId();
    $mywritefile = fopen("cache/list.json.bamboomusic", "w") or send_error("无法写入文件缓存列表。");
    fwrite($mywritefile, json_encode($GLOBALS['result_tmp']));
    fclose($mywritefile);
}
function scanDirI($pathid)
{
    if (!$GLOBALS['hasLoadedFileList']) {
        readFilesList();
    }
    $pathids = 's' . $pathid;
    return $GLOBALS['filelist']->$pathids;
}
function scanAllFile($spath, $filter = "*.*", $needtotal = true, $suggestMode = false)
{
    if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit'])) {
        // return;
        return;
    }
    if (!is_dir($spath)) {
        // send_error("Unable to scan " . $path);
        return;
    }
    $tpath = getSongPath($spath);
    $arr = scanDirI($tpath);
    for ($sidx = 0; $sidx < count($arr); $sidx++) {
        //过滤掉当前目录和上级目录
        $nowp = $arr[$sidx];
        $type = $nowp->type;
        $cover = $nowp->cover;
        $path = $spath;
        $value = $nowp->path;
        if ($value !== "." && $value !== "..") {
            //判断是否是文件夹
            if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit']))
                return;
            if ($type == 1) {
                // getId($path . '\\' . $value, 0);
                scanAllFile($path . '\\' . $value, $filter, $needtotal, $suggestMode); //继续遍历
            } else {
                // getDirAlName
                $flag = false;
                if (fnmatch("*.mp3", $value)) $flag = true;
                if ($flag) {
                    if (stristr($value, $filter) != false) {
                        if (searchSuba($path, $value, $cover)) {
                            return;
                        };
                    } else if (stristr(basename($path), $filter) != false) {
                        if (searchSuba($path, $value, $cover)) {
                            return;
                        };
                    } else if (stristr(getDirAlName(dirname($path . '\\' . $value)), $filter) != false) {
                        if (searchSuba($path, $value, $cover)) {
                            return;
                        };
                    }
                }
            }
        }
    }
}
function searchSuba($path, $value, $cover = -1)
{
    if (is_file($path . '\\' . $value)) {
        $GLOBALS['total'] += 1;
        $GLOBALS['count'] += 1;
        if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit'])) {
            return true;
        } else if ($GLOBALS['count'] <= ($GLOBALS['page']) * ($GLOBALS['limit'])) {
            // echo $GLOBALS['count'] . '|' . ($GLOBALS['page'] + 1) * ($GLOBALS['limit']) . '<br/>';
            // getId($path . '\\' . $value, 2);
            return false;
        }
        // echo $value . '<br/>';
        $file = new fileinfo();
        $filename = str_replace(strrchr($value, "."), "", $value);
        $file->filename = $filename;
        $file->path = $path . '\\' . $value;
        $file->cover = $cover;
        $file->id = getId($path . '\\' . $value, 2);
        $GLOBALS['files'][] = $file;
        // $GLOBALS['count'] = $GLOBALS['count'] + 1;
    }
    return false;
}
