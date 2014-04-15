/*******************************************************************************
 * Name:common.js Author:delong Des:THIS JS consist of frequently function, The
 * head.jsp should include this
 * 
 * (C) COPYRIGHT IBM Corporation 2012 All Rights Reserved. Licensed
 * Materials-Property of IBM
 ******************************************************************************/
var catalog = {
	initialize:function(){
		if(!Date.prototype.pattern){
			Date.prototype.pattern = function(fmt) {
				var o = {
					"M+" : this.getMonth() + 1, // 月份
					"d+" : this.getDate(), // 日
					"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
					"H+" : this.getHours(), // 小时
					"m+" : this.getMinutes(), // 分
					"s+" : this.getSeconds(), // 秒
					"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
					"S" : this.getMilliseconds()
				// 毫秒
				};
				var week = {
					"0" : "\u65e5",
					"1" : "\u4e00",
					"2" : "\u4e8c",
					"3" : "\u4e09",
					"4" : "\u56db",
					"5" : "\u4e94",
					"6" : "\u516d"
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
							.substr(4 - RegExp.$1.length));
				}
				if (/(E+)/.test(fmt)) {
					fmt = fmt
							.replace(
									RegExp.$1,
									((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
											: "\u5468")
											: "")
											+ week[this.getDay() + ""]);
				}
				for ( var k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
								: (("00" + o[k]).substr(("" + o[k]).length)));
					}
				}
				return fmt;
			};
		};
		if (!String.prototype.trim) {
			String.prototype.trim = function() {
				return this.replace(/(^\s*)(\s*$)/g, "");
			};
		};
		if (!String.prototype.format) {
			String.prototype.format = function(args) {
				// var args = arguments;
				return this.replace(/{(\d+)}/g, function(match, number) {
					return typeof args[number] != 'undefined' ? args[number] : match;
				});
			};
		};
		$.ajaxSetup ({ 
		    cache: false //关闭AJAX相应的缓存 
		}); 
	}
 }
 catalog.initialize();
 
