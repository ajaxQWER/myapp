//回复
$$('#comment-btn').on('click', function() {
	var content = $$('#comment').val();
	var id = $$(this).data('id');
	console.log(1)
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
	if(!localStorage.getItem('user')){
		myApp.showPreloader('请登录后再评论');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		mainView.router.loadPage('/login.html');
		return;
	}
	$$.ajax({
		url: '/replay',
		method: 'POST',
		data: {
			id: id,
			replayer: localStorage.getItem('user'),
			content: content
		},
		dataType: 'json',
		success: function(replay) {
			console.log(replay)
			if (replay.success) {
				myApp.showPreloader('添加评论成功');
				setTimeout(function() {
					myApp.hidePreloader();
				}, 1500)
				var str = "<li>"+
                            	"<div class=\"list-content\">"+
	                                "<div class=\"list-info\">"+
	                                    "<div class=\"author-info\">"+
	                                        "<img src=\"#\" width=\"40\" class=\"author-img\">"+
	                                        "<span class=\"author-name\">"+replay.data.replayer+"</span>"+
	                                        "<span class=\"replay-time\">"+replay.data.time+"</span>"+
	                                    "</div>"+
	                                    "<div class=\"user-action\">"+
	                                        "<a href=\"#\" class=\"a-ups\" data-id=\""+replay.data.replayId+"\"><i class=\"material-icons\">thumb_up</i></a>"+
	                                        "<span class=\"ups\"></span>"+
	                                        "<a href=\"#\" class=\"a-replay\" data-id=\""+replay.data.replayId+"\"><i class=\"material-icons\">reply</i></a>"+
	                                    "</div>"+
	                                "</div>"+
                                "<div class=\"replay-content\">"+replay.data.content+"</div>"+
                            "</div>"+
                        "</li>";
                setTimeout(function(){
                	$$('#comment-lists').append(str);
                },2000)
			}
		}
	})
})