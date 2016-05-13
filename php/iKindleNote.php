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

	//打开笔记文件
	$fnote = fopen('../note/input/My Clippings.txt', 'r+');
	if ($fnote == false)
	{
		echo 'open file error';
	}

	//读取所有笔记
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
				$note['date'] = $note_data;
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

	//整理合并笔记
	$title = array();
	foreach ($arNote as $key=> $value) 
	{
		$title[$key] = $value['title'];
	}
	array_multisort($title, SORT_STRING, $arNote, SORT_ASC);
	$currentTitle = $arNote[0]['title'];
	$aKindleNote = array();
	$aKindle = array();
	$i =0;
	$aKindle['title'] = $currentTitle;
	strtok($arNote[0]['date'], '|');
	$aKindle['date'] = strtok('|');
	$aKindle['note'] ='';
	$aKindleNote[$i]= $aKindle;

	foreach ($arNote as $key=> $value) 
	{
		if ($value['title'] != $currentTitle)
		{
			$i++;
			strtok($value['date'], '|');
			$aKindle['date'] = strtok('|');
			$aKindle['title'] = $value['title'];
			$aKindle['note'] = $value['note'];
			$aKindleNote[$i] = $aKindle;
			$currentTitle = $value['title'];
			
		}
		else
		{
			if (strrpos($value['date'], '-') != 0)
			{
				$aKindleNote[$i]['note'] .= '笔记'.$value['note'].'<br/>';
			}
			else
			{
				$aKindleNote[$i]['note'] .= $value['note'].'<br/>';

			}
		}
		
		
		
		
	}
	print_r($aKindleNote);
?>