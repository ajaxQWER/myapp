// 安卓键盘挡住输入框
if (/Android/gi.test(navigator.userAgent)) {
	window.addEventListener('resize', function() {
		if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
			window.setTimeout(function() {
				document.activeElement.scrollIntoViewIfNeeded();
			}, 0);
		}
	})
}
$$('#reg-btn').on('click', function() {
	var formData = myApp.formToJSON('#regist-form');
	if (!formData.username) {
		myApp.showPreloader('用户名为空');
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
	if (!formData.confirm) {
		myApp.showPreloader('密码未确认');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	if (formData.confirm != formData.password) {
		myApp.showPreloader('两次密码不一致');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	$$.ajax({
		url: '/regist',
		method: 'POST',
		data: formData,
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					location.href = "/login.html";
					myApp.hidePreloader();
				}, 2000)
			} else {
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					myApp.hidePreloader();
				}, 1500)
			}
		}
	})
})