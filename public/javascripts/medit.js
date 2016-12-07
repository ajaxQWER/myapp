;
(function(obj, undefined) {

	var meditToolImage = obj.meditToolImage || "/"; // 工具条图片位置

	var meditId = null;

	var container = [];

	var regNodeId = /medit\-(\d+)\-(\d+)$/;

	var regContent = /\s(class|id|contenteditable)(=".*?")?/g; // 获得内容时去除id，class和可编辑状态

	var regIsNotContentEmpty = /^<.*?>$/; // 获得内容时检测是否是纯文本

	var regNormalStyle = /(font\-style\s*:\s*normal\s*;)|(font\-weight\s*:\s*normal\s*;)|(color:\s*rgb\(0,\s*0,\s*0\);)|(\s*)/ig; // 正常的样式需要剔除

	var selectTextReg = /<span class="medit\-text\-select">(.*?)<\/span>/i;

	var isToolMove = false;

	var toolBarCatch = null;

	var isContainMove = false;

	var mainTouchPoint = {};

	var nowNode = null; // 当前选择的可编辑结点

	var nodeFocusTimeout = null; // nodeFocus延时 

	var commonImageType = {
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"gif": "image/gif",
		"png": "image/png",
		"bmp": "image/bmp"
	}

	var getNodeById = function(id) {
		return document.getElementById(id);
	}

	var returnButtonHtml = function(from) {
		return '<span id="medit-tool-button-' + from + '" class="medit-tool-button  medit-tool-return" data-meditToolStyle="return" data-meditToolDegree="1">&nbsp;</span>';
	}

	var toArray = function(obj) {
		return [].slice.call(obj);
	}

	var getXhr = function() {
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
		} else {
			try {
				var xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					var xhr = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					throw new TypeError('Unsupport XMLHttpRequest');
				}
			}
		}
		return xhr;
	}

	var mainButton = ["addLeft", "delete", "setting", "mode", "ok", "addRight"];

	var nowMode = "text";
	/*
	mode 属性：
	
	icon: [String] 类型选择icon url
	
	isMerge: [Bollean] 是否开启相同内容自动合并
	notDisplay: [Bollean] 在选择模式的时候不显示,
	emptyNotDelete: [Bollean] 如果当前块只存在一个子节点并且这个子节点要删除的时候是否开启递归删除
	
	doWhat: [Function] 转换到此类型时会自动做哪些转换
	focus：[Function] 点击或此模块获取焦点时自动触发的函数
	blur：[Function] 此模块失去焦点时自动触发的函数
	empty: [Function] 什么时候当前模块为空
	selecting：[Function] 选择当前模块并且手指在屏幕上移动时触发的操作
	selected：[Function] 手指移动结束执行的操作
	setting: [Array(Object)] 当前模块可以进行哪些操作
	 --	name: [String] 操作名称
	 --	icon: [String] 操作按钮icon url
	 --	doWhat: [Function/Array] 点击此操作按钮执行什么，或者是存在更深层次操作
		
	
	*/
	var mode = {
		"text": {
			icon: meditToolImage + 'images/mode/text.png',
			doWhat: function(node) {
				console.log(111)
				mode[node.getAttribute("data-meditmode")].blur(node);
				var temNode = document.createElement("span");
				temNode.setAttribute("data-medit", "true");
				temNode.setAttribute("data-meditmode", "text");
				node.parentNode.insertBefore(temNode, node);
				node.parentNode.removeChild(node);
				mode["text"].focus(temNode);
				nodeFocus(temNode);
				nowNode = temNode;
				toolBarModeSetting("text", mode["text"].setting);
				container[meditId].updateId();
				nowMode = "text";
			},
			isMerge: true,
			focus: function(node) {
				node.setAttribute("contentEditable", "true");
				node.setAttribute("class", "medit-editing");
			},
			blur: function(node) {
				node.innerHTML = node.innerHTML.replace(selectTextReg, "$1");
				node.removeAttribute("contentEditable");
				node.removeAttribute("class");
			},
			empty: function(node) {
				return node.innerHTML == "";
			},
			setting: [{
				name: "bold",
				icon: meditToolImage + "images/text/bold.png",
				doWhat: function(node) {
					var style = node.getAttribute("style");
					var reg = /font\-weight\s*:\s*(.*?)\s*;/i;
					if (reg.test(style)) {
						var regRes = reg.exec(style);
						if (regRes[1] == "bold") {
							node.style.fontWeight = "normal";
							return;
						}
					}
					node.style.fontWeight = "bold";
				}
			}, {
				name: "italic",
				icon: meditToolImage + "images/text/italic.png",
				doWhat: function(node) {
					var style = node.getAttribute("style");
					var reg = /font\-style\s*:\s*(.*?)\s*;/i;
					if (reg.test(style)) {
						var regRes = reg.exec(style);
						if (regRes[1] == "italic") {
							node.style.fontStyle = "normal";
							return;
						}
					}
					node.style.fontStyle = "italic";
				}
			}, {
				name: "underline",
				icon: meditToolImage + "images/text/underline.png",
				doWhat: function(node) {
					var style = node.getAttribute("style");
					var reg = /text\-decoration\s*:\s*(.*?)\s*;/i;
					if (reg.test(style)) {
						var regRes = reg.exec(style);
						if (regRes[1] == "underline") {
							node.style.textDecoration = "none";
							return;
						}
					}
					node.style.textDecoration = "underline";
				}
			}, {
				name: "size",
				icon: meditToolImage + "images/text/size.png",
				doWhat: [{
					name: "fontSizeBig",
					icon: meditToolImage + "images/text/sizeBigger.png",
					doWhat: function(node) {
						var style = node.getAttribute("style");
						var displaySize = getNodeById("medit-tool-button-text-setting-3-doWhat-1");
						var reg = /font\-size\s*:\s*(\d*)\s*(?:.*?)\s*;/i;
						var size = 15;
						if (reg.test(style)) {
							var regRes = reg.exec(style);
							size = ++regRes[1];
						}

						if (displaySize) {
							displaySize.innerHTML = size;
						}
						node.style.fontSize = size + "px";
					}
				}, {
					name: "fontSizeValue",
					icon: "",
					defaultValue: "size"
				}, {
					name: "fontSizeSmall",
					icon: meditToolImage + "images/text/sizeSmaller.png",
					doWhat: function(node) {
						var style = node.getAttribute("style");
						var displaySize = getNodeById("medit-tool-button-text-setting-3-doWhat-1");
						var reg = /font\-size\s*:\s*(\d*)\s*(?:.*?)\s*;/i;
						var size = 13;
						if (reg.test(style)) {
							var regRes = reg.exec(style);
							size = --regRes[1];
							if (size < 12) size = 12;
						}

						if (displaySize) {
							displaySize.innerHTML = size;
						}
						node.style.fontSize = size + "px";
					}
				}]
			}, {
				name: "color",
				icon: meditToolImage + "images/text/color.png",
				doWhat: [{
					name: "black",
					icon: meditToolImage + "images/text/colorBlack.png",
					doWhat: function(node) {
						node.style.color = "#000000";
					}
				}, {
					name: "red",
					icon: meditToolImage + "images/text/colorRed.png",
					doWhat: function(node) {
						node.style.color = "#ff0000";
					}
				}, {
					name: "green",
					icon: meditToolImage + "images/text/colorGreen.png",
					doWhat: function(node) {
						node.style.color = "#00ff00";
					}
				}, {
					name: "blue",
					icon: meditToolImage + "images/text/colorBlue.png",
					doWhat: function(node) {
						node.style.color = "#0000ff";
					}
				}, {
					name: "yellow",
					icon: meditToolImage + "images/text/colorYellow.png",
					doWhat: function(node) {
						node.style.color = "#ffff00";
					}
				}, {
					name: "pink",
					icon: meditToolImage + "images/text/colorPink.png",
					doWhat: function(node) {
						node.style.color = "#ff00ff";
					}
				}]
			}],
			selecting: function(node, isAdd) {
				var selectReg = selectTextReg;
				if (selectReg.test(node.innerHTML)) {
					var regRes = node.innerHTML.split(selectReg);
					if (isAdd) {
						if (regRes[1].length > 1) {
							if (/^&nbsp;|^<(.*?)\s(.*?)>(.*?)<\/(.*?)>/.test(regRes[1])) {
								var innerTagReg = /^&nbsp;|^<(.*?)\s(.*?)>(.*?)<\/(.*?)>/.exec(regRes[1]);
								var replaceHTML = innerTagReg[0];
								regRes[0] += replaceHTML;
								regRes[1] = regRes[1].replace(/^&nbsp;|^<(.*?)\s(.*?)>(.*?)<\/(.*?)>/, "");
							} else {
								regRes[0] = regRes[0] + regRes[1].slice(0, 1);
								regRes[1] = regRes[1].slice(1);
							}
						}
					} else {
						if (regRes[1].length > 1) {
							if (/<(.*?)\s(.*?)>(.*?)<\/(.*?)>$|&nbsp;$/.test(regRes[1])) {
								var innerTagReg = /<(.*?)\s(.*?)>(.*?)<\/(.*?)>$|&nbsp;$/.exec(regRes[1]);
								var replaceHTML = innerTagReg[0];
								regRes[2] = replaceHTML + regRes[2];
								regRes[1] = regRes[1].replace(/<(.*?)\s(.*?)>(.*?)<\/(.*?)>$|&nbsp;$/, "");
							} else {
								regRes[2] = regRes[1].slice(-1) + regRes[2];
								regRes[1] = regRes[1].slice(0, -1);
							}
						}
					}

					node.innerHTML = regRes[0] + '<span class="medit-text-select">' + regRes[1] + '</span>' + regRes[2];
				} else {
					node.innerHTML = '<span class="medit-text-select">' + node.innerHTML + '</span>';
				}
			},
			selected: function(thisNode) {
				var selectReg = selectTextReg;
				var newNode;
				var contain = container[meditId];
				if (selectReg.test(thisNode.innerHTML)) {
					var thisId = regNodeId.exec(thisNode.getAttribute("id"))[1];
					var regRes = thisNode.innerHTML.split(selectReg);
					var style = thisNode.getAttribute("style");
					if (regRes[0] !== '') {
						var spanPre = document.createElement("span");
						spanPre.setAttribute("data-medit", "true");
						spanPre.setAttribute("data-meditMode", "text");
						spanPre.setAttribute("id", "medit-" + thisId + "-" + meditId);
						spanPre.setAttribute("style", style);
						spanPre.innerHTML = regRes[0];
						thisNode.parentNode.insertBefore(spanPre, thisNode);
						thisId++;
					}
					if (regRes[2] !== '') {
						thisNode.innerHTML = regRes[2];
						var span = document.createElement("span");
						span.setAttribute("data-medit", "true");
						span.setAttribute("data-meditMode", "text");
						span.setAttribute("id", "medit-" + thisId + "-" + meditId);
						span.setAttribute("contentEditable", "true");
						span.setAttribute("class", "medit-editing");
						span.setAttribute("style", style);
						span.innerHTML = regRes[1];
						this.blur(thisNode);
						thisNode.parentNode.insertBefore(span, thisNode);
						newNode = thisNode.previousSibling;
					} else {
						thisNode.innerHTML = regRes[1];
						newNode = thisNode;
					}
					contain.updateId();
					contain.nowNodeId = thisId;
					nodeFocus(newNode);
				} else {
					newNode = thisNode;
				}
				return newNode;
			}
		},
		"br": {
			icon: meditToolImage + 'images/mode/br.png',
			doWhat: function(node) {
				mode[node.getAttribute("data-meditmode")].blur(node);
				var temNode = document.createElement("span");
				temNode.style.display = "block";
				temNode.innerHTML = " ";
				temNode.setAttribute("data-medit", "true");
				temNode.setAttribute("data-meditmode", "br");
				node.parentNode.insertBefore(temNode, node);
				node.parentNode.removeChild(node);
				mode["br"].focus(temNode);
				nodeFocus(temNode);
				nowNode = temNode;
				toolBarModeSetting("br", []);
				container[meditId].updateId();
				nowMode = "br";
			},
			focus: function(node) {
				node.style.backgroundColor = "#e5e5e5";
			},
			blur: function(node) {
				node.style.backgroundColor = "";
			}
		},
		"link": {
			icon: meditToolImage + 'images/mode/link.png',
			doWhat: function(node) {

				var parent = node;
				while (parent.parentNode.getAttribute("data-medit")) {
					parent = parent.parentNode;
				}
				if (parent.nodeName.toLowerCase() == "a") {
					return;
				}

				var linkNode = document.createElement("a");
				linkNode.setAttribute("data-medit", "true");
				linkNode.setAttribute("data-meditmode", "link");
				mode[node.getAttribute("data-meditmode")].blur(node);
				node.parentNode.insertBefore(linkNode, node);
				node.parentNode.removeChild(node);
				linkNode.appendChild(node);
				toolBarModeSetting("link", mode['link'].setting);
				mode["link"].focus(linkNode);
				container[meditId].updateId();
				container[meditId].nowNodeId = regNodeId.exec(linkNode.getAttribute("id"))[1];
				nowMode = "link";
				clearTimeout(nodeFocusTimeout);
				nowNode = linkNode;
			},
			setting: [{
				name: "setting",
				icon: meditToolImage + "images/link/setting.png",
				doWhat: function(node) {
					var href = node.getAttribute("data-meditHref");
					var hrefHtml = '';
					if (href) {
						hrefHtml = ' value="' + href + '"';
					}
					var target = node.getAttribute("target");
					if (target && target != "_blank") {
						target = "";
					} else {
						target = " checked";
					}

					var html = '链接地址 Link Address:<br /><input type="text" id="medit-settingPage-input-link"' + hrefHtml + '/><br /><br /><input type="checkbox" id="medit-settingPage-check-link"' + target + '>新窗口打开 Open in a new window';
					settingPageDisplay('超链接设置 Link Setting', html, function() {
						var href = getNodeById("medit-settingPage-input-link");
						if (href) {
							node.setAttribute("data-meditHref", href.value);
						}
						var checkbox = getNodeById("medit-settingPage-check-link");
						if (checkbox.checked) {
							node.setAttribute("target", "_blank");
						} else {
							node.removeAttribute("target");
						}
						settingPage.style.display = "none";
					});
				}
			}, {
				name: "cancellink",
				icon: meditToolImage + "images/link/cancel-link.png",
				doWhat: function(node) {
					var childs = toArray(node.children);
					var temNode = childs[0];
					var temMode = temNode.getAttribute("data-meditmode");
					childs.forEach(function(child) {
						node.parentNode.insertBefore(child, node);
					});
					node.parentNode.removeChild(node);
					container[meditId].updateId();
					toolBarModeSetting(temMode, mode[temMode].setting);
					mode[temMode].focus(temNode);
					nowNode = temNode;
					nodeFocus(temNode);
				}
			}],
			focus: function(node) {
				getNodeById("medit-tool-button-mode").style.display = "none";
				node.setAttribute("class", "medit-link");
			},
			blur: function(node) {
				node.removeAttribute("class");
			}
		},
		"image": {
			icon: meditToolImage + "images/mode/image.png",
			doWhat: function(node) {
				mode[node.getAttribute("data-meditmode")].blur(node);
				var temNode = document.createElement("img");
				temNode.setAttribute("data-medit", "true");
				temNode.setAttribute("data-meditmode", "image");
				temNode.setAttribute("src", mode["image"].icon);
				temNode.setAttribute("width", "32");
				temNode.setAttribute("height", "32");
				node.parentNode.insertBefore(temNode, node);
				node.parentNode.removeChild(node);
				mode["image"].focus(temNode);
				nodeFocus(temNode);
				nowNode = temNode;
				toolBarModeSetting("image", mode["image"].setting);
				container[meditId].updateId();
				nowMode = "image";
			},
			focus: function(node) {
				node.setAttribute("class", "medit-image");
			},
			blur: function(node) {
				node.removeAttribute("class");
			},
			setting: [{
				name: "setting",
				icon: meditToolImage + "images/image/setting.png",
				doWhat: function(node) {
					var width = node.getAttribute("width");
					var height = node.getAttribute("height");
					var address = node.getAttribute("src");
					var html = '宽度 Width:<br /><input type="text" id="medit-settingPage-image-width" value="' + width + '"><br /><br />高度 Height:<br /><input type="text" id="medit-settingPage-image-height" value="' + height + '"><br /><br />图像地址 Address:<br /><input type="text" id="medit-settingPage-image-address" value="' + address + '">';
					settingPageDisplay('图像设置 Image Setting', html, function() {
						var width = getNodeById("medit-settingPage-image-width").value;
						if (width && width > 0) {
							node.setAttribute("width", width);
						}
						var height = getNodeById("medit-settingPage-image-height").value;
						if (height && height > 0) {
							node.setAttribute("height", height);
						}
						var newAddress = getNodeById("medit-settingPage-image-address").value;
						if (address != newAddress) { // 传入网络图片需要进行宽高转换
							getNodeById("medit-settingPage-button").style.display = "none";
							getNodeById("medit-settingPage-content").innerHTML = "Loading Image...";
							var newImg = new Image();
							newImg.src = newAddress;
							newImg.onload = function() {
								var scale = newImg.width / newImg.height;
								if (newImg.width > 100) {
									newImg.width = 100;
									newImg.height = 100 / scale;
								}
								settingPage.style.display = "none";
								node.setAttribute("src", newAddress);
								node.setAttribute("width", newImg.width);
								node.setAttribute("height", newImg.height);
							}
						} else {
							settingPage.style.display = "none";
						}
					});
				}
			}, {
				name: "biger",
				icon: meditToolImage + "images/image/biger.png",
				doWhat: function(node) {
					var width = node.getAttribute("width");
					var height = node.getAttribute("height");
					node.setAttribute("width", Math.ceil(width * 1.1));
					node.setAttribute("height", Math.ceil(height * 1.1));
				}
			}, {
				name: "smaller",
				icon: meditToolImage + "images/image/smaller.png",
				doWhat: function(node) {
					var width = node.getAttribute("width");
					var height = node.getAttribute("height");
					node.setAttribute("width", Math.ceil(width / 1.1));
					node.setAttribute("height", Math.ceil(height / 1.1));
				}
			}, {
				name: "upload",
				icon: meditToolImage + "images/image/upload.png",
				doWhat: function(node) {
					var config = container[meditId].imageUpload;
					var html = '<form enctype="multipart/form-data" method="post" id="medit-image-upload-form"><input type="file" name="' + config.name + '" id="medit-image-upload-file"/></form><div id="medit-image-upload-select-btn">选择图片 Select Image</div>';
					settingPageDisplay('图像上传 Image upload', html, function() {

						var files = getNodeById("medit-image-upload-file");
						if (files.files.length <= 0) {
							return;
						}
						var file = files.files[0];
						var size = file.size;
						var name = file.name;
						var type = file.type;
						var config = container[meditId].imageUpload;
						var ext = {};
						config.ext.forEach(function(v) {
							ext[commonImageType[v]] = true;
						});

						if (config.size == 0 || config.size >= size) {
							if (ext[type]) {
								var http = getXhr();
								var form = new FormData(getNodeById("medit-image-upload-form"));
								getNodeById("medit-settingPage-button").style.display = "none";
								getNodeById("medit-settingPage-content").innerHTML = '<div id="medit-settingPage-content-img-uploading">图片上传中 Image uploading...</div>';
								http.upload.onprogress = function(v) {
									var progress = Math.floor(100 * v.loaded / v.total) + "%";
									var success = "";
									if (progress == "100%") success = "上传成功，请稍后...<br />upload success,please waiting...";
									getNodeById("medit-settingPage-content").innerHTML = '<div id="medit-settingPage-content-img-uploading">图片上传中 Image uploading...' + progress + '<br /><i id="medit-settingPage-content-img-uploading-progress" style="width:' + progress + ';"></i>' + success + '</div>';
								}

								http.open("POST", config.path);
								http.send(form);

								http.onreadystatechange = function() {
									if (http.readyState === 4) {
										if (http.status === 200 || http.status > 200 && http.status < 400) {
											var res = JSON.parse(http.responseText);

											if (res.code == "success") {
												config.success(res);
												var scale = res.data.width / res.data.height;
												if (res.data.width > 100) {
													res.data.width = 100;
													res.data.height = 100 / scale;
												}
												settingPage.style.display = "none";
												node.setAttribute("src", res.data.url);
												node.setAttribute("width", res.data.width);
												node.setAttribute("height", res.data.height);
											}
										} else {
											config.error("http status " + http.status);
										}
									}
								}
							} else {
								config.error("image type limit " + config.ext.join(","));
							}
						} else {
							config.error("image size limit " + config.size);
						}
					});
					getNodeById("medit-settingPage-button-ok").innerHTML = "上传 Upload";
					var btn = getNodeById("medit-image-upload-select-btn");
					var fileInput = getNodeById("medit-image-upload-file");

					btn.onclick = function() {
						fileInput.click();
					}
					fileInput.onchange = function(e) {

						e = e || window.event;
						var files = e.target.files || e.srcElement.files;
						var file = files[0];
						var size = file.size;
						var name = file.name;
						var type = file.type;

						var ext = {};
						config.ext.forEach(function(v) {
							ext[commonImageType[v]] = true;
						});

						if (config.size == 0 || config.size >= size) {
							if (ext[type]) {
								btn.innerHTML = name;
							} else {
								config.error("image type limit " + config.ext.join(","));
							}
						} else {
							config.error("image size limit " + config.size);
						}
					}
				}
			}, {
				name: 'verticalAlign',
				icon: meditToolImage + 'images/image/vertical-align.png',
				doWhat: [{
					name: 'top',
					icon: meditToolImage + 'images/image/top-align.png',
					doWhat: function(node) {
						node.style.verticalAlign = "top";
					}
				}, {
					name: 'middle',
					icon: meditToolImage + 'images/image/middle-align.png',
					doWhat: function(node) {
						node.style.verticalAlign = "middle";
					}
				}, {
					name: 'bottom',
					icon: meditToolImage + 'images/image/bottom-align.png',
					doWhat: function(node) {
						node.style.verticalAlign = "bottom";
					}
				}]
			}]
		},
		"list": {
			emptyNotDelete: true,
			icon: meditToolImage + "images/mode/list.png",
			focus: function(node) {
				node.setAttribute("class", "medit-list");
				getNodeById("medit-tool-button-mode").style.display = "none";
			},
			blur: function(node) {
				node.removeAttribute("class");
			},
			doWhat: function(node) {
				mode[node.getAttribute("data-meditmode")].blur(node);
				var temNode = document.createElement("ul");
				temNode.setAttribute("data-medit", "true");
				temNode.setAttribute("data-meditmode", "list");
				temNode.setAttribute("type", "disc");
				node.parentNode.insertBefore(temNode, node);
				node.parentNode.removeChild(node);
				nodeFocus(temNode);
				nowNode = temNode;
				toolBarModeSetting("list", mode["list"].setting);
				mode["list"].focus(temNode);
				container[meditId].updateId();
				nowMode = "list";
			},
			setting: [{
				name: "setting",
				icon: meditToolImage + "images/list/setting.png",
				doWhat: function(node) {
					var type = node.getAttribute("type").toLowerCase();
					var nodeType = node.nodeName.toLowerCase();
					var html = '无序列表 Unorder List：<br /><input type="radio" class="medit-list-mode-style-ul" value="disc" name="medit-list-mode-style"' + (type == "disc" ? " checked" : "") + '>disc 实心圆<br /><input type="radio" class="medit-list-mode-style-ul" value="circle" name="medit-list-mode-style"' + (type == "circle" ? " checked" : "") + '>circle 空心圆<br /><input type="radio" class="medit-list-mode-style-ul" value="square" name="medit-list-mode-style"' + (type == "square" ? " checked" : "") + '>square 实心方块<br /><hr />有序列表 Order List：<br /><input type="radio" class="medit-list-mode-style-ol" value="1" name="medit-list-mode-style"' + (type == "1" ? " checked" : "") + '>1、2、3、4<br /><input type="radio" class="medit-list-mode-style-ol" value="a" name="medit-list-mode-style"' + (type == "a" ? " checked" : "") + '>a、b、c、d<br /><input type="radio" class="medit-list-mode-style-ol" value="A" name="medit-list-mode-style"' + (type == "A" ? " checked" : "") + '>A、B、C、D<br /><input type="radio" value="i" class="medit-list-mode-style-ol" name="medit-list-mode-style"' + (type == "i" ? " checked" : "") + '>i, ii, iii, iv<br /><input type="radio" class="medit-list-mode-style-ol" value="I" name="medit-list-mode-style"' + (type == "I" ? " checked" : "") + '>I, II, III, IV';
					settingPageDisplay('列表类型 List Mode', html, function() {
						var radio = getNodeById("medit-settingPage-content").getElementsByTagName("input");
						var input = null;
						for (var i = 0; i < radio.length; i++) {
							if (radio[i].checked) {
								input = radio[i];
								break;
							}
						}
						var newType = input.getAttribute("class").split("-").pop();
						if (nodeType == newType) {
							node.setAttribute("type", input.value);
						} else {
							var temNode = document.createElement(newType);
							temNode.setAttribute("data-medit", "true");
							temNode.setAttribute("data-meditmode", "list");
							temNode.setAttribute("type", input.value);
							node.parentNode.insertBefore(temNode, node);
							var childNode = toArray(node.children);
							childNode.forEach(function(v) {
								temNode.appendChild(v);
							});
							node.parentNode.removeChild(node);
							nodeFocus(temNode);
							nowNode = temNode;
							mode["list"].focus(temNode);
							container[meditId].updateId();
						}
						settingPage.style.display = "none";
					});
				}
			}, {
				name: "newLi",
				icon: meditToolImage + "images/list/newLi.png",
				doWhat: function(node) {
					mode["list"].blur(node);
					var temNode = document.createElement("li");
					temNode.setAttribute("data-medit", "true");
					temNode.setAttribute("data-meditmode", "li");
					node.appendChild(temNode);

					nodeFocus(temNode);
					nowNode = temNode;
					toolBarModeSetting("li", mode["li"].setting);
					container[meditId].updateId();
					nowMode = "li";
					mode["li"].focus(temNode);
				}
			}]
		},
		"li": {
			notDisplay: true,
			emptyNotDelete: true,
			focus: function(node) {
				node.setAttribute("class", "medit-list");
				if (!node.children.length) {
					node.setAttribute("contentEditable", true);
				}
				getNodeById("medit-tool-button-mode").style.display = "none";
				getNodeById("medit-tool-button-addLeft").style.display = "none";
				getNodeById("medit-tool-button-addRight").style.display = "none";
			},
			blur: function(node) {
				node.removeAttribute("class");
				node.removeAttribute("contentEditable");
				if (!node.children.length) {
					if (!/^\s*$/.test(node.innerHTML.replace(/&nbsp;/g, ""))) {

						var span = document.createElement("span");
						span.setAttribute("data-medit", "true");
						span.setAttribute("data-meditMode", "text");
						span.innerHTML = node.innerHTML;
						node.innerHTML = "";
						node.appendChild(span);
						container[meditId].updateId();
						container[meditId].nowNodeId++;
						return span;
					} else {
						node.innerHTML = "";
						return {
							exit: true
						};
					}
				}
			},
			setting: [{
				name: "addLeft",
				icon: meditToolImage + "images/list/add-top.png",
				doWhat: function(node) {
					mode["list"].blur(node);
					var temNode = document.createElement("li");
					temNode.setAttribute("data-medit", "true");
					temNode.setAttribute("data-meditmode", "li");
					node.parentNode.insertBefore(temNode, node);
					nodeFocus(temNode);
					nowNode = temNode;
					container[meditId].updateId();
					mode["li"].focus(temNode);
				}
			}, {
				name: "addRight",
				icon: meditToolImage + "images/list/add-bottom.png",
				doWhat: function(node) {
					mode["list"].blur(node);
					var temNode = document.createElement("li");
					temNode.setAttribute("data-medit", "true");
					temNode.setAttribute("data-meditmode", "li");
					if (node.nextSibling) {
						node.parentNode.insertBefore(temNode, node.nextSibling);
					} else {
						node.parentNode.appendChild(temNode);
					}
					nodeFocus(temNode);
					nowNode = temNode;
					container[meditId].updateId();
					mode["li"].focus(temNode);
				}
			}]
		}
	}

	var isType = function(ele, type) { // 输入一个对象和一个type值，返回这个对象是不是这种type
		if (!ele || !type) return false;
		return {}.toString.call(ele).slice(8, -1).toLowerCase() === type.toLowerCase();
	}

	var mergeStyleIsSimilar = function(styleA, styleB) { // 判断合并的两个模块样式是否相同
		if (styleA) {
			styleA = styleA.replace(regNormalStyle, "");
		}
		if (styleB) {
			styleB = styleB.replace(regNormalStyle, "");
		}
		if (!styleA && !styleB) return true;
		if (styleA && !styleB || !styleA && styleB) return false;

		var styleArrA = styleA.split(";").sort();
		var styleArrB = styleB.split(";").sort();

		if (styleArrA.length != styleArrB.length) return false;

		for (var i = 0; i < styleArrA.length; i++) {
			if (styleArrA[i] !== styleArrB[i]) return false;
		}
		return true;
	}

	var mergeSimilarNextNode = function(node) { // 向后合并相似模块结点
		var nowMode = node.getAttribute("data-meditMode");
		var nowStyle = node.getAttribute("style");
		var nextNode = node.nextSibling;
		if (!nextNode) {
			nodeFocus(node);
			return node;
		}
		var nextMode = nextNode.getAttribute("data-meditMode");
		if (nowMode == nextMode && nextNode && mode[nowMode].isMerge) {
			var nodeMode = nextNode.getAttribute("data-meditMode");
			var nextStyle = nextNode.getAttribute("style");
			if (mergeStyleIsSimilar(nowStyle, nextStyle) && !!node.innerHTML && !!nextNode.innerHTML) {
				node.innerHTML = node.innerHTML + nextNode.innerHTML;
				node.parentNode.removeChild(nextNode);
				container[meditId].updateId();
				nodeFocus(node);
				if (node.nextSibling) {
					return mergeSimilarNextNode(node);
				}
			}
		}
		return node;
	}

	var mergeSimilarPreNode = function(node) { // 向前合并相似模块结点
		var nowMode = node.getAttribute("data-meditMode");
		var nowStyle = node.getAttribute("style");
		var previousNode = node.previousSibling;
		if (!previousNode) {
			nodeFocus(node);
			return node;
		}
		var previousMode = previousNode.getAttribute("data-meditMode");
		if (previousMode == nowMode && previousNode && mode[nowMode].isMerge) {
			var nodeMode = previousNode.getAttribute("data-meditMode");
			var previousStyle = previousNode.getAttribute("style");
			if (mergeStyleIsSimilar(nowStyle, previousStyle)) {
				var nowId = regNodeId.exec(previousNode.getAttribute("id"))[1];
				previousNode.innerHTML = previousNode.innerHTML + node.innerHTML;
				previousNode.parentNode.removeChild(node);

				container[meditId].updateId();
				nodeFocus(previousNode);
				node = previousNode;
				if (node.previousSibling) {
					return mergeSimilarPreNode(node);
				}
			}
		}
		return node;
	}

	var gevent = function(ele, event, func) { // 通用事件处理模块
		if (isType(event, "array")) {
			event.forEach(function(v) {
				gevent(ele, v, func);
			});
		} else {
			if (window.addEventListener) {
				ele.addEventListener(event, func, false);
			} else if (window.attachEvent) {
				ele.attachEvent("on" + event, func);
			} else {
				ele["on" + event] = func;
			}
		}
	}

	var initFromData = function(target) { // 如果原来容器内有数据的话，那么根据原来数据进行初始化

		var contain = target.parentNode; // 获取容器对象

		meditId = contain.getAttribute("data-meditid"); // 获取容器 meditID

		contain = container[meditId]; // 由于所有容器对象均存放于container中，通过此ID进行获取

		contain.updateId();
	}

	var toolBar = (function() {

		var temTool = document.createElement("div");
		temTool.setAttribute("id", "medit-tool");
		document.body.appendChild(temTool);

		var tool = getNodeById("medit-tool");


		gevent(tool, ["touchmove"], function(e) {
			isToolMove = true;
		});
		gevent(tool, ["touchend"], function(e) {
			if (isToolMove) {
				isToolMove = false;
				return;
			}
			e = e || window.event;
			var target = e.target || e.srcElement;

			var type = target.getAttribute("data-meditToolStyle");
			if (!type) return false;

			var degree = target.getAttribute("data-meditToolDegree");

			mainDo(degree, type, target);

		});

		return tool;

	})();

	var settingPage = (function() {
		var temSettingPage = document.createElement("div");
		temSettingPage.setAttribute("id", "medit-settingPage");
		temSettingPage.innerHTML = '<div id="medit-settingPage-main"></div>';
		document.body.appendChild(temSettingPage);

		var setingObj = getNodeById("medit-settingPage");

		gevent(setingObj, ["touchmove"], function(e) {
			e = e || window.event;
			e.preventDefault();
			e.stopPropagation();
		});

		gevent(setingObj, ["touchend"], function(e) {

			e = e || window.event;
			var target = e.target || e.srcElement;

			var targetId = target.getAttribute("id");

			if (targetId === "medit-settingPage-button-cancel") {
				e.preventDefault();
				e.stopPropagation();
				settingPageOk = null;
				settingPage.style.display = "none";
				return;
			}
			if (targetId === "medit-settingPage-button-ok") {
				e.preventDefault();
				e.stopPropagation();
				settingPageOk();
				return;
			}
			if (mode[nowMode].settingPage) {
				mode[nowMode].settingPage(target);
			}

		});

		return setingObj;
	})();

	var settingPageOk = null;

	var settingPageDisplay = function(title, content, okCallBack) {

		var html = [];
		html.push(title ? '<div id="medit-settingPage-title">' + title + '</div>' : '');
		html.push('<div id="medit-settingPage-content">' + content + '</div>');
		html.push('<div id="medit-settingPage-button"><i id="medit-settingPage-button-ok">确定 Ok</i><i id="medit-settingPage-button-cancel">取消 Cancel</i></div>');
		getNodeById("medit-settingPage-main").innerHTML = html.join("");
		settingPageOk = okCallBack;
		settingPage.style.display = "block";
	}

	var mainDo = function(degree, type, target) {

		var contain = container[meditId];
		var thisNode = getNodeById("medit-" + contain.nowNodeId + "-" + meditId); // 这里有个已经修复的bug，比如在超链接中，是在当前结点外部包了一层，那么thisNode需要更新到外层结点

		nowMode = thisNode.getAttribute("data-meditMode");
		if (degree == 1) {
			switch (type) {
				case 'delete':
					if (mode[nowMode].blur) {
						mode[nowMode].blur(thisNode);
					}

					while (thisNode.parentNode.getAttribute("data-medit") && thisNode.parentNode.children.length === 1 && !mode[thisNode.parentNode.getAttribute("data-meditMode")].emptyNotDelete) {
						thisNode = thisNode.parentNode;
					}
					thisNode.parentNode.removeChild(thisNode);
					contain.updateId();
					toolBarHidden();
					break;
				case 'ok':
					if (mode[nowMode].blur) {
						mode[nowMode].blur(thisNode);
					}

					if (mode[nowMode].empty && mode[nowMode].empty(thisNode)) thisNode.parentNode.removeChild(thisNode);
					toolBarHidden();
					contain.nodeCount++;

					thisNode = mergeSimilarNextNode(thisNode);
					mergeSimilarPreNode(thisNode);
					break;
				case 'addLeft':
					if (mode[nowMode].empty && mode[nowMode].empty(thisNode)) {
						return;
					}
					if (mode[nowMode].blur) {
						mode[nowMode].blur(thisNode);
					}
					contain.createSpan(contain.nowNodeId, thisNode, false, true);
					break;
				case 'addRight':
					if (mode[nowMode].empty && mode[nowMode].empty(thisNode)) {
						return;
					}
					if (mode[nowMode].blur) {
						mode[nowMode].blur(thisNode);
					}
					contain.createSpan(contain.nowNodeId, thisNode, true, true);

					break;
				case 'mode':
					var toolBarRes = [];
					toolBarRes.push(returnButtonHtml(nowMode + "-setting-1"));

					for (var modeType in mode) {
						if (mode.hasOwnProperty(modeType) && modeType != nowMode && !mode[modeType].notDisplay) {
							var style = mode[modeType].icon ? ' style="background:#fff url(' + mode[modeType].icon + ') no-repeat center center;background-size: 24px;"' : '';

							toolBarRes.push('<span id="medit-tool-button-' + modeType + '" class="medit-tool-button" data-meditToolStyle="' + modeType + '"' + style + ' data-meditToolDegree="2">&nbsp;</span>');
						}
					}
					toolBar.innerHTML = toolBarRes.join("");
					break;

				case 'return':
					var path = target.getAttribute("id").replace("medit-tool-button-", "");
					var nodePath = path.split("-");
					var doWhat = mode;
					var pathMode = null;

					nodePath.pop();
					path = path.replace(/\-[a-zA-Z]*\-\d*$/, '');

					while (pathMode = nodePath.shift()) {
						doWhat = doWhat[pathMode];
					}
					toolBarModeSetting(path, doWhat);

					break;
			}
		} else {

			if (mode[nowMode].selected) {
				thisNode = mode[nowMode].selected(thisNode);
			}

			var pathRes = target.getAttribute("id").replace("medit-tool-button-", "");

			var pathArr = pathRes.split("-");

			var pathMode = null;

			var doWhat = mode;

			while (pathMode = pathArr.shift()) {
				doWhat = doWhat[pathMode];
			}

			doWhat = doWhat.doWhat;
			if (isType(doWhat, "array")) {
				toolBarModeSetting(pathRes, doWhat);
			} else {
				doWhat(thisNode);
			}
		}

		if (!contain.node.children.length) contain.node.innerHTML = contain.preHTML || "Medit";
	}

	var toolBarModeSetting = function(path, list) {

		var pathRes = path.split("-");

		var toolBarRes = [];

		if (pathRes.length === 1) {

			mainButton.forEach(function(v, index) {

				if (v === "setting") {
					if (list) {
						list.forEach(function(listv, listIndex) {

							var defaultValue = listv.defaultValue || "&nbsp;";

							var style = listv.icon ? ' style="background:#fff url(' + listv.icon + ') no-repeat center center;background-size: 24px;"' : '';

							toolBarRes.push('<span id="medit-tool-button-' + path + '-setting-' + listIndex + '" class="medit-tool-button" data-meditToolStyle="' + path + "-setting-" + listIndex + '"' + style + ' data-meditToolDegree="2">' + defaultValue + '</span>');
						});
					}
				} else {
					toolBarRes.push('<span id="medit-tool-button-' + v + '" class="medit-tool-button medit-tool-' + v + '" data-meditToolStyle="' + v + '" data-meditToolDegree="1">&nbsp;</span>');
				}
			});

		} else {
			toolBarRes.push(returnButtonHtml(path));
			if (!!list.length) {
				list.forEach(function(listv, listIndex) {

					var defaultValue = listv.defaultValue || "&nbsp;";

					var style = listv.icon ? ' style="background:#fff url(' + listv.icon + ') no-repeat center center;background-size: 24px;"' : ' style="background:#fff;"';

					toolBarRes.push('<span id="medit-tool-button-' + path + '-doWhat-' + listIndex + '" class="medit-tool-button" data-meditToolStyle="' + path + "-doWhat-" + listIndex + '"' + style + ' data-meditToolDegree="2">' + defaultValue + '</span>');
				});
			}
		}

		toolBar.innerHTML = toolBarRes.join("");

	}

	var toolBarDisplay = function() {
		if (toolBarCatch)
			toolBar.innerHTML = toolBarCatch;
		toolBar.style.display = "block";
	}

	var toolBarHidden = function() {
		nowNode = null;
		toolBar.style.display = "none";
	}

	var toBr = function(node) {
		node.setAttribute("style", "display:block");
		node.setAttribute("data-meditMode", "br");
		node.setAttribute("contentEditable", "false");
		node.setAttribute("class", "");
		node.innerHTML = " ";
	}

	var nodeFocus = function(node) { // 使模块自动获取焦点 使用了很多方法，最后发现这个方法是在移动端最好的
		nodeFocusTimeout = setTimeout(function() {
			node.focus();
			container[meditId].nowNodeId = regNodeId.exec(node.getAttribute("id"))[1];
		}, 10);
	}

	var selectModeContent = function(isAdd) {
		if (nowNode) {
			var nodeMode = nowNode.getAttribute("data-meditmode");
			var nodeModeObj = mode[nodeMode];
			if (nodeModeObj.selecting) {
				nodeModeObj.selecting(nowNode, isAdd);
			}
		}
	}

	var medit = function(node) {
		if (!(this instanceof medit)) return new medit(node);

		if (!node || node.nodeType != 1) return false;

		this.node = node;
		this.nodeCount = 0; // 容器所有子元素数目
		this.nowNodeId = 0; // 容器当前子元素ID

		this.getContent = medit.prototype.getContent;

		this.node.setAttribute("data-meditId", container.length);

		this.imageUpload = { // 默认图片上传设置，由于是文件上传，所以在跨域方法仅支持CORS
			path: 'https://sm.ms/api/upload',
			name: 'smfile',
			size: 0,
			timeout: 0,
			ext: ["jpg", "jpeg", "png", "gif", "bmp"],
			success: function() {},
			error: function() {}
		}

		container.push(this);

		gevent(this.node, ["touchstart"], function(e) {
			mainTouchPoint = e.targetTouches[0];
		});

		gevent(this.node, ["touchmove"], function(e) {

			e = e || window.event;
			var distance = e.targetTouches[0].clientX - mainTouchPoint.clientX;

			if (Math.abs(distance) > 50) {
				var isAdd = distance > 0 ? true : false;
				selectModeContent(isAdd);
				mainTouchPoint = e.targetTouches[0];
			}
			isContainMove = true;
		});
		gevent(this.node, ["touchend"], this.editContainFocus);

		gevent(this.node, ["keydown"], function(e) {
			e = e || window.event;
			if (e.keyCode == 13) {
				e.preventDefault();
				var contain = container[meditId];
				var thisNode = getNodeById("medit-" + contain.nowNodeId + "-" + meditId);
				nowMode = thisNode.getAttribute("data-meditMode");
				if (mode[nowMode].blur) {
					var newNode = mode[nowMode].blur(thisNode); // 如果当前按下回车按钮的块需要对内容进行处理，或者是结点进行改变了
					if (newNode) {
						if (newNode.exit) return; // 不需要继续创建新的结点了
						thisNode = newNode;
					}
				}
				contain.createSpan(contain.nowNodeId, thisNode, true, true);

				var brNode = getNodeById("medit-" + contain.nowNodeId + "-" + meditId);
				toBr(brNode);

				contain.createSpan(contain.nowNodeId, brNode, true, true);
			}
		});
	}

	var returnNextNodeId = function(node) {
		var child = node.children;
		if (child.length) return returnNextNodeId(child[child.length - 1]);
		return Number(regNodeId.exec(node.getAttribute("id"))[1]) + 1;
	}

	medit.prototype.createSpan = function(nodeId, fromNode, isAfter, isAutoFocus) { // 因为在内部创建span的时候不会自动focus，需要调用一下focus方法
		var span = document.createElement("span");
		span.setAttribute("data-medit", "true");
		span.setAttribute("data-meditMode", "text");
		span.setAttribute("id", "medit-" + nodeId + "-" + meditId);
		span.setAttribute("contentEditable", "true");
		span.setAttribute("class", "medit-editing");
		if (fromNode) {
			if (!isAfter) {
				this.nowNodeId = nodeId;
				fromNode.parentNode.insertBefore(span, fromNode);
			} else {
				this.nowNodeId = returnNextNodeId(fromNode);
				if (!fromNode.nextSibling) {
					fromNode.parentNode.appendChild(span);
				} else {
					fromNode.parentNode.insertBefore(span, fromNode.nextSibling);
				}
			}
			this.updateId();
		} else {
			this.node.appendChild(span);
		}
		var editor = getNodeById("medit-" + this.nowNodeId + "-" + meditId);
		nowNode = editor;
		toolBarModeSetting("text", mode["text"].setting);

		if (isAutoFocus) {
			nodeFocus(editor);
		}
	}

	medit.prototype.updateId = function(nodeId, list) {

		var child = list || toArray(this.node.children);
		var index = nodeId || 0;
		child.forEach(function(v) {
			if (v.getAttribute("href")) { // 防止超链接在内部触发
				v.setAttribute("data-meditHref", v.getAttribute("href"));
				v.removeAttribute("href");
			}
			v.setAttribute("id", "medit-" + (index++) + "-" + meditId);
			var secondChild = toArray(v.children);
			if (secondChild.length) {
				index = container[meditId].updateId(index, secondChild);
			}
		});
		return index;
	}

	medit.prototype.getContent = function(isEdit) {
		isEdit = isEdit || false;
		if (!isEdit && toolBar.style.display == "block") {
			mainDo(1, "ok");
		}
		var html = this.node.innerHTML;
		if (regIsNotContentEmpty.test(html)) {
			html = html.replace(/\sdata\-meditHref="(.*?)"/ig, " href=\"$1\"");
			html = html.replace(selectTextReg, "$1");
			return html.replace(regContent, " ");

		}
		return "";
	}

	medit.prototype.autoSave = function(appId, callBack) { // 自动保存 callBack(data, timeStamp),自动恢复已保存数据
		if (window.localStorage) {
			this.appId = appId;
			var oldData = localStorage.getItem("meditAutosave" + appId); // repair bug: id is need not exits '-'
			var temData = this.getContent(true);
			if (!regIsNotContentEmpty.test(temData) && oldData) {
				meditId = this.node.getAttribute("data-meditid");
				this.node.innerHTML = oldData;
				this.updateId();
			}

			clearInterval(this.autoSaveInterval);
			var _this = this;
			this.autoSaveInterval = setInterval(function() {
				var nowData = _this.getContent(true);
				localStorage.setItem("meditAutosave" + appId, nowData);
				callBack(nowData, (new Date()) - 0);
			}, 1000);
		}
	}

	medit.prototype.image = medit.prototype.imageUpload = function(option) { // 图片上传设置
		var meditId = this.node.getAttribute("data-meditid") - 0;
		var contain = container[meditId];
		for (var item in option) {
			if (contain.imageUpload[item] != null) {
				contain.imageUpload[item] = option[item];
			}
		}
	}

	medit.prototype.clear = function(data) {
		data = data || "";
		clearInterval(this.autoSaveInterval);
		this.node.innerHTML = data;
		if (this.appId != null) {
			localStorage.removeItem("meditAutosave" + this.appId);
		}
	}

	medit.prototype.editContainFocus = function(e) {

		e = e || window.event;
		var target = e.target || e.srcElement;

		if (isContainMove) {
			e.preventDefault();
			e.stopPropagation();
			isContainMove = false;
			return;
		}

		toolBarDisplay();

		if (meditId != null) { // 在已经选择某个区块的时候选择其它的，会先调用这个区块的blur
			var temObj = container[meditId];
			var temNode = getNodeById("medit-" + temObj.nowNodeId + "-" + meditId);
			if (temNode) {
				var temNodeMode = temNode.getAttribute("data-meditMode");
				if (mode[temNodeMode].empty && mode[temNodeMode].empty(temNode) && temNode != target) {
					temNode.parentNode.removeChild(temNode);
					temObj.updateId();
				} else {
					if (mode[temNodeMode].blur) {
						mode[temNodeMode].blur(temNode);
					}
				}

			}
		}

		var type = target.getAttribute("data-medit");
		if (!type && target.getAttribute("data-meditId")) { // target is container
			meditId = target.getAttribute("data-meditId"); // 全局存贮当前medit容器ID
			var meditObj = container[meditId];
			var child = target.children;
			if (!child.length) { // 如果点击了容器发现没有结点，那么就保存原有内容，并且创建新的span
				meditObj.preHTML = target.innerHTML;
				target.innerHTML = "";

				meditObj.createSpan(0);

				target = false;
			} else {
				var temTarget = child[child.length - 1];
				var temTargetMode = temTarget.getAttribute("data-meditMode");
				if (!mode[temTargetMode].empty || !mode[temTargetMode].empty(temTarget)) {
					meditObj.createSpan(child.length - 1, temTarget, true);
					target = false;
				} else {
					target = temTarget;
					nowNode = target;
				}

			}
		} else { // target is 内部包含结点
			while (!target.getAttribute("data-medit")) {
				target = target.parentNode;
			}
			nowNode = target;
		}

		if (target) {
			if (!target.id) {
				var parentNode = target.parentNode;
				while (!parentNode.getAttribute("data-meditid")) {
					parentNode = parentNode.parentNode;
				}
				meditId = parentNode.getAttribute("data-meditid");
				container[meditId].updateId();
			}
			var idExecRes = regNodeId.exec(target.id);
			meditId = Number(idExecRes[2]);
			var meditObj = container[meditId];
			meditObj.nowNodeId = Number(idExecRes[1]);

			var meditNodeMode = target.getAttribute("data-meditMode");

			toolBarModeSetting(meditNodeMode, mode[meditNodeMode].setting);

			if (mode[meditNodeMode].focus) {
				mode[meditNodeMode].focus(target);
			}
		}
	}

	obj.Medit = obj.medit = medit;

})(this);