<?php
Header("content-type: text/json", true);
if (empty($_GET['url'])) {
    echo '{"success":"fail","message":"缺少请求参数。","code":1}';
    return;
}
$url = $_GET['url'];
$url = (base64_decode($url));
// $url = str_replace("\~", "%7E", $url);
$headers = "";
if (!empty($_GET['headers'])) {
    $headers = $_GET['headers'];
}
$headers = base64_decode($headers);
$flag = false;
$info = $_SERVER;
if (strpos($url, "://" . ($info['SERVER_NAME'])) != FALSE) $flag = true;
if (!$flag) {
    echo '{"success":"fail","message":"URL 不在白名单内。","code":2}';
    return;
}
$header = ($headers);
$ch = curl_init();
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);
curl_setopt($ch, CURLOPT_COOKIE, "kw_token=" . $header);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
// echo json_encode(curl_getinfo($ch));
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if ($output === false) {
    if (in_array(intval(curl_errno($ch)), [7, 28], true)) {
        echo '{"success":"fail","msg":"连接超时，请重试。","code":3}';
        return;
        //超时的处理代码
    } else if (in_array(intval(curl_errno($ch)), [3], true)) {
        echo '{"success":"fail","msg":"C++ CURL 不支持的 URL：' . $url . '","code":4}';
    } else {
        echo '{"success":"fail","msg":"[' . curl_errno($ch) . '] ' . curl_strerror(curl_errno($ch)) . '; ' . curl_error($ch) . '","code":4}';
        return;
    }
}
if ($httpCode >= 400 && $httpCode < 404) {
    echo '{"success":"fail","msg":"无法访问该文件，请联系站点管理员。","code":5}';
    return;
} else if ($httpCode >= 404 && $httpCode < 500) {
    echo '{"success":"fail","msg":"服务器无法找到文件。","code":5}';
    return;
} else if ($httpCode >= 500) {
    echo '{"success":"fail","msg":"服务器发生错误，请稍后重试。(Http Status:' . $httpCode . ')","code":6}';
    return;
}
curl_close($ch);
$html = $output;
echo $html;
