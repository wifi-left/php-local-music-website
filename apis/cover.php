<?php
include("./listfiles.php");
$interval=12000; //200分钟
if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])){
    // HTTP_IF_MODIFIED_SINCE即下面的: Last-Modified,文档缓存时间.
    // 缓存时间+时长.
    $c_time = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'])+$interval;
    // 当大于当前时间时, 表示还在缓存中... 释放304
    if($c_time > time()){
        header('HTTP/1.1 304 Not Modified');
        exit();
    }
}
header('Cache-Control:max-age='.$interval);
header("Expires: " . gmdate("D, d M Y H:i:s",time()+$interval)." GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

if (empty($_GET['id'])) {
    http_response_code(403);
    return;
}
$type = "img";
$value = $_GET['id'];
$res = getSongPath($value);
if ($res == false) {
    echo '{"code":404,"msg":"404 - 图片不存在"}';
    http_response_code(404);
    return;
}
// echo $res;


// 文件名
$filename = $res;
$location = $res;
// 文件路径

if (!is_file($location)) {
    echo '{"code":404,"msg":"404 - 图片不存在"}';
    http_response_code(404);
    return;
}
// 后缀

$extension = substr(strrchr($location, '.'), 1);
if($extension!='png' && $extension!='jpg'){
    echo '{"code":404,"msg":"404 - 图片不存在"}';
    http_response_code(404);
    return;
}
$mimeType = "image/" . $extension;
//; charset=gb2312
$size = filesize($location);
$time = date('r', filemtime($location));

$fm = @fopen($location, 'rb');
if (!$fm) {
    echo '{"code":500,"msg":"500 - Runtime Error"}';
    http_response_code(500);
    return;
}

$begin = 0;
$end = $size - 1;

if (isset($_SERVER['HTTP_RANGE'])) {
    if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
        // 读取文件，起始节点
        $begin = intval($matches[1]);

        // 读取文件，结束节点
        if (!empty($matches[2])) {
            $end = intval($matches[2]);
        }
    }
}

// writeover("mv2/qq.txt",$begin." - ".$end."\r\n",'ab+');


if (isset($_SERVER['HTTP_RANGE'])) {
    header('HTTP/1.1 206 Partial Content');
} else {
    header('HTTP/1.1 200 OK');
}
if ($mimeType != "text/plain")
    header("Content-Type: $mimeType");
header('Cache-Control: public, must-revalidate, max-age=1000');
// header('Pragma: no-cache');
header('Accept-Ranges: bytes');
header('Content-Length:' . (($end - $begin) + 1));

if (isset($_SERVER['HTTP_RANGE'])) {
    header("Content-Range: bytes $begin-$end/$size");
}

// header("Content-Disposition: inline; filename=$filename");
// header("Content-Transfer-Encoding: binary");
header("Last-Modified: $time");

//$begin++;  如果不读取第一个字节
$cur = $begin;

// 定位指针
fseek($fm, $begin, 0);
function isUTF8($str)
{
    if ($str === mb_convert_encoding(mb_convert_encoding($str, "UTF-32", "UTF-8"), "UTF-8", "UTF-32")) {
        return true;
    } else {
        return false;
    }
}
while (!feof($fm) && $cur <= $end && (connection_status() == 0)) {
    $tmp = fread($fm, min(1024 * 16, ($end - $cur) + 1));
    if ($mimeType == "text/plain") {
        if (!isUTF8($tmp))
            $mimeType .= '; charset=gb2312';
        else {
            $mimeType .= '; charset=utf-8';
        }
        header("Content-Type: $mimeType");
    }
    print $tmp;
    $cur += 1024 * 16;
}
