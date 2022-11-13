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
        $content = '{"idx":0,"cache":{}}';
    }
    fclose($myfile);
} else {
    $content = '{"idx":0,"cache":{}}';
}
$idcaches = json_decode($content);
if (empty($idcaches->cache))
    $idcaches = json_decode('{"idx":0,"cache":{},"cacheO":{}}');
if (empty($idcaches->idx))
    $idcaches = json_decode('{"idx":0,"cache":{},"cacheO":{}}');
$idcache = $idcaches->cache;
$idcacheO = $idcaches->cacheO;
$total = 0;

function getId($file, $type = 0)
{
    if (empty($GLOBALS['idcache']->$file)) {
        $idx = $GLOBALS['idcaches']->idx + 1;
        $GLOBALS['idcaches']->idx = $idx;
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
    $mywritefile = fopen("idcache.json", "w") or send_error("Unable to write file!");
    fwrite($mywritefile, json_encode($GLOBALS['idcaches']));
    fclose($mywritefile);
}
function scanAllFile($path, $filter = "*.*", $needtotal = true)
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
                getId($path . '\\' . $value, 1);
                scanAllFile($path . '\\' . $value, $filter, $needtotal); //继续遍历
            } else if (fnmatch("*.mp3", $value)) if (stristr($value, $filter) != false) if (is_file($path . '\\' . $value)) {
                $GLOBALS['total'] += 1;
                $GLOBALS['count'] += 1;
                if ($GLOBALS['count'] > ($GLOBALS['page'] + 1) * ($GLOBALS['limit'])) {

                    if (!$needtotal) return;
                    continue;
                } else if ($GLOBALS['count'] <= ($GLOBALS['page']) * ($GLOBALS['limit'])) {
                    // echo $GLOBALS['count'] . '|' . ($GLOBALS['page'] + 1) * ($GLOBALS['limit']) . '<br/>';
                    continue;
                }
                // echo $value . '<br/>';
                $file = new fileinfo();
                $filename = str_replace(strrchr($value, "."), "", $value);
                $file->filename = $filename;
                $file->path = $path . '\\' . $value;

                $file->id = getId($path . '\\' . $value, 0);
                $GLOBALS['files'][] = $file;
                // $GLOBALS['count'] = $GLOBALS['count'] + 1;
            }
        }
    }
}
