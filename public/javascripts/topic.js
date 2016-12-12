//回复
$$('#comment-btn').on('click', function() {
	var content = $$('#comment').val();
	var id = $$(this).data('id');
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
			replayer: localStorage.getItem('user'),
			time: Date(),
			content: content
		},
		dataType: 'json',
		success: function(data) {
			console.log(data)
			if (data.success) {
				myApp.showPreloader('添加评论成功');
				setTimeout(function() {
					myApp.hidePreloader();
				}, 1500)

			}
		}
	})
})