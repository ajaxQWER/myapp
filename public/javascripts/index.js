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

$$('#addTopic').on('click',function(){
	var user = localStorage.getItem('user');
	if(!user){
		mainView.router.loadPage('/login.html');
	}else{	
		myApp.popup('.popup-topic');
	}
})

$$('#cancel-topic').on('click', function() {
	$$('.topic-title').val('');
	$$('.topic-content').html('');
})
$$('#topic-content').on('click', function() {
	$$(this).focus();
})
$$('#submit-topic').on('click', function() {
	if (!$$('.topic-title').val().trim()) {
		myApp.showPreloader('请输入标题');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	if (!$$('.topic-content').html().trim()) {
		myApp.showPreloader('请输入内容');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	$$.ajax({
		url: '/posts/addTopic',
		method: 'POST',
		data: {
			title: $$('#topic-title').val(),
			author: localStorage.getItem('user'),
			// content: markdown.toHTML($$('#topic-content').html())
			content: $$('#topic-content').html()
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
				$$('.topic-content').html('');
				mainView.router.loadPage('/');
			}
		}
	})

})