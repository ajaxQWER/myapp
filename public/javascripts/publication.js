//markdown文本编辑器
// var simplemde = new SimpleMDE({
// 	element: document.getElementById('topic-content'),
// 	autofocus: true,
// 	status: false,
// 	toolbar: false
// });
// simplemde.codemirror.on("focus", function() {
// 	console.log(simplemde.value());
// 	$$('.CodeMirror-code').focus()
// });


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
// $$('#topic-content').on('click', function() {
// 	$$(this).focus();
// })

$$('#submit-topic').on('click', function() {
	if (!$$('.topic-title').val().trim()) {
		myApp.showPreloader('请输入标题');
		setTimeout(function() {
			myApp.hidePreloader();
		}, 1500)
		return;
	}
	if (!$$('#topic-content').val().trim()) {
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
			// content: markdown.toHTML($$('#topic-content').val())
			content: $$('#topic-content').val().replace(/\n/g, '<br>')
		},
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				console.log(data)
				myApp.showPreloader(data.msg);
				setTimeout(function() {
					myApp.hidePreloader();
					location.href = "/";
					$$('.topic-title').val('');
					$$('.topic-content').val('');
				}, 2000)
			}
		}
	})
});