var jsonnote;
var noteid;

function GetNoteList(title)
{
	var d = dialog(
	{
    	title: '处理中',
    	content: '正在获取笔记列表，请稍候',
    	cancel: false,
    	ok: function () {}
	});
	d.show();

	$.ajax({
		url: 'php/ikindlenote.php',
		type: 'POST',
		dataType: 'JSON',
		data: {action: 'getnotelist',title: title},
	})
	.done(function(json) 
	{
		d.close().remove();
		json.sort();
		$('#notelist').empty();
		jsonnote = json;
		$('#guide-info').html($('#guide-info-offline').html());
		$('#note-txt-title').html('离线使用KindleNote');
		//$('#note-txt-date').html('');
		
		//GetNoteTxt(json[0]['title']);
		$.each(json, function(index, el) 
		{
			var s1 = '<li id="hidenote-title'+index;
			var s2 = '<li id="hidenote-date'+index;
			var s3 = '<li id="hidenote-author'+index;
			var s4 = '<li id="hidenote-note'+index;
			var s0 = 'value="'+index+'"';
			$('#hidenote-title').append(s1+'">'+el['title']+'</li>');
			$('#hidenote-date').append(s2+'">'+el['date']+'</li>');
			$('#hidenote-author').append(s3+'">'+el['author']+'</li>');
			$('#hidenote-note').append(s4+'">'+el['note']+'</li>');
			$('#notelist').append('<li><div class="note-list-img"></div><div class="note-list-title"><a href="#"'+s0 +'><b>'
				+el["title"]
				+"</b></a></div><div class='note-list-author'>"
				+el['author']
				+"</div></li>");
		});
		$('#note-list-count').show();
		$('#note-list-count-notecount').text($('#hidenote-title li').length);
	})
	.fail(function(json) 
	{
		d.close().remove();
		console.log("error"+json);
		var j = dialog(
		{
    		title: '笔记解析失败',
    		content: '<b>错误原因</b><br/>1.不是Kindle笔记文件<br/>2.笔记内容格式有误<br/><br/>'
    		+'<b>你的联系方式</b><br/><input id="input_qq" value=""autofocus placeholder="留下你的QQ，我会跟你联系"/><br/><br/>'
    		+'<b>关于</b><br/><b>QQ   :</b><a href="tencent://message/?uin=1217473249&Site=163164.cn&Menu=yes" title="QQ: 1217473249">1217473249</a><br/>'
    		+'<b>Email:</b><a href="mailto:badtudou@qq.com" title="Email: BadTudou@qq.com">badtudou@qq.com</a><br/>',
    		okValue: '提交',
    		cancelValue: '取消',
    		ok: function ()
    		{
       			var qq = $('#input_qq').val();
       			if ($.trim(qq) == '')
       			{
       				return false;
       			}
	      		ReportError(Number(noteid)+1, qq);
       			return true;
    		}
    	});
		j.show();
	})
	.always(function() 
	{
		//$('#note-txt-note').html('正在加载');
		//console.log("complete");
	});
	
}

function ShowDialog(title, content)
{
	var d = dialog(
	{
    	title: title,
    	content: content,
    	cancel: false,
    	ok: function () {}
	});
	d.show();
	return d;
}

function IsFileMode()
{
	if (location.href.substr(0,4) == 'file')
	{
		return true;
	}
	return false;
}

function GetNoteCount() 
{
	$.ajax({
		url: 'php/ikindlenote.php',
		type: 'POST',
		dataType: 'JSON',
		data: {action: 'getnotecount'},
	})
	.done(function(json) 
	{
		if(json.stateCode == 0)
		{
			noteid = json.msgText;
			$('#text_notecount_count').text(json.msgText);
			console.log(json.msgText);
		}
		
	})
	.fail(function(json) 
	{
		console.log("error");
	})
	
}
function GetNoteTxt(notename)
{
	$.each(jsonnote, function(index, el)
	{
		if (el['title'] == notename)
		{
			$('#note-txt-title').html(el['title']);
			$('#note-txt-date').html(el['date']);
			$('#note-txt-note').html(el['note']);
		}
	});
}

function GetNoteTxtOff(index)
{
	var sTitle = '#hidenote-title'+index;
	var sDate = '#hidenote-date'+index;
	var sAuthor = '#hidenote-author'+index;
	var sNote = '#hidenote-note'+index;
	var title = $(sTitle).text();
	var date = $(sDate).text();
	var author = $(sAuthor).text();
	var note = $(sNote).text();
	$('#note-txt-title').html(title);
	$('#note-txt-date').html(date);
	$('#note-txt-note').html(note);
}

function ReportError(noteid, qq) 
{
	$.ajax({
		url: 'php/ikindlenote.php',
		type: 'POST',
		dataType: 'JSON',
		data: {action: 'reporterror', noteid:noteid, qq:qq},
	})
	.done(function(json) 
	{
		if (json.stateCode == 0)
		{
			ShowDialog('反馈成功',json.msgText);
		}
		
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

$(document).ready(function() 
{
	if (!IsFileMode())
	{
		GetNoteCount();
	}
	$('#notelist').on('click', 'a', function(event) {
		//event.preventDefault();
		if(IsFileMode())
		{
			console.log('filenode');
			console.log($(this).attr('value'));
			GetNoteTxtOff($(this).attr('value'));
			return false;
		}
		else
		{
		}
		GetNoteTxt($(this).text());	
		
	});	

	$('#button_upload').click(function(event) 
	{
		$('#fileupload').click();
	});


	$('#form_uploadfile').submit(function(event) 
	{
		var afile = document.getElementById('fileupload');
		gXhr = new XMLHttpRequest();
		var gFd = new FormData();
		gFd.append('files[0]',afile.files[0]);
		gXhr.open("post", "php/upload.php", true);
		gXhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		gXhr.send(gFd);
		var d = dialog(
		{
    		title: '处理中',
    		content: '正在上传笔记,请稍候',
    		cancel: false,
    		ok: function () {}
		});
		d.show();
		gXhr.onreadystatechange = function(state)
		{
			var str = gXhr.responseText;
			if (gXhr.readyState == 4 && str.substr(0,2) == 'ok')
			{	
				d.close().remove();
				$('#text_notecount_count').text(str.substr(2));
				GetNoteList(str.substr(2));
			}
		}
   		return false; //阻止表单默认提交
	});

	$('#fileupload').change(function()
	{
		var afile = document.getElementById('fileupload');
		var filename = afile.files[0].name;
		var filesize = (afile.files[0].size/1024).toFixed(2);
		$('#text_upload').text(filename);
		console.log(filename);
		if (filename.substr(-4) == '.txt')
		{
			$('#form_uploadfile').submit();
		}
		else
		{
			ShowDialog('错误','Kindle的笔记是txt格式的文本文件');
		}
	});
});