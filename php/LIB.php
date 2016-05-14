<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	LIB.php
	By		:	BadTudu
	Date	:	2016年5月03日16:56:05
	Note	:	函数库
*/
	function SendRespond(int $stateCode, string $msgText)
	{
		echo json_encode(array('stateCode' =>$stateCode, 'msgText' =>$msgText));
	}
?>