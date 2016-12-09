// usage滚动条

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
scrollToTop('#back-top', '#usage');