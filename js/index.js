var noteid;
var currentNoteID = 'note-list-title0';

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

	$.ajax(
	{
		url: 'php/ikindlenote.php',
		type: 'POST',
		dataType: 'JSON',
		data: {action: 'getnotelist',title: title},
	})
	.done(function(json) 
	{
		d.close().remove();
		//json.sort(asc_sort);
		$('#note-list-search').show();
		cleanData();
		var arapahabet= new Array();
		var i = 0;
		$.each(json, function(index, el) 
		{
			index = i;
			var apahabet = (makePy(el['title'].substr(0,1))+'').substr(0,1);
			var stitle = '<li id="hidenote-title'+index;			
			var sdate = '<li id="hidenote-date'+index;
			var sauthor = '<li id="hidenote-author'+index;
			var snote = '<li id="hidenote-note'+index;
			var title = el['title'];
			var author = '暂无作者';
			var iposStart = el['title'].lastIndexOf('(');
			if (iposStart != -1)
			{
				var iposEnd = el['title'].lastIndexOf(')');
				if (iposEnd != -1)
				{
					author = el['title'].substr(iposStart+1, iposEnd-iposStart-1);
					title = title.substr(0, iposStart);
				}
			}
			if (title.length > 15)
			{
				title = title.substr(0, 15);
				title += '...';
			}
			arapahabet.push(apahabet+'');
			var s0 = 'value="'+index+'" title="'+el["title"]+'"';
			$('#hidenote-title').append(stitle+'">'+el['title']+'</li>');
			$('#hidenote-date').append(sdate+'">'+el['date']+'</li>');
			$('#hidenote-author').append(sauthor+'">'+el['author']+'</li>');
			$('#hidenote-note').append(snote+'">'+el['note']+'</li>');
			$('#notelist').append('<li id="lnote-list-title'+index+'"'+'><div class="note-list-title"><a href="#" '+s0 +'value="'+apahabet+'"id="note-list-title'+index+'"><b><span id="snote-list-title'+index+'">'
				+title
				+"</span></b></a></div><div class='note-list-author'>"
				+author.substr(0,56)
				+"</div></li>");
			i++;
		});
		
		for (var i = 0 ; i < 26; i++) 
		{
			if($.inArray(String.fromCharCode(65+i), arapahabet) != -1)
			{
				$('#apahabetlist').append('<li><a href="#" title="跳转到'+String.fromCharCode(65+i)+'开头的笔记">'+String.fromCharCode(65+i)+'</a></li>');
			}
			else
			{
				$('#apahabetlist').append('<li><a class="disabled" href="#" title="跳转到'+String.fromCharCode(65+i)+'开头的笔记">'+String.fromCharCode(65+i)+'</a></li>');	
			}
		}
		$('#note-list-count').show();
		$('#note-list-count-notecount').text($('#hidenote-title li').length);
	})
	.fail(function(json) 
	{
		d.close().remove();
		console.log("error"+JSON.stringify(json));
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
	});
	
}

function cleanData()
{
	$('#apahabetlist').empty();
	$('#notelist').empty();
	$('#hidenote-title').empty();
	$('#hidenote-date').empty();
	$('#hidenote-note').empty();
	$('#guide-info').html($('#guide-info-offline').html());
	$('#note-txt-title').html('离线使用KindleNote');
	$('#button_markdown').show();
	$('#button_markdown').attr('href', 'php/download.php?fileID='+$('#text_notecount_count').text());
}

function asc_sort(a, b) 
{
	var a1 = makePy(b.title.substr(0,1));
	var b1 = makePy(a.title.substr(0,1));
    return a1 < b1 ? 1 : -1;
}

/**
 * [显示对话框]
 * @param {[string]} title   [窗口标题]
 * @param {[string]} content [窗口内容]
 */
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

/**
 * [是否为文件模式]
 * @return {[bool]}  [true:是; false:否]
 */
function IsFileMode()
{
	if (location.href.substr(0,4) == 'file')
	{
		return true;
	}
	return false;
}

/**
 * [获取已处理笔记个数]
 */
function GetNoteCount() 
{
	$.ajax(
	{
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
		}
		
	})
	.fail(function(json) 
	{
		console.log("error"+JSON.stringify(json));
	})
}