var baseJS = {
		_placeHolder:function(obj, is_input, contentReplaceParam) {
			/****
			 * contentReplaceParam:从resource编译的有{num}的情况下替换{num}的参数 
			 * 数组格式 contentReplaceParam[num]替换{num}里的内容
			 * obj:要从resource进行编译的对象
			 * is_input:对象是否是input框,因为input框是用value赋值的,所以加个参数
			 * *****/
			if (obj[0]) {
				for ( var i = 0, len = obj.length; i < len; i++) {
					placeHolderhtml(obj[i], is_input, args);
				}
			} else {
				placeHolderhtml(obj, is_input, args);
			}
			function placeHolderhtml(obj, is_input) {
				var content;
				var id = obj.getAttribute('dataPlaceholder');
				if (id) {
					try {
						content = eval("_rb." + id);
					} catch (e) {

					}
					if (args) {
						content = content.format(args);
					}
					if (content) {
						if (is_input) {
							obj.value = content;
						} else {
							obj.innerHTML = content;
						}
					} else {
						if (is_input) {
							obj.value = id;
						} else {
							obj.innerHTML = id;
						}
					}
				}
			}
		},
		_Dialog:function(options){
			 var rand = Math.floor(Math.random() * 10);
				this.rand = rand;
				var defaults = {
					load : '', // 引用页面地址
					content : '', // 本页引用标签，可以直接写对象 比如$('#id')
					closebtn : '',
					shade : true, // 启用遮罩层，默认有
					fix : true, // 启用固定定位，默认是
					width : 'auto',
					height : 'auto',
					left : 'center',
					top : 'center',
					close : true, // 是否带关闭按钮 ，默认有
					lock : true,
					closefn : null, // 关闭事件之后运行的函数
					drag : true,
					title:'',
					delEntirely:false  //弹框内容是否全部删除比如提示信息可以全部删去
				// 是否可拖拽，默认是
				// 是否开启锁屏，默认不
				};
				var opts = $.extend(defaults, options);
				function dialog(opts) {
					this.catchFnclose = window.fnclose;
					this.closefn = opts.closefn;
					this.is_obj = (typeof (opts.content) == 'object');
					this.is_IE6 = !!window.ActiveXObject && !window.XMLHttpRequest;
					this.closebut = document.createElement('div');
					this.shade = document.createElement('div');
					this.diabox = document.createElement('div');
					this.init();
				}

				dialog.prototype = {
					init : function() {

						if (opts.content[0]) {
							opts.content = opts.content[0]
						}
						if (this.is_obj) {
							this.geteleparent();
						}
						if (opts.shade) {
							this.shadeshow();
						}
						this.diaboxshow();
					},
					createshade : function() {
						this.shade = document.createElement('div');
						this.shade.style.zIndex = 900;
						if (opts.fix) {
							this.shade.style.position = this.is_IE6 ? 'absolute'
									: 'fixed';
						} else {
							this.shade.style.position = 'absolute';
						}
						this.shade.style.left = '0px';
						this.shade.style.top = "0px";
						if (this.is_IE6) {
							if (opts.fix) {
								this.fixed(this.shade);
							}
						}
						this.shade.style.width = "100%";
						this.shade.style.height = "100%";
						var getshade = document.getElementById('dia_shade_0502');
						if (getshade) {
						} else {
							this.shade.id = 'dia_shade_0502';
							this.shade.style.backgroundColor = "black";
							!document.all ? this.shade.style.opacity = 30 / 100
									: this.shade.style.filter = "alpha(opacity=30)";
						}
						document.body.appendChild(this.shade);
					},
					shadeshow : function() {
						this.createshade();
					},
					closeaction : function() {
						this.closebut.className = 'dialogclosebut';
						// this.closebut.style.width = '20px';
						// this.closebut.style.height = '20px';
						// this.closebut.style.backgroundColor = 'red';
					},
					diaboxshow : function() {
						
						this.closeaction();
						if(opts.close){
						this.diabox.appendChild(this.closebut);
						}
						if(opts.title){
							var dialog_title = document.createElement('div');
							dialog_title.className = 'dialog_title';
							dialog_title.innerHTML = opts.title;
							this.diabox.appendChild(dialog_title)
						}
						var diacontent = document.createElement('div');
						diacontent.className = 'dialog_conent';
						this.diabox.appendChild(diacontent)
						if (opts.load) {
							$.ajaxSetup({
								async : false
							});
							$(diacontent).load(opts.load);
							$.ajaxSetup({
								async : true
							});
						} else {
							if (this.is_obj){
									opts.content.style.display = 'block';
								
									diacontent.appendChild(opts.content);
							} else {
								diacontent.innerHTML = opts.content;
							}
						}
						this.diabox.style.position = this.is_IE6 ? 'absolute'
								: 'fixed';
						this.diabox.style.backgroundColor = 'white';
						this.diabox.style.zIndex = 900;
						this.diabox.className = 'dl_diabox';
						document.body.appendChild(this.diabox);
						this.position();
					},
					position : function() {
						if (opts.left == 'center') {
							var bodywidth = !document.documentElement.clientWidth ? document.body.clientWidth
									: document.documentElement.clientWidth;
							var left = (bodywidth - this.diabox.offsetWidth) / 2;
							this.diabox.style.left = left + 'px';
						} else if (typeof (parseInt(opts.left)) == 'number') {
							this.diabox.style.left = opts.left + 'px';
						}
						;
						if (opts.top == 'center') {
							var bodyheight = !document.documentElement.clientHeight ? document.body.clientHeight
									: document.documentElement.clientHeight;
							var top = (bodyheight - this.diabox.offsetHeight) / 2;
							this.diabox.style.top = top + 'px';
						} else if (typeof (parseInt(opts.top)) == 'number') {
							this.diabox.style.top = opts.top + 'px';
						}
						if (this.is_IE6) {
							if (opts.fix) {
								this.fixed(this.diabox);
							}
						}
					},
					fixed : function(obj) {
						var top = obj.offsetTop;
						var left = obj.offsetLeft;
						window.onscroll = function() {
							var scrolltop = !document.documentElement.scrollTop ? document.body.scrollTop
									: document.documentElement.scrollTop;
							var scrollleft = !document.documentElement.scrollLeft ? document.body.scrollLeft
									: document.documentElement.scrollLeft;
							obj.style.top = top + scrolltop + 'px';
							obj.style.left = left + scrollleft + 'px';
						};
					},
					shadehide : function() {
						document.body.removeChild(this.shade);
					},
					dialoghide : function() {
						if (opts.delEntirely == false&&typeof (opts.content) == 'object') {
							this.returnelement();
						}
						document.body.removeChild(this.diabox);
					},
					returnelement : function() {
						opts.content.style.display = 'none';
						if (this.nextelement || this.parentelement) {
							this.parentelement.insertBefore(opts.content,
									this.nextelement);
						} else {
							this.parentelement.apendChild(opts.content);
						}
					},
					geteleparent : function() {
						var obj = opts.content;
						this.parentelement = obj.parentNode;
						this.prevelement = obj.previousSibling;
						this.nextelement = obj.nextSibling;
					},
					fnclose : function() {
						if (opts.shade) {
							this.shadehide();
						}
						this.dialoghide();
					},
					drag : {
						bind : function(obj, method, fun) {
							try {
								obj.addEventListener(method, fun, false)
							} catch (e) {
								obj.attachEvent("on" + method, fun);
							}
						},
						unbind : function(obj, method, fun) {
							try {
								obj.removeEventListener(method, fun, false)
							} catch (e) {
								obj.detachEvent("on" + method, fun);
							}
						},
						getMousepostion : function(event) {
							var px, py;
							var event = event || window.event;
							if (document.all) {
								px = event.clientX;
								py = event.clientY;
								px += document.documentElement.scrollLeft;
								py += document.documentElement.scrollTop;
							} else {
								px = event.pageX;
								py = event.pageY;
							}
							return [ px, py ]
						},
						getElementpositon : function(el) {
							function getoX(el) {
								var oX = el.offsetLeft;
								if (el.offsetParent) {
									oX += getoX(el.offsetParent)
								}
								return oX;
							}
							;
							function getoY(el) {
								var oY = el.offsetTop;
								if (el.offsetParent) {
									oY += getoY(el.offsetParent)
								}
								return oY;
							}
							return [ getoX(el), getoY(el) ];
						},
						init : function(obj) {
							var that = this;
							var draghandler = document.createElement('div');
							draghandler.style.position = 'absolute';
							draghandler.style.top = '0px';
							draghandler.style.left = '0px';
							draghandler.style.width = '100%';
							draghandler.style.height = '40px';
							draghandler.style.cursor = 'move';
							draghandler.style.zIndex = '900';
							obj.insertBefore(draghandler, obj.firstChild);
							if ($.browser.msie && $.browser.version == 7) {
								var ele  = document.createElement('div');
								ele.style.position = 'absolute';
								ele.style.width = '10px';
								ele.style.height = '12px';
								ele.style.top = '10px';
								ele.style.right = '10px';
								draghandler.appendChild(ele);
								ele.onclick = function(){window.fnclose();};
							}
							draghandler.onmousedown = function(e) {
								that.downEvent(that, obj, e);
							};
							draghandler.onmouseup = function() {
								that.upEvent(that, obj);
							};
						},
						downEvent : function(n, o, e) {
							var mp = n.getMousepostion(e), ep = n
									.getElementpositon(o);
							var differ = [ mp[0] - ep[0], mp[1] - ep[1] ];
							document.onmousemove = function(e) {
								n.mousefollow(n, o, differ, e)
							};
						},
						upEvent : function(n, o) {
							document.onmousemove = null;
						},
						mousefollow : function(n, o, differ, e) {
							var mp = n.getMousepostion(e);
							var differX = mp[0] - differ[0];
							var differY = mp[1] - differ[1];
							o.style.left = differX + 'px';
							o.style.top = differY + 'px';
						}
					}
				};
				var a = new dialog(opts);
				a.closebut.onclick = function() {
					a.fnclose();
					if (opts.closefn) {
						opts.closefn();
					}
				};
				// a.closefn = opts.closefn;
				if (opts.drag) {
					a.drag.init(a.diabox);
				}
				;
				window.onresize = function() {
					a.position();
				};
				if (a.catchFnclose) {
					window.fnclose = function() {
						a.fnclose();
						if (a.closefn) {
							a.closefn();
						}
						window.fnclose = a.catchFnclose;
					};
				} else {
					window.fnclose = function() {
						try {
							a.fnclose();
						} catch (e) {
						}
						;
						if (a.closefn) {
							a.closefn();
						}
					};
				}
			},
		_redirect:function (path) {
				/*
				 * redirect to path
				 */
				$('#_path').attr("value", path);
				$('#_navForm').attr("action",
						base_path + "/rest/navigation/redirect");
				$('#_navForm').submit();
		},		 
		_gotoLogin:function(){
				window.location.href = base_path+ "/login/";
		},
		_processError:function(XMLHttpRequest, textStatus, errorThrown) {
			this._checkSession(XMLHttpRequest, textStatus, errorThrown);
		},
		_showError:true,
		_checkSession:function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 551&&this._showError){
				this._showError = false;
				baseJS._dialogBox({
					IsComplieformRb : false,
					content : _rb.cloud.login.loginTimeOut,
					callbackType : 'fail',
					closefn:function(){
						baseJS._gotoLogin();
						this._showError = true;}
				});
			}
		},
