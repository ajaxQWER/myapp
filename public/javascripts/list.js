$$('#publication').on('click', function() {
	if (!localStorage.getItem('user')) {
		location.href = "/login.html"
	} else {
		location.href = "/publication.html"
	}
})


//修改文章
$$('.update').on('click', function() {
	var id = $$(this).data('id');
	$$.ajax({
		url: '/posts/update/getInfo?id=' + id,
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data)
			myApp.popup('.popup-update');
			$$('#update-title').val(data.title);
			$$('#update-content').val(data.content)
		}
	})
})
$$('#update-btn').on('click', function() {
	if (!$$('#update-title').val().trim()) {
		myApp.showPreloader('请输入标题');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return false;
	}
	if (!$$('#update-content').val().trim()) {
		myApp.showPreloader('请输入内容');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return false;
	}
	$$.ajax({
		url: '/posts/update',
		method: 'PUT',
		data: {
			id: id,
			title: $$('#update-title').val(),
			content: $$('#update-content').val().replace(/\n/g, '<br>')
		},
		success: function(data) {
			console.log(data)
			myApp.showPreloader(data);
			setTimeout(function() {
				myApp.hidePreloader();
			}, 1500)
			myApp.closeModal('.popup-update')
		}
	})
});

//删除文章

$$('.delete').click(function() {
	var id = $$(this).data('id');
	myApp.confirm('确定要删除文章吗?', '删除文章', function() {
			$$.ajax({
				url: '/posts/delete',
				method: 'DELETE',
				data: {
					id: id
				},
				dataType: 'json',
				success: function(data) {
					console.log(data)
					if (data.success) {
						myApp.showPreloader(data.msg);
						setTimeout(function() {
							myApp.hidePreloader();
							location.reload();
						}, 1500)
					}

				}
			})
		},
		function() {
			console.log('取消删除')
		});
})