angular.module('mainApp.directive',[])
.directive('ngKeyup', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
             // this next line will convert the string
             // function name into an actual function
             var functionToCall = attr.ngKeyup;
             elem.on('keyup', function(e){
            	//functionToCall(e)
            	 var func = scope.$eval(functionToCall);
            	 func(e);
             });
        }
    };
})
.directive('genPagination', 
		function () {
    // <div gen-pagination="options"></div>
    // HTML/CSS修改于Bootstrap框架
    // options = {
    //     sizePerPage: [25, 50, 100], 每页显示条数数组
    //     pageSize: 25,  每页条数
    //     pageIndex: 1,  当前页码
    //     total: 10     总条数
    // };
    return {
    	scope: true,
        templateUrl: base_path+'/common/pagination.html',
        link: function (scope, element, attr) {
        	angular.element(element).addClass('pagebox');
        	var _genPagination = attr.genPagination;
            scope.$watch(_genPagination, function (value) {
            	
                if (!angular.isObject(value)) {
                    return;
                }
                var pageIndex = 1,
                    showPages = [],
                    lastPage = Math.ceil(value.total / value.pageSize) || 1;

                pageIndex = value.pageIndex >= 1 ? value.pageIndex : 1;
                pageIndex = pageIndex <= lastPage ? pageIndex : lastPage;

                showPages[0] = pageIndex;
                if (pageIndex <= 6) {
                    while (showPages[0] > 1) {
                        showPages.unshift(showPages[0] - 1);
                    }
                } else {
                    showPages.unshift(showPages[0] - 1);
                    showPages.unshift(showPages[0] - 1);
                    showPages.unshift('…');
                    showPages.unshift(2);
                    showPages.unshift(1);
                }
                if (lastPage - pageIndex <= 5) {
                    while (showPages[showPages.length - 1] < lastPage) {
                        showPages.push(showPages[showPages.length - 1] + 1);
                    }
                } else {
                    showPages.push(showPages[showPages.length - 1] + 1);
                    showPages.push(showPages[showPages.length - 1] + 1);
                    showPages.push('…');
                    showPages.push(lastPage - 1);
                    showPages.push(lastPage);
                }
                scope.prev = pageIndex > 1 ? pageIndex - 1 : 0;
                scope.next = pageIndex < lastPage ? pageIndex + 1 : 0;
                scope.total = value.total;
                scope.pageIndex = pageIndex;
                scope.showPages = showPages;
                scope.pageSize = value.pageSize;
                scope.perPages = value.sizePerPage || [10, 20, 50];
                scope.lastPage = lastPage;
                scope.govalue = scope.pageIndex+1>scope.lastPage?scope.lastPage:scope.pageIndex+1;
                scope.pagination = value;
                //scope.$emit('genPagination',pageIndex);
                if(scope.total/scope.pageSize>1){
            		element[0].style.display = "block";
            	}else{
            		element[0].style.display = "none";
            	}
            },true);
            
            scope.paginationTo = function (p, s) {
                if (p > 0) {
                	scope.$emit(_genPagination, p, s);
                }
            };
            scope.go = function(e){
            	var e = window.event||e;
            	scope.govalue = scope.govalue.toString().replace(/^0|\D/g,'');
            	scope.$apply();
            	if(e.keyCode == 13){
            		scope.pagination.pageIndex = parseInt(scope.govalue)>scope.lastPage?scope.lastPage:parseInt(scope.govalue);
            		
            		scope.$apply();
            		scope.$emit(_genPagination,scope.pagination.pageIndex);
            	}
            };
            scope.pageto = function(){
            	scope.pagination.pageIndex = parseInt(scope.govalue)>scope.lastPage?scope.lastPage:parseInt(scope.govalue);
            	scope.$emit(_genPagination,scope.pagination.pageIndex);
            };
        }
    };
}
)
.directive('placeholder',function(){
	return {
		link:function(scope,element,attrs){
			var placeholderVal;
			var el = angular.element(element);
			var span = !!$(element).prev('.placeholderspan').length?$(element).prev('.placeholderspan'):$(element).parent().prev('.placeholderspan');
			if(span.length>0){
				scope.$watch(function(){return el.val()},function(newVal){
					if(newVal != ''){span.hide();}
				})
				span.bind('click',function(){
					el.focus();
				});
				el.bind("focus",function(){
					if(el.val() == span.val()){
						span.hide();
					}
				});
				el.bind('blur',function(){
					if(el.attr('autocomplete')){
						window.setTimeout(function(){
							if(el.val() == ''){
								span.show();
							}
						},200)
					}else{
						if(el.val() == ''){
							span.show();
						}
					}
				});
			}else{
				if(el.hasClass('imagename')){
					
					var shade = document.createElement('div');
					shade.className = 'searchinputplace';
					el.after(shade);
					scope.$watch(function(){return attrs.value},function(newVal){
						shade.innerHTML = newVal;
						shade.title = newVal;
						el.val('');
					});
					shade.onclick = function(){
						el.focus();
						shade.style.display = 'none';
					}
					el.bind("focus",function(){
						shade.style.display = 'none';
					});
					el.bind('blur',function(){
						if(el.val() == ''){
							shade.style.display = "block";
						}
					})
				}else{
					el.bind("focus",function(){
						if(el.val() == attrs.value){
							angular.element(element).val('');
							placeholderVal = attrs.value;
						}
					});
					el.bind('blur',function(){
						if(el.val() == ''){
								angular.element(element).val(placeholderVal);
						}
					});
				}
			}
		}
	};
})
.directive('selectan',function(){
	return {
		link:function(scope,element,attrs){
			window.setTimeout(function(){
				baseJS._selectAnalog(element,'image_selectD0');
			}, 50);

		}
	};
})
.directive('autocomplete',function(){
	return {
		link:function(scope, element, attrs){
			var input = angular.element(element);
			var ul = input.next('ul');
			var Ishover = false;
			input.bind('blur',function(){
				if(!Ishover){
				ul.removeClass('show');
				}
			});
			input.bind('focus',function(){
				ul.addClass('show');
			});
			input.bind('dbclick',function(){
				ul.addClass('show');
			});
			input.bind('keyup',function(event){
				if(input.val() == ''){
					//ul.removeClass('show');
				}else{
					ul.addClass('show');
				}
				var e = event||window.event;
				if(e.keyCode==38){
					var li = ul.find('li');
					var nohover = true;
					li.each(function(){
						if($(this).hasClass('hover')){
							$(this).removeClass('hover');
							var ind = $(this).index() - 1;
							li.eq(ind).addClass('hover');
							nohover = false;
							return false;
						};
					});
					if(nohover){
						li.eq(-1).addClass('hover');
					}
				}else if(e.keyCode == 40){
					var li = ul.find('li');
					var nohover = true;
					li.each(function(){
						if($(this).hasClass('hover')){
							$(this).removeClass('hover');
							var ind = $(this).index() + 1;
							if(ind == li.length){ind=0;}
							li.eq(ind).addClass('hover');
							nohover = false;
							return false;
						};
					});
					if(nohover){
						li.eq(0).addClass('hover');
					}
				}else if(e.keyCode == 13){
					var li = ul.find('li');
					li.each(function(){
						if($(this).hasClass('hover')){
							input.val($(this).html());
							ul.removeClass('show');
							return false;
						};
					});
				}
			});
			ul.bind('mouseover',function(){Ishover = true;});
			ul.bind('mouseleave',function(){Ishover = false;});
			ul.delegate('li','hover',function(){
				$(this).addClass('hover').siblings().removeClass('hover');
			});
			ul.delegate('li','click',function(){
				input.val($(this).html());
				var span = input.prev('.placeholderspan');
				if(span.css('display')!="none"){
					span.hide();
				}
				ul.removeClass('show');
			});
		}
	};
})/*
.directive("commonTab",function(){
	return{
		restrict:'C',
		link:function(scope, element, attrs){
			var collect = $(element);
			var a = collect.find('a');
			var len = a.length;
			$(element).prepend(a.eq(len-1));
			for(i=0;i<len-1;i++){
				$(element).find('a').eq(i).after(a.eq(len-2-i))
			}
		}
	};
})*/
.directive("tab",['$location',function($location){
	return{
		restrict:'A',
		scope:false,
		link:function(scope, element, attrs){
			var collect = $(element);
			//var tableindex = $('.common_tab').index(collect);
			var path = $location.path();
			var name = path+"*tab";//+tableindex;
			
			collect.delegate('a','mouseup',function(){
				$(this).addClass('current').siblings().removeClass('current');
				var ind = $(this).index();
				sessionStorage.setItem(name,ind);
				if(collect.next().hasClass('tab-content')){
					
					collect.next().find('.tab-pane').eq(ind).addClass('active').siblings().removeClass('active');
				}
			});
			/*scope.$watch(function(){return $(element).find('a').length;},function(newVal,oldVal){
				//用sessionStorage存储点击的tab索引
				if($(element).hasClass('ommon_tab_type2')){return;}
				var index = sessionStorage.getItem(name)||0;
				collect.find('a').eq(index).addClass('current').siblings().removeClass('current');
				var a = collect.find('a').eq(index);
				var fn = a.attr('ng-click')||a.attr('onclick');
				scope.$eval(fn);
				if(!scope.$$phase) {
					  scope.$apply();
				}
			});*/
		}
	};
}])
//group用法
//<div class="request_content common_tab_type1" 
//	group //组件标签
//	datasource="vcpu" //数据源
//	selected_key="selectedvcpu" //当前选中item的key
//	key = "value" //可选参数，数据源中key值对应的属性名，默认为'key'
//	display_value="name"//可选参数，数据源中value值对应的属性名，默认为'value'
//	selecte_change="vcpuChange(data)" //相当于onchange事件，对应controll中相应的function
//</div>
//以上模板定义对应的数据源
//  function MyCtrl1($scope) {
//	$scope.selectedvcpu = 1;
//	$scope.vcpu = [{value:1,name:'1'},
//			       {value:2,name:'2'},
//			       {value:4,name:'4'},
//			       {value:8,name:'8'}];		   
//  };
//	$scope.vcpuChange = function(data){...};

