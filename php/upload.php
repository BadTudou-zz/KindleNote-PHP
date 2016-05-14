<?php
	header("Content-type: text/html; charset=utf-8"); 
	if (isset($_FILES['files']))
	{
		$conf = json_decode(file_get_contents('../conf/conf.json'), true);
		$conf['note']++;
		file_put_contents('../conf/conf.json', json_encode($conf));
		//$name = $_FILES['files']['name'][0];
		$tmp_name = $_FILES['files']['tmp_name'][0];
		move_uploaded_file($tmp_name, '../note/input/'.$conf['note'] .'.txt');
		echo 'ok'.$conf['note'];
	}
?>