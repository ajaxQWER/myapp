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
$$('.back').on('click', function() {
	history.go(-1)
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