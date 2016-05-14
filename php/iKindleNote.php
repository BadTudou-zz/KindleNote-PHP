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
	require_once('LIB.php');
	function CreateNote(string $notetitle)
	{
		//打开笔记文件
		$fnote = fopen('../note/input/'.$notetitle.'.txt', 'r+');
		//读取所有笔记
		$arNote = array();
		$line = fgets($fnote);
		while ($line  !== false)
		{
		$note = array();
		for ($j=0; $j < 2; $j++) 
		{ 
			$tmp = trim(fgets($fnote));
			if ($tmp == false)
			{
				break;
			}
			if (strlen($tmp) == 0)
			{ 
				$j--;
				continue;
			}
			if ($j == 0)
			{
				$note_title = $tmp;
			}
			if ($j == 1)
			{
				$note_data= $tmp;
			}
		}
		/*$note_title = fgets($fnote);
		$note_data = fgets($fnote);*/
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
	$posBegin = strrpos($currentTitle,'(');
	$posEnd = strrpos($currentTitle,')');
	if ($posBegin == false)
	{
		$aKindle['title'] = $currentTitle;
		$aKindle['author'] ='';
	}
	else
	{
		$aKindle['title'] = substr($currentTitle,0,$posBegin);
		$aKindle['author'] = substr($currentTitle,$posBegin+1, $posEnd-$posBegin-1);	
	}
	
	strtok($arNote[0]['date'], '|');
	$aKindle['date'] = strtok('|');
	$aKindle['note'] ='';
	$aKindleNote[$i]= $aKindle;
	foreach ($arNote as $key=> $value) 
	{
		if ($value['title'] != $currentTitle)
		{
			$i++;
			$posBegin = strrpos($value['title'], '(');
			$posEnd = strrpos($value['title'], ')');
			strtok($value['date'], '|');
			$aKindle['date'] = strtok('|');
			if ($posBegin == false)
			{
				$aKindle['title'] = $value['title'];
				$aKindle['author'] = '无作者';
			}
			else
			{
				$aKindle['title'] = substr($value['title'], 0, $posBegin);
				$aKindle['author'] = substr($value['title'],$posBegin+1, $posEnd-$posBegin-1);	
			}
			
			$aKindleNote[$i] = $aKindle;
			//file_put_contents('note.json',','.json_encode($aKindle), FILE_APPEND);
			$currentTitle = $value['title'];
			
		}
		if (strrpos($value['date'], '-') != 0)
		{
			$aKindleNote[$i]['note'] .= (''.$value['note'].'<br/>');
		}
		else
		{
			$aKindleNote[$i]['note'] .= ('<b>'.$value['note'].'</b><br/>');
		}	
	}
	$fjson = fopen('../note/output/'.$notetitle.'.json','x+');
	fclose($fjson);
	file_put_contents('../note/output/'.$notetitle.'.json','[');
	$i =0;
	foreach ($aKindleNote as $key => $value) 
	{

		if (json_encode($value) != '')
		{
			file_put_contents('../note/output/'.$notetitle.'.json', json_encode($value), FILE_APPEND);
			if ($key != count($aKindleNote)-1)
			{
				file_put_contents('../note/output/'.$notetitle.'.json',','."\n", FILE_APPEND);	
			}
		}
		$i++;
		
			//
	}
	file_put_contents('../note/output/'.$notetitle.'.json',']', FILE_APPEND);
}

function GetNoteCount()
{
	$conf = json_decode(file_get_contents('../conf/conf.json'), true);
	return $conf['note'];
}

if (isset($_POST['action']))	
{
	$action = $_POST['action'];
	switch ($action) 
	{
		case 'createnote':
			CreateNote();
			# code...
			break;
		case 'getnotelist':
			$ti = $_POST['title'];
			CreateNote($ti);
			$arNote = array();
			$arNote = json_decode(file_get_contents('../note/output/'.$ti.'.json'), true);
			$arTitle = array();
			$arTitle2 = array();
			/*foreach ($arNote as $key => $value) 
			{
				$arTitle['title'] = $value['title'];
				$arTitle['author'] = $value['author'];	
				$arTitle2[$key] = $arTitle;
			}*/
			$arTitle2['title'] = 'test';
			$arTitle2['author'] ='author';
			echo json_encode($arNote);
			
			break;
		case 'getnotecount':
			SendRespond(0,GetNoteCount());
			break;
		default:
			# code...
			break;
	}
}
?>