/**
 * [获取指定下标的笔记]
 * @param {[int]} index [笔记下标]
 */
function GetNoteTxt(index)
{
	var sTitle = '#hidenote-title'+index;
	var sDate = '#hidenote-date'+index;
	var sAuthor = '#hidenote-author'+index;
	var sNote = '#hidenote-note'+index;
	var date = $(sDate).text();
	var author = $(sAuthor).text();
	var note = $(sNote).html();
	$('#note-txt-date').html(date);
	$('#note-txt-note').html(note);
}

/**
 * [报告错误]
 * @param {[string]} noteid [笔记ID]
 * @param {[string]} qq     [QQ号码]
 */
function ReportError(noteid, qq) 
{
	$.ajax(
	{
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
}

$(document).ready(function() 
{
	$('#button_markdown').hide();
	if (!IsFileMode())
	{
		GetNoteCount();
	}

	//单击笔记列表项，获取笔记内容
	$('#notelist').on('click', 'a', function(event) 
	{
		var s ='#hidenote-title'+$(this).attr('value');
		currentNoteID = s;
		var title = $(s).text();
		$(document).attr('title', $(this).text());
		$('#note-txt-title').html('<a href="#" title="'+title+'">'+title.substr(0,25)+'</a>');
		GetNoteTxt($(this).attr('value'));
		return false;
		
	});	

	//单击拼音列表，搜索符合要求答笔记
	$('#note-aphabet').on('click', 'a', function(event) 
	{
		var s ='note-list-title'+$(this).text();
		$('html, body').animate({scrollTop:0}, 'fast');
		$(this).attr('href','#'+s);//console.log(s);
		$('#'+s).click();
		return true;
	});
	
	//单击搜索按钮，搜索包含关键字的笔记
	$('#note-list-search-button').click(function(event) 
	{
		var notetitle = $('#note-list-search-notetitle').val();
		if ($.trim(notetitle) != '')
		{
			for (var i = 0; i< $('#notelist li').length; i++) 
			{
				var title = $('#note-list-title'+i+'').text();
				if (title.indexOf(notetitle) != -1)
				{
					location.href ='#note-list-title'+i+'';
					$('html, body').animate({scrollTop:0}, 'fast');
					break;

				}
			}
			
		}
	});


	$('#button_upload').click(function(event) 
	{
		$('#fileupload').click();
	});


	//上传笔记内容
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

	//待上传的笔记文件已经选择
	$('#fileupload').change(function()
	{
		var afile = document.getElementById('fileupload');
		var filename = afile.files[0].name;
		var filesize = (afile.files[0].size/1024).toFixed(2);
		$('#text_upload').text(filename);
		if (filename.substr(-4) == '.txt')
		{
			$('#form_uploadfile').submit();
		}
		else
		{
			ShowDialog('错误','Kindle的笔记是txt格式的文本文件');
		}
	});

	//单击保存笔记
	$('#button_saveas').click(function(event) 
	{
		var htmlnote ='';
		for (var i = 0; i< $('#notelist li').length; i++) 
		{
			var title = $('#hidenote-title'+i+'').text();
			var date = $('#hidenote-date'+i+'').text();
			var author = $('#hidenote-author'+i+'').text();
			var note = $('#hidenote-note'+i+'').text();
			htmlnote = htmlnote + title + date + author + note;
		}
		export_raw('kindlenote.mk', htmlnote);

	});

	//热键
	$(document).keydown(function (event) 
	{
		switch(String.fromCharCode(event.keyCode))
		{
			case 'S':
				var tmpId = currentNoteID.substr(15)-'0'+1;
				var tmpItem = '#snote-list-title'+tmpId+'';
				var container = $('#notelist');
				var scrollTo = $(tmpItem);
				container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());

				//$('#notelist').scrollTop($('#snote-list-title'+tmpId+'').offset().top);
				$(tmpItem).click();
				
				break;

			case 'W':
				var tmpId = currentNoteID.substr(15)-'0'-1;
				var tmpItem = '#snote-list-title'+tmpId+'';
				var container = $('#notelist');
				var scrollTo = $(tmpItem);
				container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
				$(tmpItem).click();
				break;
		}
	});
});

