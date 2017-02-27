[TOC]
# [KindleNote][kindlenote]
![KindleNote主页截图][img-kindlenote]
## 简介 ##

[KindleNote][kindlenote]是一款基于PHP环境的Kindle笔记导出工具。[KindleNote][kindlenote] 可以使你 [KindleNote][kindlenote] 阅读器中的笔记变得更易阅读。

我们通过对 [KindleNote][kindlenote]的笔记文件进行整理、分析，使得笔记片段合并为完整笔记。
    
你可以用 [KindleNote][kindlenote] 将你的笔记导出为 **HTML** 或者 **MarkDown**。

## 特色 ##

+ 自动合并笔记片段
+ 自动按笔记排序，支持笔记查找
+ 离线模式，另存为HTML即可在无网络状态下使用
+ MarkDown导出

## 使用方法 ##
您可以直接使用他人搭建的KindleNote，或者选择自行搭建。
### 在服务器中安装KindleNote ###
安装PHP环境（5.6以上），部署KindleNote项目文件
### 在浏览器中访问远程地址 ###
若在本地启用PHP服务器
`
	php -S localhost:8080
`
则访问
`
	localhost:8080
`
非本地启用PHP，则访问部署的服务器地址
### 笔记解析 ###
1. 打开[KindleNote][kindlenote]
2. 连接Kindle至电脑，进入USB模式
3. 进入Kindle的磁盘，上传 Kindle盘符:\documents\My Clippings.txt文件
4. 等待程序对笔记文件进行处理，完成

## 截图 ##
原文件

![笔记原文件][img-kindlenote-notefile]

HTML笔记列表

![笔记列表][img-kindlenote-notelist]

HTML笔记内容

![笔记内容][img-kindlenote-notetext]

MarkDown文件

![MarkDown文件][img-kindlenote-markdown]

MarkDown笔记列表

![MarkDown笔记列表][img-kindlenote-markdownlist]

MarkDown笔记内容

![MarkDown笔记内容][img-kindlenote-markdownnote]

## 离线模式 ##
![单击鼠标右键][img-guide-mouse]

1.**单击**鼠标右键
    
![选择'另存为'][img-guide-saveas]

2.选择 **'另存为'**
    
![保存为'网页，全部'][img-guide-allweb]

3.保存为 **'网页、全部'**

## 最新版本截图 ##
![最新版本截图][img-kindlenote-latest]

## 帮助 ##
免费开源KindleNote。

QQ群号 : **[565752585][kindlenote-QQgroup]**

Email:  badtudou@qq.com

GitHub: [KindleNote][kindlenote-GitHub]

[kindlenote]: http://www.badtudou.com/ "你的Kindle笔记，我懂"

[kindlenote-QQgroup]: http://jq.qq.com/?_wv=1027&k=27JudDz "点击链接加入群【KindleNote】"

[kindlenote-GitHub]:https://github.com/BadTudou/KindleNote "https://github.com/BadTudou/KindleNote"

[img-kindlenote]:https://raw.githubusercontent.com/BadTudou/KindleNote/0fea7f551aff910bb50a8ded431e13d9c5c30823/demo/homepage.png "KindleNote主页"

[img-kindlenote-latest]:https://raw.githubusercontent.com/BadTudou/KindleNote/aa730f05656cf8b47d12ca09c223fa00839f5358/demo/homepage-latest.png "最新版本截图"

[img-kindlenote-notelist]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/notelist.png "笔记列表"

[img-kindlenote-notetext]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/notetext.png "笔记内容"

[img-kindlenote-markdown]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/MarkDown.png "MarkDown文件"
[img-kindlenote-markdownlist]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/MarkDown-list.png "MarkDown笔记列表"

[img-kindlenote-markdownnote]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/MarkDown-note.png "MarkDown笔记内容"
[img-kindlenote-notefile]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/demo/notefile.png "笔记文件"

[img-guide-mouse]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/images/guide/mouse.png "单击鼠标右键"

[img-guide-saveas]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/images/guide/saveas.png "另存为"

[img-guide-allweb]:https://raw.githubusercontent.com/BadTudou/KindleNote/master/images/guide/allweb.png "保存为'网页，全部'"