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
		//读取单个笔记内容
		$artmpstring = array();
		$tmpstring = array();
		mb_internal_encoding("UTF-8");
		while ( ($line = fgets($fnote)) !== false)
		{
			if (mb_substr($line,0,10) !== SPITMARK)
			{
				array_push($tmpstring, trim($line));
			}
			else
			{
				array_push($artmpstring, $tmpstring);
				$tmpstring = array();
			}
		}
		//提取单个笔记片段与所有笔记标题
		$artitle = array();
		$arnotepart = array();
		foreach ($artmpstring as $key => $value) 
		{
			$tmpnotepart = array();
			$tmpnotepart['title'] = $value[0];
			$tmpnotepart['date'] = $value[1];
			unset($value[0]);
			unset($value[1]);
			$tmpnotepart['note'] = implode($value);
			if (strlen(trim($tmpnotepart['note'])) != 0)
			{
				array_push($arnotepart, $tmpnotepart);
				array_push($artitle, $tmpnotepart['title']);
			}
			else
			{
				/*echo $tmpnotepart['title'].'has no note<br/>';*/
			}
		}
		
		//提取无重复的笔记标题
		asort($artitle, SORT_STRING);
		array_multisort($artitle, SORT_STRING, $arnotepart, SORT_ASC);

		//合并笔记片段为完整笔记
		$arNotes = array();
		$currentTitle = '';
		$artmp = array();
		$artmp['title'] = '';
		$artmp['date'] = '';
		$artmp['note'] = '';
		foreach (array_unique($artitle) as $key => $value) 
		{
			$arNotes[$value] = $artmp;
		}
		foreach ($arnotepart as $key => $value) 
		{
			if (strlen(trim($value['note'])) != 0)
			{
				if ($currentTitle === $value['title'])
				{
					$arNotes[$value['title']]['note'] .= ("<div class='test'>".$value['note'].'</div>');
				}
				else
				{
					$currentTitle = $value['title'];
					$arNotes[$value['title']]['title'] = $value['title'];
					$arNotes[$value['title']]['date'] = $value['date'];
					$arNotes[$value['title']]['note'] .= "<div class='test'>".$value['note'].'</div>';
				}
			}
		}
		$fjson = fopen('../note/output/'.$notetitle.'.json','x+');
		fclose($fjson);
		file_put_contents('../note/output/'.$notetitle.'.json',json_encode($arNotes));
		$fmakedown = fopen('../note/markdown/'.$notetitle.'.markdown','x+');
		fclose($fmakedown);
		foreach ($arNotes as $key => $value) 
		{
			$title = '# '.$value['title']. " #\n";
			$date = '###' .$value['date']. " ###\n";
			$note = str_replace("<div class='test'>", '+ ',$value['note']);
			$note = str_replace('</div>', " \n",$note);
			file_put_contents('../note/markdown/'.$notetitle.'.markdown', "\n***\n".$title.$date.$note, FILE_APPEND );
		}

}

function GetNoteCount()
{
	$conf = json_decode(file_get_contents('../conf/conf.json'), true);
	return $conf['note'];
}

function ReportError(string $noteid, string $qq)
{
	$er = array();
	$er['id'] = $noteid;
	$er['qq'] = $qq;
	file_put_contents('../note/error_log.json',json_encode($er).",\n", FILE_APPEND);
}



if (isset($_POST['action']))	
{
	$action = $_POST['action'];
	switch ($action) 
	{
		case 'reporterror':
			$noteid = $_POST['noteid'];
			$qq = $_POST['qq'];
			ReportError($noteid, $qq);
			SendRespond(0, '你的反馈已经提交，我会尽快与你联系');
			# code...
			break;
		case 'getnotelist':
			$ti = $_POST['title'];
			CreateNote($ti);
			echo file_get_contents('../note/output/'.$ti.'.json');			
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