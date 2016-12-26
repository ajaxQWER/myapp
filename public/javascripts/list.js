//修改文章
var id = $$('#update').data('id');
$$('#update').on('click', function() {
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
			content: $$('#update-content').val()
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
})