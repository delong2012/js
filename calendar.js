/**************************************
 * Name:calendar.js
 * Author:delong
 * Des:日历插件,
 * 
 * (C) COPYRIGHT IBM Corporation 2012
 * All Rights Reserved. 
 * Licensed Materials-Property of IBM 
 * ***************************************/

/**
 * @author delong
 * @param monthNames 
 * @param dayNames
 * @param wekdaystart  从周几开始 
 * @param today  [2013,2,1] 月份减一
 * @param language  
 * @param $(input).calendar();
 */
(function($) {
    $.fn.calendar = function(options) {
        var defaults = {
            monthNames: eval(_rb.calendar.monthNames),
            dayNames: eval(_rb.calendar.dayNames),
            wekdaystart: 0,
            today: '', //[2013,2,1]
            language: 'zh',
            startDay:'',//[2013,6,1]
        	dateChangefn:''
        };
        var opts = $.extend(defaults, options);
        function calendar(opts,obj){
			if(opts.language == 'en_US'){opts.wekdaystart=0;}
	        if (opts.today == '') {
	            var td = new Date();
	            opts.today = [td.getFullYear(), td.getMonth(), td.getDate()];
	        }
	        this.opts = opts;
	        var $this = obj;
	        this.parent = $this.parent();
	        $this.css('readonly','readonly');
	        function creatbox(Y,M) {
	            var Mselect = "<select name='Mselect' class='Mselect'>";
	            for (var i = 0; i < 12; i++) {
	                Mselect = Mselect + "<option value=" + i + ">" + opts.monthNames[i] + "</option>";
	            }
	            Mselect += "</select>";
	            var Yselect = "<select name='Yselect' class='Yselect'>";
	            for (var i = 2013; i < 2050; i++) {
	                Yselect = Yselect + "<option value=" + i + ">" + i + _rb.calendar.Year + "</option>";
	            }
	            Yselect += "</select>";
	            var Wekdaylist = "<ul class='weklist'>";
	            for (var i = 0; i < 7; i++) {
	                var listorder = opts.wekdaystart + i;
	                if (listorder > 6) {
	                    listorder -= 7;
	                }
	                Wekdaylist = Wekdaylist + "<li>" + opts.dayNames[listorder] + '</li>'
	            }
	            Wekdaylist += "</ul>";
	            var html = "<div class='calpos'><div class='calbox'>" + language() + Wekdaylist + "<div class='caltablebox'><table class='caltable'></table></div></div></div>";
	            $this.after(html);
	            var msel = $('.Mselect');
	            msel.val(M);
	            baseJS._selectAnalog(msel,'image_selectD0 mw0');
	            var ysel = $('.Yselect');
	            ysel.val(Y)
	            baseJS._selectAnalog(ysel,'image_selectD0 mw0')
	            function language() {
	                if (opts.language == 'en_US') {
	                    return "<div class='calheader'>" + Mselect + Yselect + "</div>";
	                } else {
	                    return "<div class='calheader'>" + Yselect  + Mselect + "</div>";
	                }
	            }
	        };
	        function creatDate(Y, M,D) {
	            var daycount = [31, (C(Y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	            var d = new Date(Y, M, 1);
	            var weday = d.getDay();
	            var differday;
	            var daystart = opts.wekdaystart;
	            for (var i = 0; i < 7; i++) {
	                if (daystart == 7) {
	                    daystart = 0;
	                }
	                if (daystart == weday) {
	                    differday = i;
	                }
	                daystart++;
	            }
	            var daynum = differday + daycount[M];
	            var daylastnum = 28;
	            if (daynum > 28 && daynum <= 35) {
	                daylastnum = 35;
	            }
	            if (daynum > 35 && daynum <= 42) {
	                daylastnum = 42;
	            }
	            var tbody = '<tr>';
	            var addDaytd;
	            function getAddDay(){
	            	if(opts.startDay){
	            		function Istoday(Y, M) {
		                	if(opts.startDay[0]<Y){
		                		return 'islate';
		                	}else if(opts.startDay[0]>Y){
		                		return 'isearly';
		                	}else{
		                		if(M>opts.startDay[1]-1){
		                			return 'islate';
		                		}else if(M<opts.startDay[1]-1){
		                			return 'isearly';
		                		}else{
		                			if(Y==opts.today[0]&&M==opts.today[1]){
		                				//var themax = opts.today[2]>opts.startDay[2]?opts.today[2]:opts.startDay[2];
			                			return [opts.startDay[2],opts.today[2]];
		                			}else{
		                				return [opts.startDay[2]];
		                			}
		                		}
		                	}
		                }
		            	var today = Istoday(Y, M);
		                if (today == 'isearly'){
		                	addDaytd = function(i) {
		                        tbody = tbody + "<td><span>" + (i - differday) + "</span></td>";
		                    };
		                }else if(today == 'islate'){
		                	addDaytd = function(i) {
		                        tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
		                    };
		                }else{
		                	addDaytd = function(i) {
		                		if(D){
			            			if( D + differday == i){
			            				tbody = tbody + "<td><a class='current'>" + D + "</a></td>";
			            			}else{
			            				if (i > parseInt(today[0]) + differday) {
			                        		tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
			                        	}else{
			                        		tbody = tbody + "<td><span>" + (i - differday) + "</span></td>";
			                        	}
			            			}
			            		}else{
			                		if(i == parseInt(opts.today[2]) + differday){
			                			if(opts.today[2]<today[0]){
			                				tbody = tbody + "<td><span class='current'>" + (i - differday) + "</span></td>";
			                			}else{
			                				tbody = tbody + "<td><a class='current'>" + (i - differday) + "</a></td>";
			                			}
			                		}else{
			                        	if (i >= parseInt(today[0]) + differday) {
			                        		tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
			                        	}else{
			                        		tbody = tbody + "<td><span>" + (i - differday) + "</span></td>";
			                        	}
			                        }
			            		}
		                    };
		                };
		                
		            }else{
		            	addDaytd = function(i){
		            		if(D){
		            			if( D + differday == i){
		            				tbody = tbody + "<td><a class='current'>" + D + "</a></td>";
		            			}else{
		            				tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
		            			}
		            		}else{
			            		if (opts.today[2] + differday == i) {
			            			if(Y==opts.today[0]&&M==opts.today[1]){
			            				tbody = tbody + "<td><a class='current'>" + (i - differday) + "</a></td>";
			            			}else{
			            				tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
			            			}
			            		}else{
				            		tbody = tbody + "<td><a>" + (i - differday) + "</a></td>";
			            		}
		            		}
		            	};
		            }
	            }
	            getAddDay();
	            for (var i = 1; i <= daylastnum; i++) {
	                if (i>1&&(i - 1) % 7 == 0) {
	                    tbody += "<tr>";
	                }
	                if (i > differday && i <= daynum) {
	                    addDaytd(i)
	                } else {
	                    tbody = tbody + "<td></td>";
	                }
	                if (i % 7 == 0) {
	                    tbody += "</tr>";
	                }
	            }
	            $this.next('.calpos').find('.caltable').html(tbody);
	            function C(y) {
	                if (y % 4 == 0) {
	                    return true;
	                }
	            };
	            
	        }
	        
	        function position() {
	            var top = 25 + 3 + 'px';
	            $this.parent().css({'position': 'relative','z-index':'2'});
	            $this.next('.calpos').css({
	                'position': 'absolute',
	                left: 0,
	                top: top
	            });
	        }
	        function changeMonth() {
	            var M = $this.next('.calpos').find('select:[name="Mselect"]');
	            M[0].value = opts.today[1];
	            var Y = $this.next('.calpos').find('select:[name="Yselect"]');
	            Y[0].value = opts.today[0];
	        }
	        function changeDate() {
	            var M = $this.next('.calpos').find('select:[name="Mselect"]').val();
	            var Y = $this.next('.calpos').find('select:[name="Yselect"]').val();
	            creatDate(Y, M);
	        }
	        this.init = function() {
	        	this.parent.css('z-index','10')
	            this.calpos = $this.next('.calpos');
	            if (this.calpos.length == 1) {
	            	this.calpos.remove();
	            }	
	            if($this.val()){/********添加高亮选中值功能*********/
	            	var origiVal = $this.val().split('-');
	            	for(var i=0;i<3;i++){
	            		origiVal[i]=parseInt(origiVal[i])
	            	}
	            	creatbox(origiVal[0], origiVal[1]-1);
	                creatDate(origiVal[0], origiVal[1]-1,origiVal[2]);
	            }else{
	                creatbox(opts.today[0], opts.today[1]);
	                creatDate(opts.today[0], opts.today[1]);
	            }
	                //show();
	                this.calpos = $this.next('.calpos');
	                changeMonth();
	                position();
	                var Mselect = this.calpos.find('select:[name="Mselect"]');
	                var Yselect = this.calpos.find('select:[name="Yselect"]');
	                Mselect[0].onclick = function(evt) {evt = evt||window.event;evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;}
	                Yselect[0].onclick = function(evt) {evt = evt||window.event;evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;}
	                Mselect.change(this,function(evt) {
	                    changeDate();
	                    evt.data.show();
	                });
	                Yselect.change(function() {
	                    changeDate();
	                });
	                this.calpos.find('table').delegate('td a', 'click',
	                function(){
	                    var val = Yselect.val() + '-' + (parseInt(Mselect.val()) + 1) + '-' + $(this).html();
	                    $this.val(val);
	                    var startday = [Yselect.val(),(parseInt(Mselect.val()) + 1),$(this).html()];
	                    $this.focus().blur();
	                    if(opts.dateChangefn){opts.dateChangefn(startday);}
	                    
	                });
	                this.calpos.find('table').delegate('td span', 'click',
	    	                function(evt){evt = evt||window.event;evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;
	                });
	        };

	        this.init();
	        this.hide = function(){
	        	this.parent.css('z-index','0');
	        	this.calpos.stop(true,true).css({
	                width: 0,
	                height: 0
	            });
	        };
	        this.show = function() {
	            var calbox = $this.next('.calpos')[0].firstChild;
	            var width = calbox.offsetWidth + 'px';
	            var height = calbox.offsetHeight + 'px';
	            $this.next('.calpos').animate({
	                'width': width,
	                height: height
	            },
	            500);
	        };
        }
        $(this)[0].onclick = function(evt) {
        	if(document.onclick)(document.onclick());
        	var ca = new calendar(opts,$(this));
            document.onclick = function(){ca.hide()};
        	ca.show();
        	evt = evt||window.event;evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;
        };

           
    };
})(jQuery);