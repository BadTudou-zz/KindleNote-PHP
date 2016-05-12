<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	iKindleNote.php
	By		:	BadTudu
	Date	:	2016年5月12日17:08:05
	Note	:	读取Kindle的笔记文件
*/
	define('SPITMARK', "==========");
	header("Content-type: text/html; charset=utf-8");
	$fnote = fopen('../note/input/My Clippings.txt', 'r+');
	if ($fnote == false)
	{
		echo 'open file error';
	}
	$arNote = array();
	$line = fgets($fnote);
	while ($line  !== false)
	{
		$note = array();
		$note_title = fgets($fnote);
		$note_data = fgets($fnote);
		$note_txt = '';
		while ( ($line = fgets($fnote)) !== false)
		{
			if (mb_substr($line,0,10) === SPITMARK)
			{
				$note['title'] = $note_title;
				$note['data'] = $note_data;
				$note['note'] = $note_txt;
				array_push($arNote, $note);
				break;
			}
			else if ($line != '')
			{
				$note_txt .= $line;
			}
		}
	}
	$title = array();
	foreach ($arNote as $key=> $value) 
	{
		$title[$key] = $value['title'];
	}
	array_multisort($title, SORT_STRING, $arNote, SORT_ASC);
	$currentTitle = $arNote[0]['title'];
	echo '<h2>'.$currentTitle.'</h2><br/>';
	foreach ($arNote as $key=> $value) 
	{
		if ($value['title'] != $currentTitle)
		{
			echo '<h2>'.$value['title'].'</h2><br/>';			
			$currentTitle = $value['title'];
		}
		$s  = strtok($value['data'], '|');
		//echo strtok('|').'<br/>';
		if (strrpos($value['data'], '-') != 0)
		{
			echo '<li><b>'.$value['note'].'</b></li><br/>';
		}
		else
		{
			echo '<li>'.$value['note'].'</li><br/><br/>';

		}
		
	}
?>