//		_handlerError:function(XMLHttpRequest, textStatus, errorThrown) {
//			try{
//				var result = eval("(" + XMLHttpRequest.responseText + ")");
//				this._dialogBox({title:result.title,content:result.message,isComplieformRb:true,callbackType:"fail"});
//			}catch(e){};
//		},
		_dialogBox:function(options) {
			/*****
			 * //title:dialog title
			 * //content:dialog content
			 * //IsComplieformRb:title and content 是否需要resource编译一下
			 * //IsTitleComplieforPb:title 是否需要从resource编译一下
			 * //callbackType:调用那种样式  param:"success" "fail"  "error"
			 * //contentReplaceParam:content需要从resource编译的情况下有{num}的情况下替换{num}的参数 
			 * //数组格式 arg[num]替换{num}里的内容  
			 * //closefn:关闭dialog 之后想要执行的函数
			 * //countdown:是否加倒计时效果，默认有
			 * //baseJS._dialogBox({title:'错误',content:'输入错误',callbackType:'fail'})
			 * ******/
			var title = options.title,				
			content = options.content,				
			is_Rb = options.IsComplieformRb,        
			title_is_rb = options.IsTitleComplieforPb,
			isSuccess = options.callbackType||'success',		
			contentargs = options.contentReplaceParam,
			countdown,
			closefn = options.closefn;
			if(typeof(options.countdown)=="undefined"){
				countdown = true;
			}else{
				countdown = options.countdown;
			}
			if(options.IsComplieformRb)
				is_Rb=false;
			if (is_Rb) {
				try {
					content = eval('_rb.' + content);
					title = eval('_rb.' + title);
				} catch (e) {
				}
			} else {
				if (title_is_rb) {
					try {
						title = eval('_rb.' + title);
					} catch (e) {
					}
				}
			}
			;
			if (contentargs) {
				content = content.format(contentargs);
			}
			if(countdown){
				var countdownbox ='<div class="countdownbox">'+_rb.cloud.dialog.automaticclose.front + '<span id="dialong-await">5</span>'+ _rb.cloud.dialog.automaticclose.behind +'</div>';
			}else{
				var countdownbox = '';
			}
			if (isSuccess == "success") {
				content = '<div class="success">'
						+ content + countdownbox
						+ '</div><a class="dialogclosebut" onclick="fnclose();if(fnclose){fnclose();if(fnclose){fnclose();};};"><s>'
						+ _rb.button.close + '</s></a>';
			} else if (isSuccess == "fail") {
				content = '<div class="fail">' + content + countdownbox
						+ '</div><a class="dialogclosebut" onclick="fnclose()"><s>'
						+ _rb.button.close + '</s></a>';
			} else if (isSuccess == "error") {
				content = '<div class="interjective">' + content + countdownbox
						+ '</div><a class="dialogclosebut" onclick="fnclose()"><s>'
						+ _rb.button.close + '</s></a>';
			}
			
			var dialog = document.createElement('div');
			var dialog_title = document.createElement('div');
			var dialog_box = document.createElement('div');
			dialog.className = 'dialog';
			dialog_title.className = 'dialog_title';
			dialog_box.className = 'dialog_box';
			document.body.appendChild(dialog);
			dialog.appendChild(dialog_title);
			dialog.appendChild(dialog_box);
			$(dialog_title).html(title);
			$(dialog_box).html(content);
			if (closefn) {
				this._Dialog({
					content : dialog,
					close : false,
					closefn : closefn,
					delEntirely:true
				});
			} else {
				this._Dialog({
					content : dialog,
					close : false,
					delEntirely:true
				});
			}
			if(countdown){
				var timer1 = window.setInterval(function(){
					var closetime = parseInt($('#dialong-await').html())
					$('#dialong-await').html(--closetime);
					if(closetime==1){
						window.clearInterval(timer1);
					}
				},1000);
				var timer = window.setTimeout(function(){
					var  cancel = $(dialog_box).find('.common_cancel').length;
					if(cancel>0){
						cancel.trigger('click');
					}else{
					fnclose();
					}
					$(document).off('click',disappear);
					window.clearInterval(timer1);
				},5000);
				function disappear(e){
					var e = e||window.event;
					var el = e.target||e.srcElement;
					var close = $(el).hasClass('dialogclosebut');
					var cancel = $(el).hasClass('common_cancel');
					if(close||cancel){
						window.clearTimeout(timer);
						window.clearInterval(timer1);
						$(document).off('click',disappear);
					}
				}
				$(document).on('click',disappear);
			}
		},
		_calDate:function(timestamp) {
			/**
			 * calDate(1359425346890);
			 * 
			 * @param timestamp
			 * @returns
			 */
			var d = new Date();
			var time = timestamp - (d.getTimezoneOffset() * 1000 * 60);  
			var gmtTime = new Date(time);
			 return gmtTime.pattern("yyyy-MM-dd");
			return gmtTime.pattern(_rb.DATETIME_SHORT_FORMAT);
		},
		_calDateTime:function(timestamp) {
			/**
			 * calDateTime(1359425346890);
			 * 
			 * @param timestamp
			 * @returns
			 */
			var d = new Date();
			var time = timestamp - (d.getTimezoneOffset() * 1000 * 60);
			var gmtTime = new Date(time);
			return gmtTime.pattern("yyyy-MM-dd HH:mm:ss");
			return gmtTime.pattern(_rb.DATETIME_LONG_FORMAT);
		},
		
		_selectAnalog:function(selectId, className, fn) {
			/*
			 * 给select下拉菜单添加指定样式,模拟下拉菜单 selectId:代表要使用模拟的select的ID名字或者class名字
			 * className:代表覆盖默认设置的select-analog的样式及其子孙元素的样式 fn 是下拉菜单值发生改变时要执行的事件,
			 * PS:本函数会默认调用原select的onchange事件,可以把要执行的事件写到 onchange里
			 * selectAnalog('#select','class',fn) PS:用'class'样式的模拟下拉菜单覆盖id是select的下拉菜单
			 */
			$(selectId)
					.each(
							function(index) {
								var select = $(selectId).eq(index);
								if(this.options.length == 0 ){
									$(this).hide();
									return false;
								}
								/* 根据select的值创建相应的HTML */
								var firstHtml = this.options[this.options.selectedIndex].innerHTML;
								// var firstHtml = $(this).find("option:first").html();
								var html = "<div class='select-analog";
								if (className) { /* 如果有覆盖样式的话就加上样式，否则不加 */
									html += " " + className;
								}
								html += "'><a class='title'>";
								html += firstHtml;
								html += "</a>";
								var htmlUl = $("<ul></ul>");
								var optionLength = $(this).find("option").length;
								for ( var i = 0; i < optionLength; i++) {
									var htmlLi = "<li><a href='#' class='"+$(this).find("option").eq(i).val()+"'>"
											+ $(this).find("option").eq(i).html()
											+ "</a></li>";
									htmlUl.append(htmlLi);
								}
								html += "<ul>" + htmlUl.html() + "</ul></div>";
								if ($(this).next(".select-analog").length > 0) {
									$(this).next(".select-analog").remove();
								}
								$(this).after(html);
								if ($.browser.msie && $.browser.version == 6) {
									$(this).css({
										'visibility' : 'hidden',
										'float' : 'right',
										'width' : '0',
										'height' : '0',
										'overflow' : 'hidden'
									});
								} else {
									$(this).hide();
								}
								/* 对生成的相应的HTML加方法模拟select下拉框 */

								$(this).next(".select-analog").mouseleave(function() {
									$(this).find('ul').hide();
									$(this).css('z-index', '10');
								});
								$(this).next(".select-analog").click(
										function() {
											$(this).css('z-index', '12');
											$(this).find("ul").show();
											return false;
										});
								$(this).next(".select-analog").find('ul li a').click(
										function() {
											$(this).parents('ul').prev('.title').html(
													$(this).html());
											$(this).parents('ul').hide();
											var ind = $(this).parent().index();
											/*select.find("option").eq(ind).attr(
													"selected", true);*/
											select[0].selectedIndex = ind;
											if (select.change) {
												select.trigger('change');
											}
											if (fn) {
												fn();
											}
											return false;
										});
							});
		}
};
function beforeSendfun(){
	if ($("#loadingbar").length === 0) {
        $("body").append("<div id='loadingbar'></div>")
        $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));
        $("#loadingbar").width((50 + Math.random() * 30) + "%");
    }
}
function ajaxEndfun(){
	$("#loadingbar").width("101%").delay(200).fadeOut(400, function() {
        $(this).remove();
    });
}
function getContextPath() {
    var pathname = document.location.pathname;
    var index = pathname.substr(1).indexOf("/");
    var result = pathname.substr(0,index+1);
    return result;
}

	Req = {
		version : 0.1,
		requestPath : getContextPath()+"/ajax"
	};

	Req.apply = function(o, c, defaults) {
		if (defaults) {
			Req.apply(o, defaults);
		}
		if (o && c && typeof c == 'object') {
			for ( var p in c) {
				o[p] = c[p];
			}
		}
		return o;
	};

	Req.Pager = function(config){
		Req.apply(this, config, {
			page_size : 10,
			page_index : 1,
			total_count:0
		});
		this.setPageSize=function(size){
			this.page_size = size;
		};
		this.setPageIndex=function(index){
			this.page_index = index;
		};
		this.setTotalCount=function(total_count){
			this.total_count = total_count;
		};
	}

	Req.Querier = function(config) {
		Req.apply(this, config, {
			resource : '',
			page_size : 10,
			page_index : 1,
			order : "",
			action: "",
			params : {},
			success : callbackSuccess,
			error : callbackError
		});
		this.setParams = function(params){
			this.params = params;
		};
		this.ajax = function() {
			if (this.resource.length == 0) {
				Req.ErrorHandle('resource is null');
				return;
			}
			return $.ajax({
				type : 'post',
				dataType : 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url : Req.requestPath,
				data : encodeURI("resource=" + this.resource + "&type=get&param=" + JSON.stringify(this)),
				success : Req.PreSuccess,
				error : this.error,
				successCallback:this.success//,
				//beforeSend:beforeSendfun
			});//.always(ajaxEndfun);
		}
	}

	Req.Updater = function(config) {
		Req.apply(this, config, {
			resource : '',
			params : {},
			fields : {},
			datalist:{},
			id : '',
			success : callbackSuccess,
			error : callbackError
		});
		this.setParams = function(params){
			this.params = params;
		};
		this.setFields = function(fields){
			this.fields = fields;
		};	
		this.ajax = function() {
			if (this.resource.length == 0) {
				Req.ErrorHandle('resource is null');
				return;
			}
			return $.ajax({
				type : 'post',
				dataType : 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url : Req.requestPath,
				data : encodeURI("resource=" + this.resource + "&type=put&param=" + JSON.stringify(this)),
				success : Req.PreSuccess,
				error : this.error,
				successCallback:this.success//,
				//beforeSend:beforeSendfun
			});//.always(ajaxEndfun);
		}
	}

	Req.Inserter = function(config) {
		Req.apply(this, config, {
			resource : '',
			fields : {},
			datalist:[],
			success : callbackSuccess,
			error : callbackError
		});
		this.setFields = function(fields){
			this.fields = fields;
		};
		this.ajax = function() {
			if (this.resource.length == 0) {
				Req.ErrorHandle('resource is null');
				return;
			}
			return $.ajax({
				type : 'post',
				dataType : 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url : Req.requestPath,
				data : encodeURI("resource=" + this.resource + "&type=post&param=" + JSON.stringify(this)),
				success : Req.PreSuccess,
				error : this.error,
				successCallback:this.success//,
				//beforeSend:beforeSendfun
			});//.always(ajaxEndfun);
		}
	}

	Req.Deleter = function(config) {
		Req.apply(this, config, {
			resource : '',
			params : {},
			id : '',
			success : callbackSuccess,
			error : callbackError
		});
		this.setParams = function(params){
			this.params = params;
		};	
		this.ajax = function() {
			if (this.resource.length == 0) {
				Req.ErrorHandle('resource is null');
				return;
			}		
			return $.ajax({
				type : 'post',
				dataType : 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url : Req.requestPath,
				data : encodeURI("resource=" + this.resource + "&type=delete&param=" + JSON.stringify(this)),
				success : Req.PreSuccess,
				error : this.error,
				successCallback:this.success//,
				//beforeSend:beforeSendfun
			});//.always(ajaxEndfun);
		}
	}

	Req.Action = function(config) {
		Req.apply(this, config, {
			resource : '',
			params : {},
			id : '',
			action : '',
			success : callbackSuccess,
			error : callbackError
		});
		this.setParams = function(params){
			this.params = params;
		};
		this.ajax = function() {
			if (this.resource.length == 0) {
				Req.ErrorHandle('resource is null');
				return;
			}		
			return $.ajax({
				type : 'post',
				dataType : 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				url : Req.requestPath,
				data : encodeURI("resource=" + this.resource +"&type=action&param=" + JSON.stringify(this)),
				success : Req.PreSuccess,
				error : this.error,
				successCallback:this.success
			});
		}
	}

	Req.ErrorHandle = function(type) {
		if (type == 'resource is null') {
			alert("resource can't be null");
		}
	}
	
	Req.PreSuccess = function(data){
		if(data.code>999){
			
			if(data.code==3003){
				baseJS._dialogBox({title:_rb.common.error.title,
					content:_rb.cloud.error[data.code],
					IsComplieformRb:false,
					callbackType:"error",
					countdown:false});
				this.error(data);
			}else{
				baseJS._dialogBox({title:_rb.common.error.title,
					content:_rb.cloud.error[data.code],
					IsComplieformRb:false,
					callbackType:"error"});
				
				this.error(data);
			}
		}
		else
			this.successCallback(data);
	}
	// /////////////////////////////////////////////////////////////////////


	function callbackError(XMLHttpRequest, textStatus, errorThrown){
		baseJS._processError(XMLHttpRequest, textStatus, errorThrown);
	}

	function callbackSuccess(msg) {
		alert("suc");
	}
	
	function uploadwating(){
		baseJS._Dialog({
			load:'../common/uploadwaiting.html',
			close:false
		})
	}
	function createPager(total, pageSize, curPage) {
		/*
		 * var page={}; page.total=total; page.pageSize=pageSize;
		 * page.pageNum=Math.floor(total/pageSize)+(total%pageSize?1:0);
		 * page.curPage=curPage; page.pages=[]; for(var i=1;i<=page.pageNum;i++){
		 * page.pages.push(i); } return page;
		 */
		return {
			sizePerPage : [ 10, 20, 50 ],
			pageSize : pageSize,
			pageIndex : curPage,
			total : total
		};
	}

	function confirmDialog(options) {
		baseJS._Dialog(options);
		var dom = options.content;
		$('.button_submit', dom).unbind('click');
		if (options.callback) {
			$('.button_submit', dom).click(function() {
				options.callback();
			});
		}

	}
	function successDialog(options) {
		options = options || {};
		baseJS._dialogBox({
			title : _rb.cloud.contract.message,
			IsComplieformRb : false,
			content : options.content || _rb.cloud.contract.savesuccess,
			callbackType : 'success'
		});
	}
	function errorDialog(options) {
		options = options || {};
		baseJS._dialogBox({
			title : options.title || _rb.common.error.title,
			IsComplieformRb : false,
			content : options.content,
			callbackType : 'error'
		});
	}
	function getMsg() {
		var args = arguments;
		var bundle = args[0];
		for ( var i = 1; i < args.length; i++) {
			var placeholder = '{' + (i - 1) + "}";
			bundle = bundle.replace(placeholder, args[i]);
		}
		return bundle;
	}
	function objectWrapper(arr) {
		var objArr = [];
		for ( var i = 0; i < arr.length; i++) {
			objArr.push({
				value : i,
				name : arr[i]
			});
		}
		return objArr;
	}

	function prettySize(input) {
		if (input < 1024 * 1024) {
			var result = "" + (parseInt(input) / (1024));
			if (result.indexOf('.') > 0) {
				var idx = result.indexOf('.');
				return result.toString().substring(0, idx + 4) + "K";
			}
			return result + "K";
		} else {
			var result = "" + (parseInt(input) / (1024 * 1024));
			if (result.indexOf('.') > 0) {
				var idx = result.indexOf('.');
				return result.toString().substring(0, idx + 4) + "M";
			}
			return result + "M";
		}
		return result;
	};

	function initAuthorization($rootScope){
		$rootScope.user_role=user_role;
		var CUST_ADM=2;
		var AGENT_ADM=1;
		var PLAT_ADM=91;
		$rootScope.CUST_ADM=CUST_ADM;
		$rootScope.AGENT_ADM=AGENT_ADM;
		$rootScope.PLAT_ADM=PLAT_ADM;
		$rootScope.isAgent=(user_role==AGENT_ADM);
		$rootScope.isCust=(user_role==CUST_ADM);
//		$rootScope.accountMgt=(user_role=);
		
	}	
	
	
	$.cookie = function(name, value, options) {
	    if (typeof value != 'undefined') { // name and value given, set cookie
	        options = options || {};
	        if (value === null) {
	            value = '';
	            options.expires = -1;
	        }
	        var expires = '';
	        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
	            var date;
	            if (typeof options.expires == 'number') {
	                date = new Date();
	                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
	            } else {
	                date = options.expires;
	            }
	            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
	        }
	        var path = options.path ? '; path=' + options.path : '';
	        var domain = options.domain ? '; domain=' + options.domain : '';
	        var secure = options.secure ? '; secure' : '';
	        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	    } else { // only name given, get cookie
	        var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = jQuery.trim(cookies[i]);
	                // Does this cookie string begin with the name we want?
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
	    }
	};

