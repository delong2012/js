/**************************************
 * Name:calendar.js
 * Author:delong
 * Des:月份选择插件,
 * 
 * (C) COPYRIGHT IBM Corporation 2012
 * All Rights Reserved. 
 * Licensed Materials-Property of IBM 
 * ***************************************/

/**
 * @author delong
 * @param monthNames 
 * @param startdate //[2012,3] 获取月份开始时间 数组 [年,月]
 * @param enddate  //[2013,5] 获取月份结束时间  数组 [年,月]
 * @param today   // [2013,5] 获取月份现在时间  数组 [年,月]
 */
(function($) {
	$.fn.month = function(options){
		var defaults = {
	            startdate:[],
	            enddate:[],
	            today:[],
	            dateChangefn:'',
	            addTemplate:''
	        };
		var opts = $.extend(defaults, options);
		if(!opts.today[0]){
			var d = new Date();
			opts.today = [d.getFullYear(),d.getMonth()+1];
		}
		
		var $this = $(this);
		$this.off('click')
		function creatbox(Y) {
	        var Yselect = "<div class='Yselect'>"+Y+"</div>";
	        if(Y==opts.startdate[0]){
	        	var prev ="<div class='fn-left prev' style='visibility:hidden'>"+_rb.monthselect.prevyear+"</div>";
	        }else{
	        var prev = "<div class='fn-left prev'>"+_rb.monthselect.prevyear+"</div>";
	        }
	        if(Y==opts.enddate[0]){
	        	var next = "<div class='fn-right next' style='visibility:hidden'>"+_rb.monthselect.nextyear+"</div>";
	        }else{
	        var next = "<div class='fn-right next'>"+_rb.monthselect.nextyear+"</div>";
	        }
	        var html = "<div class='calpos'><div class='calbox'><div class='calheader'>"+next+ prev + Yselect+ "</div><table class='caltable' style='width:150px;margin:20px auto;'></table>"+opts.addTemplate+"</div></div>";
	        $this.after(html);
	    };
		function creatDate(Y,M,currentMonth) {
	        var month = '<tr>';
	        var addmonth = function(i){
	        	var td = "<td><a>"+i+"</a></td>";
	        	
	        	if(Y>opts.enddate[0]||Y<opts.startdate[0]){
	        		td = "<td></td>";
	        	}else{
	        		if(Y==opts.startdate[0]){
	            		if(i<opts.startdate[1]){
	            			td = "<td></td>";
	            		}
	            	}
	            	if(Y==opts.enddate[0]){
	            		if(i>opts.enddate[1]){
	            			td = "<td></td>";
	            		}
	            	}
	            	if(Y == Y){
		            		if(i==M&&i<=opts.enddate[1]){
		            			td = "<td><a class='current'>"+i+"</a></td>";
		            		}
	            	}
	        	}
	        	month += td;
	        };
	        for (var i = 1; i < 13; i++) {
	        	addmonth(i);
	            if (i==4||i==8) {
	            	month += "</tr><tr>";
	            }
	            if (i==12) {
	            	month += "</tr>";
	            }
	        }
	        $this.next('.calpos').find('.caltable').html(month);
	    }
		function show() {
	        var calbox = $this.next('.calpos')[0].firstChild;
	        var width = calbox.offsetWidth + 'px';
	        var height = calbox.offsetHeight + 'px';
	        $this.next('.calpos').animate({
	            'width': width,
	            height: height
	        },
	        500);
	    }
	    function position() {
	        $this.parent().css({'position': 'relative','z-index':'2'});
	        $this.next('.calpos').css({
	            'position': 'absolute',
	            left: 0,
	            top: $this.parent().height()
	        });
	    }
	    function init() {
	    	if($this.val()){
	    		 var currentMonth = $this.val().split('-');
	    	}
	        var calbox = $this.next('.calpos');
	        $this.parent().css('z-index',1000);
	        	if(currentMonth){
	        		creatbox(currentMonth[0]);
		            creatDate(currentMonth[0],currentMonth[1]);
		            if(currentMonth[0]==opts.startdate[0]&&currentMonth[1]==opts.startdate[1]){
		            	$('#prevreportmonth').css('visibility','hidden')
		            }
	        	}else{
	        		creatbox(opts.today[0]);
	        		creatDate(opts.today[0],opts.today[1]);
	        	}
	            show();
	            position();
	            var Yselect = $this.next('.calpos').find('.Yselect');
	            var next = $this.next('.calpos').find('.next');
	            var prev = $this.next('.calpos').find('.prev');
	            next.click(function(evt){
	            	var year = Yselect.html();
	            	evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;
	            	if(year<opts.enddate[0]){
	            		Yselect.html(parseInt(year)+1);
	            		creatDate(parseInt(year)+1);
	            	}
	            	if(year==opts.enddate[0]-1){
	            		next.css("visibility",'hidden');
	            	}
	            	prev.css("visibility",'visible');
	            });
	            prev.click(function(evt){
	            	evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;
	            	var year = Yselect.html();
	            	if(year>opts.startdate[0]){
	            		Yselect.html(year-1);
	            		creatDate(year-1);
	            	}
	            	if(year==opts.startdate[0]+1){
	            		prev.css("visibility",'hidden');
	            	}
	            	next.css("visibility",'visible');
	            });
	            $this.next('.calpos').find('table').delegate('td a', 'click',
	            function() {
	                var val = Yselect.html() + '-' + $(this).html();
	                $this.val(val);
	                if(opts.dateChangefn){opts.dateChangefn(val);}
	            });
	    };
	    function hide(){
	    	$this.parent().css('z-index','0');
	    	$('.calpos').remove();
	    }
	    $this.click(function(evt) {
	    	evt.stopPropagation?evt.stopPropagation():evt.cancelBubble=true;
	        init();
	    });
	    document.onclick=function(){hide();};
	};
})(jQuery);