.directive('group',function(){
	return{
		restrict: 'A',
		scope:{
			selectedKey:"=",
			datasource:"=",
			selecteChange:"&"
		},
		template:
			'<a href="" ng-repeat="data in datasource" ng-class="{current:(data[key] == selectedKey)}"'+
			'ng-click="_radioitemclick(data)">{{data[displayValue]}}</a>',
		controller:function($scope, $element, $attrs){
			$scope.key = $attrs.key||'key';
			$scope.displayValue = $attrs.displayValue||'value';
			$scope.myds = $scope.$parent[$attrs.datasource];
			$scope._radioitemclick = function(data){
				$scope.selectedKey = data[$scope.key]; 
				$scope.selecteChange({data:data});
			};
		}
	};
})
.directive('multiselect',function(){
	return{
		restrict: 'A',
		scope:{
			selectedKey:"=",
			datasource:"=",
			selecteChange:"&"
		},
		template:
			'<a href="" ng-repeat="data in datasource" ng-class="{current:arr[$index]}"'+
			'ng-click="_radioitemclick(data,$index)">{{data[displayValue]}}</a>',
		controller:function($scope, $element, $attrs){
			
			$scope.key = $attrs.key||'key';
			$scope.displayValue = $attrs.displayValue||'value';
			$scope.myds = $scope.$parent[$attrs.datasource];

			$scope.arr = [];
			$scope._radioitemclick = function(data,n){
				$scope.arr[n] = !$scope.arr[n];
				if($scope.arr[n]){
					$scope.selectedKey.push($scope.datasource[n][$scope.key]);
				}else{
					for(var i=0,l=$scope.selectedKey.length;i<l;i++){
						if($scope.selectedKey[i] == $scope.datasource[n][$scope.key]){
							$scope.selectedKey.splice(i,1);
						}
					}
				}
				$scope.selecteChange({data:data});
			};
			
			$scope.isSeclected = function(n){
					for(var i=0,l=$scope.selectedKey.length;i<l;i++){
						if($scope.datasource[n][$scope.key]==$scope.selectedKey[i]){
							return true;
						}
					}
					return false;
			};
			for(var i=0,l=$scope.datasource.length;i<l;i++){
				$scope.arr.push($scope.isSeclected(i))
			}
		}
	};
})
//dropdown组件用法
//<div style=" float:left; "
//	dropdown //组件标签
//	datasource="datacenter" //数据源
//	selected_key="selected_datacenter" //当前选中item的key
//	selecte_change="datacenterchanged(data)" //相当于onchange事件，对应controll中相应的function
//	key = "id" //可选参数，数据源中key值对应的属性名，默认为'key'
//	displayvalue="name"//可选参数，数据源中value值对应的属性名，默认为'value'>				
//</div>
.directive('dropdown',function(){
	return{
		restrict: 'A',
		scope:{
			datasource:"=",
			selectedKey:"=",
			selecteChange:"&",
			displaymsg:"@" //label 的双语言功能  displaymsg="{{rb.cloud.account.query.type}}"
		},
		template:
			'<div class="select-analog image_selectD0" ng-click="_click()" ng-class="{zindex100:_showmenu}">'+
				'<a class="title">{{displaymsg||\'&nbsp\'}}</a>'+
				'<ul ng-show="_showmenu" class="newul">'+				
					'<li ng-repeat="data in datasource">'+
						'<a ng-click="_itemclick(data,$event)" href="">{{data[displayvalue]}}</a>'+
					'</li>'+
				'</ul>'+
			'</div>',
		controller:function($scope, $element, $attrs){
			$scope.displaymsg = $attrs.displaymsg||'';
			$scope.key = $attrs.key||'key';
			$scope.displayvalue = $attrs.displayvalue||'value';
			$scope.myds = $scope.$parent[$attrs.datasource];
			$scope.$watch('selectedKey', function(newValue, oldValue) {
				for(var index in $scope.datasource){
					if($scope.datasource[index][$scope.key] == $scope.selectedKey) {
						$scope.selectedvalue = $scope.datasource[index][$scope.displayvalue];
						if($scope.displaymsg==undefined||$scope.displaymsg === '')
							$scope.displaymsg = $scope.selectedvalue;
					}
				}
			});	
			$scope.$watch('datasource', function(newValue, oldValue) {
				$scope.displaymsg = $attrs.displaymsg||'';
				for(var index in $scope.datasource){
					if($scope.datasource[index][$scope.key] == $scope.selectedKey) {
						$scope.selectedvalue = $scope.datasource[index][$scope.displayvalue];
						if($scope.displaymsg==undefined||$scope.displaymsg === '')
							$scope.displaymsg = $scope.selectedvalue;
					}
				}
			});	

			$scope._showmenu = false;
			$($element).bind('mouseleave',function(){
				$scope.$apply($scope._showmenu = false);
				});
			$scope._click = function(data){
				$scope._showmenu = true;
			};
			$scope._itemclick = function(data,$event){
				$scope.selectedKey = data[$scope.key]; 
				$scope.selectedvalue = data[$scope.displayvalue];
				$scope.displaymsg = $scope.selectedvalue;
				$scope._showmenu = false;
			    var  e =  $event ?  $event : window.event;  
			    if (window.event&&e.cancelBubble!=undefined) { // IE  
			        e.cancelBubble = true;   
			    } else { // FF  
			        //e.preventDefault();   
			        e.stopPropagation();   
			    }
			    $scope.selecteChange({data:data});
			};
			
		}
	};
})
.directive('progress',function(){

	return{
		restrict: 'A',
		scope:{
			value:"=",	
			min:"="
		},
		template:
			'<div class="progress_box" style="float: left">'+
				'<div class="progress_anchor"></div>'+
				'<div class="progress_left"></div>'+
			'</div>'+
			'<div class="progress-result-box"><div class="common_text common_text_type5"'+
				'style="float: left; margin-left: 15px">'+
				'<input class="progress_result" ng-model="value"  ng-keyup="checkval"/>'+
			'</div>{{label}}</div>'
		,
		controller:function($scope,$element,$attrs){
			var totalVal = $attrs.totalval;
			var pro = $($element);
			var proWidth = pro.find('.progress_box').width()-10;
			var anchor = pro.find('.progress_anchor');
			var progress_left = pro.find('.progress_left');
			var resultbox = pro.find('.progress_result');
			var min = $scope.min||0;
			var minleft = 0;
			var label = $attrs.label||'GB';
			$scope.label = label;
			var interval = $attrs.interval||10;
			var step = $attrs.step||4;
			var setVal = $scope.value||'';
			if(step){
				var interdistance = proWidth/step;
				for(var i=0;i<=step;i++){
					var span = document.createElement('span');
					span.innerHTML = Math.ceil(totalVal/step*i) + label;
					span.style.position = 'absolute';
					span.style.top = '20px';
					span.style.color = '#666';
					span.style.left = i*interdistance - 10  + 'px';
					pro.append(span);
				}
			}
			if(interval){
				var interdistance = interval/totalVal*proWidth;
			}
			$scope.$watch('min', function(newValue, oldValue) {
				if(newValue){
					min = newValue;
				}
				minleft = min/totalVal*proWidth;
				anchor.css({left:minleft});
				$scope.value = min;
			});	
			
			$scope.checkval = function(){
				//$scope.value = (Math.floor(Number($scope.value)/Number(interval))+1)*Number(interval);
				
				if(isNaN($scope.value)){
					$scope.value  = min;
				}
				if($scope.value == ''){
					$scope.value  = 0;
				}
				$scope.value =parseFloat($scope.value);
				
				if($scope.value>totalVal){
					$scope.value = totalVal;
				}	
				var leftval = $scope.value
				if(leftval<min){
					leftval = min;
				}
				valleft = leftval/totalVal*proWidth;
				anchor.css({left:valleft});
				if(!$scope.$$phase) {
					  $scope.$apply();
				}
				if($scope.value == 0){
					resultbox.val('');	
				}
			};
			resultbox.bind('blur',function(){
				if(isNaN(this.value))
					this.value  = min
				var newValue = Math.round(this.value);
				if(Math.floor(Number(newValue)/Number(interval))*Number(interval)==Number(newValue))
					this.value = newValue;
				else
					this.value = (Math.floor(Number(newValue)/Number(interval))+1)*Number(interval);
				if(Number(this.value)>Number(totalVal))
					this.value = totalVal;
				if(Number(this.value)<Number(min))
					this.value  = min;
				if(Number(this.value)>Number(totalVal))
					this.value  = totalVal;
				$scope.value = this.value;
				setVal = this.value;
				valleft = setVal/totalVal*proWidth;
				anchor.css({left:valleft});
				if(!$scope.$$phase) {
					  $scope.$apply();
				}
			});
			anchor.on('mousedown',function(e){
				$(document).on('mousemove',function(e){
						move(e);
				});
			});
			$(document).on('mouseup',function(){
				$(document).off('mousemove');
			});
			function move(e){
				var e = e||window.event;
				var oldleft = anchor.position().left;
				var left = e.pageX - getLeft(pro[0]) - 5;
				if(left>=-10&&left<=proWidth+10){
					if(left< minleft){left=minleft};
					if(left>proWidth){left = proWidth}
					
				anchor.css({left:left});
				progress_left.css({width:left+'px'});
				
				left = Math.ceil((left/proWidth)*totalVal);
				var differ = (left-min)% interval;
				if(left!=totalVal){
					left -= differ;
				}
				/***
				 * 这块只做了数字的变化没有在样式上做改变，否则每次都会出现一种很生硬的感觉，除非每次增长的很大，
				 * 如果有需求在做更改
				 * **/
				$scope.value = left;
				$scope.$apply();
				}
			}
			function getLeft(e){
			    var offset=e.offsetLeft;
			    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
			    return offset;
			}
		}
	};
}).directive('toggle',function(){
	return {
		scope:{
			show:false
		},
		link:function(scope,element,attr){
			angular.element(element).on('mouseover',function(){
				
				scope.show = true;
			})
			angular.element(element).on('mouseout',function(){
				
				scope.show = false;
			})
		}
	}
}).directive("abbrbox",function(){
	return{
		restrict: 'C',
		link:function(scope, element, attrs,$timeout,$browser){
			var o = $(element).find("input");
			scope.$watch(function(){
				return o.val()
			},function(newVal){
				underline(o);
			})
			var class1 = "common_text common_text_type2";
			var defaultVal;
			o.focus(function(){
				var that = $(this);
				defaultVal = that.val().trim();
				that.parent().addClass(class1);
				that.next('.abbr').hide();
			});
			o.keyup(function(){
				underline(o);
			});
			o.blur(function(){
				var that = $(this);
				that.parent().removeClass(class1);
				that.next('.abbr').show();
				
			});
			function underline(obj){
				$(obj).each(function(){
					var that = $(this);
					var next = that.next();
					var hasabbr = next.hasClass('abbr');
					if(hasabbr){
						next.html(that.val());
					}else{
					var abbr = "<span class='abbr'>"+ that.val()+"</span>";
					that.after(abbr);
					}
				});
			}
		}
	};
}).directive("operate",function(){
	return{
		restrict: 'C',
		scope:false,
		link:function(scope, element, attrs){

			var displaymsg= _rb.cloud.account.operation;
			attrs.$observe('displaymsg',function(newVal,oldVal){
				if(newVal){
					angular.element(element).find('.operate_title').html(newVal);
				}
			})
			var o = $(element).find("a");
			if(o.length==0){
				$(element).append('<div class="operate_box"><div class="operate_title">'+displaymsg+'</div></div>');
				return;	
			}else{
				$(element).append('<div class="operate_box"><div class="operate_title">'+displaymsg+'</div><ul class="operate_ul"></ul></div>');
			}
			var ul = $(element).find('ul');
			o.each(function(){
				$(this).append('<s></s>');
				$(this).wrap('<li></li>');
				var show = $(this).attr('ng-show');
				var disable = $(this).attr('ng-disabled');
				//To get ngclick function string.
				var ngclick = $(this).attr('ng-click')||$(this).attr('onclick');
				var that = $(this);
				
				scope.$watch(show,function(newVal){
					if(newVal == false){
						that.parent().hide();
					} else {
						that.parent().show();
					}
					var _ul = $(element).find('.operate_ul');
					var _ui = _ul.find('li');
					var _liLength = _ui.length;
					var _viLength = 0;
					for(var i=0; i<_liLength; i++) {
						if($(_ui[i]).css('display')!="none") {
							_viLength++;
						}
					}
					if(_viLength == 0) {
						$(_ul).remove();
						$(element).find('.operate_box').addClass('disable');
					}else{
						$(element).find('.operate_box').removeClass('disable');
					}
					
				});
				scope.$watch(disable,function(newVal){
					if(newVal){
						that.off('click');
						/**
						 * TODO
						 * Changes the CSS of operate buttons after disabled.
						 */
						//var c = that.attr('class');
						that.parent().addClass('disable');
					} else {
						that.off('click');
						that.bind('click', function(event) {
							//Angular provides $eval function to execute a string as a function, it's similar with eval function from javascript.
							scope.$eval(ngclick);
							//event.preventDefault();
							//event.stopPropagation();
						});
						that.parent().removeClass('disable');
					}
				});
			});
			$(element).find('li').appendTo(ul);
			$('.operate_box').hover(function(){$(this).addClass('hover')},function(){$(this).removeClass('hover');$(this).find('.operate_ul').hide();});
			$('.operate_box').mousedown(function(){$(this).addClass('active');
				var len = $(this).find('.operate_ul').find('li').length;
				var wHeight = document.documentElement.clientHeight==0?document.body.clientHeight:document.documentElement.clientHeight;
				if((len*25+40+$(this).offset().top)>document.documentElement.clientHeight+document.body.scrollTop){
					$(this).addClass('upward');
				}else{
					$(this).removeClass('upward');
				}
				var offsetleft = $(this).offset().left;
				var ulwidth = $(this).find('.operate_ul').width();
				var wWidth = document.documentElement.clientWidth;
				if((offsetleft+ulwidth)>wWidth){
					$(this).addClass('rightward');
				}
				$(this).find('.operate_ul').show();
			});
			$('.operate_box').mouseup(function(){$(this).removeClass('active')});
			
		}
	};
}).directive("content",function(){
	return{
		restrict: 'C',
		link:function(scope,element,attr){
			scope.$watch(function() { return $(element).height(); },function(newVal,oldVal){
				if(newVal+78>1000){
					$('#navigation').height(newVal+78);
				}else{
					$('#navigation').css("height",'auto');
				}
			});
		}
	}
}).directive('navUl',function($location){
	return {
		restrict:"C",
		link:function(scope,element,attr){
			scope.$watch(function() { return $location.path(); },function(newVal,oldVal){
				$(element).find('a').removeClass('active');
				$(element).find('a').each(function(){
					var sref = $(this).attr('href').split('#')[1];
					//console.log(newVal.match(sref))
					/* 这块连接还要改，最后在定匹配方法*/
					if(newVal == sref){
						$(this).addClass('active');
						return false;
					}
				});
			});
			$(element).find('a').on('click',function(){
				$(element).find('a').removeClass('active');
				$(this).addClass('active');
				$(element).find('li').removeClass('backgroundnone');
				if($(this).parent().next('li').length){
					$(this).parent().next('li').addClass('backgroundnone');
				}
			});
		}
	};
}).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).directive('enctype',function(){/**上传文本框样式**/
	return {
		restrict:"A",
		link:function(scope,element,attr){
			if($(element).attr('enctype') == "multipart/form-data"){
				var el = $(element);
				var file = el.find('input[type="file"]');
				if(el.find('.glance').length==0){
					el.prepend('<div class="common_text common_text_type2"><input type="text"></div><a class="glance">浏览</a>');
					file.bind('change',function(){
						var val = $(this).val();
						if(typeof val != "undefined"){
							var arr = val.split('\\');
							val = arr[arr.length-1];
						}
						$(this).prevAll('.common_text_type2').find('input').val(val);
					})
				}
			}
		}
	}
})
.directive('ipaddressbox', 
	function () {
	    return {
	    	scope: {
	    		ipvalue: '='
	    	},
	        template: '<span class="common-ip-box">' +
					  '<input ng-model="ip1" class="ip" ng-keyup="conbine"></input> . ' +
					  '<input ng-model="ip2" class="ip" ng-keyup="conbine"></input> . ' +
					  '<input ng-model="ip3" class="ip" ng-keyup="conbine"></input> . ' +
					  '<input ng-model="ip4" class="ip" ng-keyup="conbine"></input>' +
					  '</span>',
	        link: function (scope, element, attr) {
	            scope.ip1 = scope.ip2 = scope.ip3 = scope.ip4 = 0;
	            scope.conbine = function() {
	            	var _ptn = /^0|([1-9]{1})|([1-9]{1}[0-9]{1})|([1-2]{1}[0-5]{1}[0-5]{1})$/;
	            	if(_ptn.test(scope.ip1.toString()) && (scope.ip1 >= 0 && scope.ip1 <= 255)) {
		            	scope.ip1 = parseInt(scope.ip1);
	            	} else {
	            		scope.ip1 = 0;
	            	}
	            	if(_ptn.test(scope.ip2.toString()) && (scope.ip2 >= 0 && scope.ip2 <= 255)) {
		            	scope.ip2 = parseInt(scope.ip2);
	            	} else {
	            		scope.ip2 = 0;
	            	}
					if(_ptn.test(scope.ip3.toString()) && (scope.ip3 >= 0 && scope.ip3 <= 255)) {
		            	scope.ip3 = parseInt(scope.ip3);
					} else {
						scope.ip3 = 0;
					}
					if(_ptn.test(scope.ip4.toString()) && (scope.ip4 >= 0 && scope.ip4 <= 255)) {
		            	scope.ip4 = parseInt(scope.ip4);
	            	} else {
	            		scope.ip4 = 0;
	            	}
            		scope.ipvalue = scope.ip1 + '.' + scope.ip2 + '.' + scope.ip3 + '.' + scope.ip4;
					scope.$apply();
	            };
	        }
	    };
	}
).directive('imagename', function () {
    return {
    	restrict:"C",
        link: function (scope, element, attr) {
            $(element).keyup(function(e){
            	var e = e||window.event;
            	if(e.keyCode == 13){
            		if($(this).siblings('.imagesearch')){
            			var clickfn = $(this).siblings('.imagesearch').attr('ng-click');
            			scope.$eval(clickfn+"()");
            		}
            	}
            })
        }
    };
}
).directive('commonTable', function () {
    return {
    	restrict:"C",
        link: function (scope, element, attr) {
        	scope.$watch(function(){
        		return $(element).html();
        	},function(newValue,oldValue){
        		$(element).find('tr').find('th:last').addClass('rightbg');
        		$(element).find('tr').find('td:last').addClass('rightbg');
        		$(element).find('tr').find('th').on('click',function(){
        			$(this).addClass('current').siblings().removeClass('current');
        		});
        	});
        }
    };
}
).directive('butterbar',['$rootScope',function($rootScope){
	return {
		link:function(scope,element,attrs){
			element.addClass('hide');
			
			$rootScope.$on('$stateChangeSuccess',function(){
				element.addClass('hide');
			});
			$rootScope.$on('$stateChangeStart',function(){
				element.removeClass('hide');
			});
		}
	};
}]).directive('textarea',function($rootScope){
	return {
		restrict:"E",
		link:function(scope,element,attrs){
			$(element).TextareaScroll();
		}
	};
}).directive('commonArrowUp',function($rootScope){
	return {
		restrict:"C",
		link:function(scope,element,attrs){
			if($(element).next().hasClass('common_arrow_down')){
				$(element).hide();
			}
			$(element).parent().bind('click',function(){
				if($(element).css('display')=="none"){
					scope.$eval(attrs.ngClick);
					if(!scope.$$phase) {
						  scope.$apply();
					}
					$(element).show();
					$(element).next().hide();
				}else{
					scope.$eval($(element).next().attr('ng-click'));
					if(!scope.$$phase) {
						  scope.$apply();
					}
					$(element).hide();
					$(element).next().show();
				}
			})
		}
	};
});