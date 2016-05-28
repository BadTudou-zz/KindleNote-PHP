<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	download.php
	By		:	BadTudou
	Date	:	2016年03月26日
	Note	:	实现文件下载功能
*/
function downloadMD($fileID)
{
	$filename = $fileID.'.markdown';
	header('Content-type: application/markdown'); 
	header('Content-Disposition: attachment; filename="'.$filename.'"');
	readfile('../note/markdown/'.$filename); 
}
if (isset($_REQUEST['fileID']))
{
	downloadMD($_REQUEST['fileID']);
}
?>