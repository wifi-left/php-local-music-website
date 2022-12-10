<?php
class fileinfo
{
    public $filename = "";
    public $path = "";
    public $id = 0;
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
if (is_file("idcache.json")) {
    $myfile = fopen("idcache.json", "r") or send_error("Unable to open file!");
    $flength = filesize("idcache.json");
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
    $mywritefile = fopen("idcache.json", "w") or send_error("Unable to write file!");
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
function scanAllFile($path, $filter = "*.*", $needtotal = true, $suggestMode = false)
{
    if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit'])) {
        // return;
        if (!$needtotal) return;
    }
    if (!is_dir($path)) {
        // send_error("Unable to scan " . $path);
        return;
    }
    $arr = scandir($path);
    foreach ($arr as $value) {
        //过滤掉当前目录和上级目录
        if ($value !== "." && $value !== "..") {
            //判断是否是文件夹
            if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit']))
                if (!$needtotal)
                    return;
            if (is_dir($path . '\\' . $value)) {
                getId($path . '\\' . $value, 0);
                scanAllFile($path . '\\' . $value, $filter, $needtotal, $suggestMode); //继续遍历
            } else {
                if (fnmatch("*.mp3", $value)) if (stristr($value, $filter) != false) if (is_file($path . '\\' . $value)) {
                    $GLOBALS['total'] += 1;
                    $GLOBALS['count'] += 1;
                    if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit'])) {

                        if (!$needtotal) return;
                        getId($path . '\\' . $value, 2);
                        continue;
                    } else if ($GLOBALS['count'] <= ($GLOBALS['page']) * ($GLOBALS['limit'])) {
                        // echo $GLOBALS['count'] . '|' . ($GLOBALS['page'] + 1) * ($GLOBALS['limit']) . '<br/>';
                        getId($path . '\\' . $value, 2);
                        continue;
                    }
                    // echo $value . '<br/>';
                    $file = new fileinfo();
                    $filename = str_replace(strrchr($value, "."), "", $value);
                    $file->filename = $filename;
                    $file->path = $path . '\\' . $value;

                    $file->id = getId($path . '\\' . $value, 2);
                    $GLOBALS['files'][] = $file;
                    // $GLOBALS['count'] = $GLOBALS['count'] + 1;
                }
            }
        }
    }
}
