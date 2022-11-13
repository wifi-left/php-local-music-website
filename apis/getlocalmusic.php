<?php
include("./listfiles.php");
if (empty($_GET['id'])) {
    http_response_code(403);
    return;
}
$value = $_GET['id'];
$res = getSongPath($value);
if ($res == false) {
    echo '{"code":404,"msg":"404 - 此歌曲不存在"}';
    http_response_code(404);
    return;
}
// echo $res;
if (!is_file($res)) {
    echo '{"code":404,"msg":"404 - 此歌曲不存在"}';
    http_response_code(404);
    return;
}

// 文件名
$filename = $res;

// 文件路径
$location = $res;

// 后缀
$extension = substr(strrchr($res, '.'), 1);
$mimeType = "audio/mpeg";
if ($extension == "mp3") {
    $mimeType = "audio/mpeg";
} else if ($extension == "ogg") {
    $mimeType = "audio/ogg";
} else if ($extension == "mp4") {
    $mimeType = "audio/mp4";
}

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

while (!feof($fm) && $cur <= $end && (connection_status() == 0)) {
    print fread($fm, min(1024 * 16, ($end - $cur) + 1));
    $cur += 1024 * 16;
}