jQuery.fn.extend({
	    TextareaScroll: function (options) {
			var settings = {
				upButtonClass : 'btUP',
				downButtonClass : 'btDW',
				dragButtonClass : 'btDR',
				wrapperClass : 'textareaScroll',
				scrollWrapperClass : 'scrollWrapper',
				percentPerClick : 0.05,
				showDrag : false
			}
			
			jQuery.extend(settings,options);
			
	        return this.each(function (i) {
				var $textArea = jQuery(this), 
					$wrapper = null, 
					$scrollWrapper = null, 
					$btns = null, 
					$drag = null,
					$document = $(document),
					IsMouseDown = false;
			   
				$textArea.wrap('<div class="' + settings.wrapperClass + '" />');

				$wrapper = $textArea.parent();
				$wrapper.append('<div class="' + settings.scrollWrapperClass + '" />');

				$scrollWrapper = $wrapper.find('.' + settings.scrollWrapperClass);
				$scrollWrapper.append('<div class="' + settings.upButtonClass + '" />');
				$scrollWrapper.append('<div class="' + settings.downButtonClass + '" />');
				$scrollWrapper.append('<div class="' + settings.dragButtonClass + '" ><div class="btDRup"></div><div class="btDRdown"></div></div>');

				$btns = $wrapper.find('.' + settings.upButtonClass + ', .' + settings.downButtonClass);
				$drag = $wrapper.find('.' + settings.dragButtonClass);
			   
				
				$drag.bind('mousedown', OnMouseDown);
				$textArea.bind('scroll input',UpdateRolagem);
				
				$btns.bind('mousedown',function(){
					IsMouseDown = true;
					MouseTimer(this);
					return false;
				}).bind('mouseup',function(){
					IsMouseDown = false;
					return false;
				});
				
				UpdateTextArea(1);
				
				function MouseTimer(el){
					var pc = $textArea.data('pc');
					if($(el).hasClass('btUP')) {
						UpdateTextArea(pc - settings.percentPerClick);
					} else {
						UpdateTextArea(pc + settings.percentPerClick);
					}
					
					if(IsMouseDown)
						setTimeout(function(){MouseTimer(el)},100);
				}

				function OnMouseDown(e){
					$document.bind('mousemove', OnMouseMove).bind('mouseup', OnMouseUp);
					return false;
				}

				function OnMouseMove(e){
					var my = e.clientY || e.pageY;
					
					my += document.documentElement.scrollTop;
					
					var cy = $wrapper.offset().top;
					var py = my-cy;
					var bth = $btns.height();
					var dwh = $drag.height();
					var swh = $scrollWrapper.height();
					
					var topLimit = bth;
					var bottomLimit = swh-(bth+dwh);
					
					if(py < topLimit)
						py = topLimit;
					
					if(py > bottomLimit)
						py = bottomLimit;
					
					$drag.css('top',py);
					
					var pc = (py-bth) / (bottomLimit-bth);
					UpdateTextArea(pc);
					return false;
				}

				function OnMouseUp(e){
					$document.unbind('mousemove', OnMouseMove).unbind('mouseup', OnMouseUp);
					return false;
				}
			   
				function UpdateRolagem(){
					var sh = $textArea[0].scrollHeight,
						st = $textArea[0].scrollTop,
						th = $textArea.height(),
						pc = ((st) / (sh-th));
					$textArea.data('pc', pc);
					
					if(sh > th) {
						$btns.show();
						$drag.show();
						$scrollWrapper.show();
						var bth = $btns.height();
						var dwh = $drag.height();
						var swh = $scrollWrapper.height();
						
						var dragMaxSize = swh-((bth*2));
						var dwh = Math.round(Math.max(dragMaxSize * (th/sh),10));
						dwh = dwh<17?17:dwh;
						$drag.css({
							top : Math.round((((swh-((bth*2)+dwh)) * pc) + (bth+dwh)) - (dwh>>1) ),
							height : dwh,
							marginTop : -dwh>>1
						});
					} else {
						$btns.hide();
						$drag.hide();
						$scrollWrapper.hide();
					}
				}

				function UpdateTextArea(pc){
					if(pc > 1)
						pc = 1;
					
					if(pc < 0)
						pc = 0;

					var max = $textArea[0].scrollHeight,
						min = $textArea.height(),
						total = max - min;
					$textArea.data('pc', pc);
					$textArea.scrollTop(total * pc);
					UpdateRolagem();
				}
	        });
	    }
});