// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true
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
        case "about":
            myApp.alert("Here comes About page");
            break;
        case "topic":
            $$('.comment-btn').on('click', function() {
                myApp.alert('任督二脉未打通', '不正经的标题?')
            })
            break;
        case "projects":
            myApp.alert("HAHAAHAHA");
            break;
        case "usage":
            scrollToTop('#back-top', '#usage');
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

// $$(document).on('click', function(e) {

//         myApp.alert('sss')
//     })

//usage滚动条
function scrollToTop(btn, scrollDOM) {
    var btn = document.querySelector(btn);
    var scrollDOM = document.querySelector(scrollDOM);
    var timer = null;
    var isTop = true;
    var clientHeight = document.documentElement.clientHeight;
    scrollDOM.onscroll = function() {
        var osTop = scrollDOM.scrollTop;
        if ((osTop * 2) >= clientHeight) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        };
        if (!isTop) {
            clearInterval(timer);
        };
        isTop = false;
    }
    btn.onclick = function() {
        timer = setInterval(function() {
            var osTop = scrollDOM.scrollTop;
            var ispeed = Math.floor(-osTop / 7);
            scrollDOM.scrollTop = osTop + ispeed;
            if (osTop == 0) {
                clearInterval(timer);
            };
            isTop = true;
        }, 30);
    };
}

function getSession() {
    $$.ajax({
        url: '/getSession',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $$('#login').html(`欢迎你,${data.user}<a href="/signOut">退出</a>`)
            }
        }
    })
}

function getUser() {
    var username = localStorage.getItem('user');
    if (username) {
        $$('#login').html(`欢迎你,${username}<a href="#" id="sign-out">退出</a>`)
        $$('#sign-out').on('click', function() {
            myApp.closePanel();
            mainView.router.loadPage('/');
            $$.ajax({
                url: '/signOut',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    console.log(data)
                    if (data.success) {
                        localStorage.removeItem('user');
                        setTimeout(getUser, 500);
                    }
                }
            })
        })
    } else {
        $$('#login').html(`<a href="/login.html" class="close-panel" id="login">登录</a>`)
    }
}
getUser();

// $$('.topic-content').keyup(function(event) {
//     $$('.preview').html(markdown.toHTML($$(this).val()))
// });
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
            author: "薛将军",
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


// 首页下拉刷新页面
var ptrContent = $$('.pull-to-refresh-content');
ptrContent.on('refresh', function(e) {
    setTimeout(function() {
        myApp.pullToRefreshDone();
    }, 1500)
})

//安卓键盘挡住输入框
if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function() {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}