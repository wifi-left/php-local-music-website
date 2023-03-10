<?php
class lryicline
{
    public $time = 0.0;
    public $lineLyric = "";
}
function timeToTime($time)
{
    return date("Y-m-d", $time / 1000);
}
function mergeTranslate($ori, $tran)
{
    if (count($tran) <= 0) return $ori;
    if (count($ori) <= 0) return $tran;
    $result = array();
    for ($i = 0; $i < count($ori); $i++) {
        $newlrc = $ori[$i];
        $result[] = $newlrc;
        $tmp = findLrcByTime($tran, $ori[$i]->time);
        if ($tmp != "") {
            if ($i + 1 < count($ori)) {
                $newlrc = new lryicline();
                $newlrc->time = $ori[$i + 1]->time;
                $newlrc->lineLyric = $tmp;
                $result[] = $newlrc;
            } else {
                $newlrc = new lryicline();
                $newlrc->time = $ori[$i]->time + 10.0;
                $newlrc->lineLyric = $tmp;
                $result[] = $newlrc;
            }
        }
    }
    return $result;
}
function findLrcByTime($lrc, $time)
{
    for ($i = 0; $i < count($lrc); $i++) {
        if ($lrc[$i]->time == $time) {
            return $lrc[$i]->lineLyric;
        } else if ($lrc[$i]->time > $time) {
            return "";
        }
    }
}
function LRCTOOBJ($lrc)
{
    $lrc = str_replace("\r", "", $lrc);
    $arr = explode("\n", $lrc);
    //echo json_encode($arr);
    $timearr = array();
    for ($i = 0; $i < count($arr); $i++) {
        $nowline = $arr[$i];
        $timeend = stripos($nowline, "]");
        $textstart = $timeend + 1;
        $time = timetosecond(substr($nowline, 1, $timeend - 1));
        if($time <= -1) continue;
        $text = (substr($nowline, $textstart));
        $newlrc = new lryicline();
        $newlrc->time = $time;
        $newlrc->lineLyric = $text;
        $timearr[] = $newlrc;
        //echo json_encode($newlrc);
    }
    return $timearr;
}
function timetosecond($time)
{
    $hour = 0;
    $minute = 0;
    $second = 0;
    $arr = explode(":", $time);
    if (count($arr) == 1) {
        $second = (float)$arr[0];
    } else if (count($arr) == 2) {
        $second = (float)$arr[1];
        $minute = (int)$arr[0];
    } else {
        $second = (float)$arr[2];
        $minute = (int)$arr[1];
        $hour = (int)$arr[0];
    }
    $seconds = $hour * 3600 + $minute * 60 + $second;
    return $seconds;
}
function fetchURL($url, $ispost = false, $postcontent = "")
{
    //echo $url;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Cache-Control: no-cache"));
    curl_setopt($ch, CURLOPT_COOKIE, "NMTID=00OTrNMnhnWaFznwESKkN7usch8O14AAAGDKs_klA;");
    if ($ispost) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postcontent);
    }
    $output = curl_exec($ch);
    // echo json_encode(curl_getinfo($ch));
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($output === false) {
        if (in_array(intval(curl_errno($ch)), [7, 28], true)) {
            echo '{"success":"fail","msg":"连接超时，请重试。","code":3}';
            return false;
            //超时的处理代码
        } else if (in_array(intval(curl_errno($ch)), [3], true)) {
            echo '{"success":"fail","msg":"C++ CURL 不支持的 URL：' . $url . '","code":4}';
        } else {
            echo '{"success":"fail","msg":"[' . curl_errno($ch) . '] ' . curl_strerror(curl_errno($ch)) . '; ' . curl_error($ch) . '","code":4}';
            return false;
        }
    }
    if ($httpCode >= 400 && $httpCode < 404) {
        echo '{"success":"fail","msg":"无法访问该文件，请联系站点管理员。","code":5}';
        return false;
    } else if ($httpCode >= 404 && $httpCode < 500) {
        echo '{"success":"fail","msg":"服务器无法找到文件。","code":5}';
        return false;
    } else if ($httpCode >= 500) {
        echo '{"success":"fail","msg":"服务器发生错误，请稍后重试。(Http Status:' . $httpCode . ')","code":6}';
        return false;
    }
    curl_close($ch);
    return $output;
}
