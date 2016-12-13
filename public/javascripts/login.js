$$('#login-btn').on('click', function() {
	var formData = myApp.formToJSON('#login-form');
	if (!formData.username) {
		myApp.showPreloader('请输入用户名');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	if (!formData.password) {
		myApp.showPreloader('请输入密码');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	$$.ajax({
		url: '/login',
		method: 'POST',
		data: formData,
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				console.log(data)
				localStorage.setItem('user', data.user)
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					location.href = "/";
					myApp.hidePreloader();
				}, 2000);
			} else {
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					myApp.hidePreloader();
				}, 1500)
			}
		}
	})
})