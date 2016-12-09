// Initialize your app
var myApp = new Framework7({
	material: true,
	animateNavBackIcon: true,
	cache: true,
	router: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true
});

$$(document).on("pageInit", function(e) {
	var page = e.detail.page;
	switch (page.name) {
		case "regist":
			$$('#reg-btn').on('click', function() {
				var formData = myApp.formToJSON('#regist-form');
				if (!formData.username) {
					myApp.alert('注册提示', '用户名为空');
					return;
				}
				if (!formData.password) {
					myApp.alert('注册提示', '密码为空');
					return;
				}
				if (!formData.confirm) {
					myApp.alert('注册提示', '密码未确认');
					return;
				}
				if (formData.confirm != formData.password) {
					myApp.alert('注册提示', '两次密码不一致');
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
								mainView.router.loadPage('login.html');
								myApp.hidePreloader();
							}, 2000)
						} else {
							myApp.alert('注册提示', data.msg)
						}
					}
				})
			})
			break;
		case "login":
			$$('#login-btn').on('click', function() {
				var formData = myApp.formToJSON('#login-form');
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
								mainView.router.loadPage('/');
								myApp.hidePreloader();
							}, 2000);
							getUser();
						} else {
							myApp.alert('登录提示', data.msg)
						}
					}
				})
			})
			break;
		case "cars":
			var template = $$('#tpl-car').html();

			// compile it with Template7
			var compiledTemplate = Template7.compile(template);

			// Now we may render our compiled template by passing required context
			var context = {
				firstName: 'xue',
				lastName: '将军'
			};
			var html = compiledTemplate(context);
			$$('#carss').html(html)
			break;
	}
})

// 首页下拉刷新页面
var ptrContent = $$('.pull-to-refresh-content');
ptrContent.on('refresh', function(e) {
	setTimeout(function() {
		myApp.pullToRefreshDone();
		location.reload();
	}, 1500)
})

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