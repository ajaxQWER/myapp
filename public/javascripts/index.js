// 由于F7是SPA，这里改成跳页面，所以所有关于view切换的都换成location.href
// mainView.router.loadPage('/');

//注意这里字符串的拼接，低版本webkit内核不支持`${}`这种写法
//用getUser体验比location.href要好
function getUser() {
	var username = localStorage.getItem('user');
	var str = "";
	if (username) {
		str = "<p>欢迎你" + username + "<a id=\"sign-out\">退出</a></p>"
	} else {
		str = "<a href=\"/login.html\" class=\"close-panel\" id=\"login\">登录</a>";
		$$('#logined').hide();
	}
	$$('#login').html(str);
}
getUser();
//退出
$$(document).on('click', '#sign-out', function() {
	$$.ajax({
		url: '/signOut',
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data)
			if (data.success) {
				myApp.showPreloader('退出成功');
				setTimeout(function() {
					myApp.hidePreloader();
					localStorage.removeItem('user');
					getUser();
					// location.href = "/";
					myApp.closePanel();
				}, 1500)
			}
		}
	})
});
// //写文章
// $$('#addTopic').on('click', function() {
// 	var user = localStorage.getItem('user');
// 	if (!user) {
// 		location.href = "/login.html";
// 	} else {
// 		location.href = "/publication.html";
// 		// myApp.popup('.popup-topic');
// 	}
// });

// $$('#submit-topic').on('click', function() {
// 	if (!$$('.topic-title').val().trim()) {
// 		myApp.showPreloader('请输入标题');
// 		setTimeout(function() {
// 			myApp.hidePreloader();
// 		}, 1500)
// 		return;
// 	}
// 	if (!simplemde.value().trim()) {
// 		myApp.showPreloader('请输入内容');
// 		setTimeout(function() {
// 			myApp.hidePreloader();
// 		}, 1500)
// 		return;
// 	}
// 	$$.ajax({
// 		url: '/posts/addTopic',
// 		method: 'POST',
// 		data: {
// 			title: $$('#topic-title').val(),
// 			author: localStorage.getItem('user'),
// 			// content: markdown.toHTML($$('#topic-content').html())
// 			content: simplemde.value()
// 		},
// 		dataType: 'json',
// 		success: function(data) {
// 			if (data.success) {
// 				console.log(data)
// 				myApp.showPreloader(data.msg);
// 				setTimeout(function() {
// 					myApp.closeModal('.popup-topic')
// 					myApp.hidePreloader();
// 					location.href = "/";
// 					$$('.topic-title').val('');
// 					$$('.topic-content').html('');
// 				}, 2000)
// 			}
// 		}
// 	})
// });