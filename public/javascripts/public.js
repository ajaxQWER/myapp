// Initialize your app
var myApp = new Framework7({
    material: true,
    animateNavBackIcon: true,
    cache: false,
    router: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// 首页下拉刷新页面
var ptrContent = $$('.pull-to-refresh-content');
ptrContent.on('refresh', function(e) {
    setTimeout(function() {
        myApp.pullToRefreshDone();
        location.reload();
    }, 1500)
})