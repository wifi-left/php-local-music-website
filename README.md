# 介绍

PHP + HTML 做的在线音乐存储库。

不支持账号，目前仅支持听歌。

# 安装

PHP 扩展请开启 CURL，建议使用 PHP 8 版本（已测试）

# 配置

修改本地音乐存储地址：`/apis/cache/location.txt`

一行一个地址，会自动搜索子目录。

ID 缓存地址：`/apis/cache/idcache.json`

# 支持的音乐

目前仅硬编码支持枚举 MP3（如果要支持其他类型请自行在 `/apis/listfiles.php` 修改）。

歌词仅支持和歌曲同名的 `.lrc` 文件。（会自动读取）

# 客户端配置

存储在 LocalStorage 中。网页大部分设置可以在网页上的设置页面中修改。

# 引用

**gQuery** by Ganxiaozhe

**ace.js** by ajaxorg (代码编辑器)
