//注意这里字符串的拼接，低版本webkit内核不支持`${}`这种写法
function getUser() {
	var username = localStorage.getItem('user');
	var str = "";
	if (username) {
		str = "<p>欢迎你" + username + "<a href=\"#\" id=\"sign-out\">退出</a></p>"
	} else {
		str = "<a href=\"/login.html\" class=\"close-panel\" id=\"login\">登录</a>"
	}
	$$('#login').html(str);
}
getUser();
$$(document).on('click', '#sign-out', function() {
	myApp.closePanel();
	$$.ajax({
		url: '/signOut',
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data)
			if (data.success) {
				localStorage.removeItem('user');
				setTimeout(getUser, 500)
			}
		}
	})
})

$$('#cancel-topic').on('click', function() {
	$$('.topic-title').val('');
	$$('.topic-content').val('');
})
$$('#submit-topic').on('click', function() {
	$$.ajax({
		url: '/posts/addTopic',
		method: 'POST',
		data: {
			title: $$('#topic-title').val(),
			author: localStorage.getItem('user'),
			content: markdown.toHTML($$('#topic-content').val())
		},
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				console.log(data)
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					myApp.closeModal('.popup-topic')
					myApp.hidePreloader();
				}, 2000)
				$$('.topic-title').val('');
				$$('.topic-content').val('');
			}
		}
	})

})