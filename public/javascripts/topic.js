//回复
$$('#comment-btn').on('click', function() {
    var content = $$('#comment').val();
    var id = $$(this).data('id');
    var user = localStorage.getItem('user');
    if (!user) {
        myApp.showPreloader('请登录后再评论');
        setTimeout(function() {
            myApp.hidePreloader();
            location.href = "/login.html";
        }, 1500)
        return;
    }
    if (!content) {
        myApp.showPreloader('评论不能为空');
        setTimeout(function() {
            myApp.hidePreloader();
        }, 1500)
        return;
    }
    if (!id) {
        myApp.showPreloader('获取文章信息失败');
        setTimeout(function() {
            myApp.hidePreloader();
        }, 1500)
        return;
    }

    $$.ajax({
        url: '/replay',
        method: 'POST',
        data: {
            id: id,
            replayer: user,
            content: content
        },
        dataType: 'json',
        success: function(replay) {
            if (replay.success) {
                myApp.showPreloader('添加评论成功');
                setTimeout(function() {
                    myApp.hidePreloader();
                    location.reload();
                }, 1500);
            }
        }
    })
});

//点赞
$$('.a-ups').on('click', function() {
    var _this = $$(this);
    var id = _this.data('id');
    var index = _this.data('index')
    var ups = parseInt(_this.next('.ups').text()) || 0;
    $$.ajax({
        url: '/posts/ups',
        method: 'POST',
        data: {
            id: id,
            index: index
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if (data.success) {
                ups += 1;
                _this.next('.ups').text(ups);
            }
            myApp.showPreloader(data.msg);
            setTimeout(function() {
                myApp.hidePreloader();
            }, 1500);
        }
    })
})

//评论回复
$$('.a-replay').on('click', function() {
    var _this = $$(this);
    var id = _this.data('id');
    var author = _this.data('author');
    var content = $$('#'+id).find('.replays').text() || $$('#'+id).text();
    console.log(content)
    var popupHTML = '<div class="popup">\
        <div class="content-block">\
        <p>评论回复：</p>\
        <textarea name="comment" placeholder="回复 '+author+':'+content+'" id="replay-text"></textarea>\
        <p class="buttons-row">\
		  <a class="button button-big button-fill button-raised color-red close-popup">取消</a>\
		  <a id="replay-comment" class="button button-big button-fill button-raised color-teal" data-author="'+author+'" data-content="'+content+'">回复</a>\
		</p>\
        </div>\
        </div>'
    myApp.popup(popupHTML);
})
$$(document).on('click','#replay-comment',function(){
	var content = $$('#replay-text').val();
	var id = $$('#comment-btn').data('id');
	var user = localStorage.getItem('user');
	var author = $$(this).data('author');
	var replay = $$(this).data('content');
	if (!user) {
        myApp.showPreloader('请登录后再评论');
        setTimeout(function() {
            myApp.hidePreloader();
            location.href = "/login.html";
        }, 1500)
        return;
    }
	if (!content) {
        myApp.showPreloader('回复不能为空');
        setTimeout(function() {
            myApp.hidePreloader();
        }, 1500)
        return;
    }
	$$.ajax({
		url:'/replay',
		method:'POST',
		data:{
			id:id,
			replayer:user,
			content:'<span class="quote">回复'+author+':'+replay+'</span><br /><span class="replays">'+content+'</span>'
		},
		dataType: 'json',
<<<<<<< HEAD
		success:function(data){
			console.log(data)
			if (data.success) {
                myApp.showPreloader('添加评论成功');
                setTimeout(function() {
                    myApp.hidePreloader();
                	myApp.closeModal('.popup')
                    location.reload();
                }, 1500);
            }
=======
		success: function(replay) {
			if (replay.success) {
				myApp.showPreloader('添加评论成功');
				setTimeout(function() {
					myApp.hidePreloader();
					$$('#comment').val('');
				}, 1500)
				var str = "<li>" +
					"<div class=\"list-content\">" +
					"<div class=\"list-info\">" +
					"<div class=\"author-info\">" +
					"<img src=\"#\" width=\"40\" class=\"author-img\">" +
					"<span class=\"author-name\">" + replay.data.replayer + "</span>" +
					"<span class=\"replay-time\">" + replay.data.time + "</span>" +
					"</div>" +
					"<div class=\"user-action\">" +
					"<a class=\"a-ups\" data-id=\"" + replay.data.replayId + "\"><i class=\"material-icons\">thumb_up</i></a>" +
					"<span class=\"ups\"></span>" +
					"<a class=\"a-replay\" data-id=\"" + replay.data.replayId + "\"><i class=\"material-icons\">reply</i></a>" +
					"</div>" +
					"</div>" +
					"<div class=\"replay-content\">" + replay.data.content + "</div>" +
					"</div>" +
					"</li>";
				setTimeout(function() {
					$$('#comment-lists').append(str);
				}, 2000)
			}
>>>>>>> 8c640c8352984eb93cd09794a79161d0b0580e0d
		}
	})
})