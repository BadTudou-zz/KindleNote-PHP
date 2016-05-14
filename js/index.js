var jsonnote;

function GetNoteList(title)
{
	var d = dialog(
	{
    	title: '处理中',
    	content: '正在获取笔记列表',
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
		$('#notelist').empty();
		jsonnote = json;
		GetNoteTxt(json[0]['title']);
		$.each(json, function(index, el) 
		{
			$('#notelist').append("<li><div class='note-list-img'></div><div class='note-list-title'><a href='#'><b>"
				+el['title']
				+"</b></a></div><div class='note-list-author'>"
				+el['author']
				+"</div></li>")
		});
	})
	.fail(function(json) 
	{
		console.log("error"+json);
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
			$('#text_notecount').html('处理笔记：'+json.msgText+'');
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

$(document).ready(function() 
{
	GetNoteCount();
	$('#notelist').on('click', 'a', function(event) {
		//event.preventDefault();
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
		gXhr.onreadystatechange = function(state)
		{
			var str = gXhr.responseText;
			if (gXhr.readyState == 4 && str.substr(0,2) == 'ok')
			{	
				GetNoteCount();
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