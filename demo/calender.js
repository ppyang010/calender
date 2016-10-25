//

(function(){

    function Calender(options){
        this._options=options;
        this._options.dom=document.getElementById(this._options.domID);//input

        this._init(this._options)
    }
    Calender.prototype={
        _init:function(options){
            var _self=this;//cal实例
            var dom=options.dom;
            var div=html2node(template);
            // _self._dateHtmlInit(div,selectDate);//生成日期HTML
            _self._buttonInit(div);//按钮事件初始化
            _self._options.div=div;//存储弹窗

            addEvent(dom,"focus",function(){//显示事件
                var value=this.value;
                _self._options.date =_self._valDate(value)||new Date();//根据input值设置选中的日期 input为空则使用今天
                _self._options.showDate =_self._valDate(value)||new Date();;//设置显示日期  用于年月切换
                _self._dateHtmlInit(div,_self._options.date);//生成日期HTML
                // console.dir(value);
                var x=pageX(this);
                var y=pageY(this)+this.offsetHeight;
                div.style.cssText='top:'+y+'px; left:'+x+'px;'
                document.body.appendChild(div);
            });
            addEvent(document,"click",function(e){//隐藏事件
                var target=e.target;
                //  console.dir(e.target);
                if(isExist(div,document.body)){
                    if(!isExist(target,div)&&e.target!=dom){
                        document.body.removeChild(div);
                    }
                }
            });
        },
        show:function(){
            this._options.dom.dispatchEvent("focus");//触发事件
        },
        hide:function(){
            document.body.removeChild(this._options.div);
        },

        //可能需要重写 或者在写一个方法用于翻页后显示
        _dateHtmlInit:function(div,selectDate){
            var _self=this;
            var tbody=div.getElementsByTagName("tbody")[0];
            var header=div.getElementsByClassName("calendar-date")[0];
            var now=selectDate|| new Date();
            var month=now.getMonth()+1;//选中日期所在月份
            var year=now.getFullYear();//选中日期所在年份
            var day=now.getDate();//选中日期的日期数
            var days=(new Date(year,month,0)).getDate();//选中日期所在月份天数
            var lastMonthDays=new Date(year,month-1,0).getDate();//上个月天数
            var firstDay=new Date(year,month,1).getDay();//选中日期所在月份第一天的星期数
            var lastDay=new Date(year,month,days).getDay();//选中日期所在月份最后一天的星期数
            tbody.innerHTML="";//清空
            header.innerHTML='<span class="calendar-year">'+year+'</span>-<span class="calendar-month">'+month+'</span>';
            //第一行
            var _days=_self._addRow(firstDay,1,days,day,tbody);
            while(_days<=days){
                _days=_self._addRow(0,_days,days,day,tbody);
            }

        },
        //渲染日历html
        _renderDateHtml:function(div,showDate,selectDate){
            var _self=this;
            var tbody=div.getElementsByTagName("tbody")[0];
            var header=div.getElementsByClassName("calendar-date")[0];
            var now=showDate|| new Date();
            var month=now.getMonth()+1;//显示日期所在月份
            var year=now.getFullYear();//显示日期所在年份
            var days=(new Date(year,month,0)).getDate();//显示日期所在月份天数
            var lastMonthDays=new Date(year,month-1,0).getDate();//上个月天数
            var firstDay=new Date(year,month,1).getDay();//显示日期所在月份第一天的星期数
            var lastDay=new Date(year,month,days).getDay();//显示日期所在月份最后一天的星期数

            var day=selectDate.getDate();//选中日期的日期数
            tbody.innerHTML="";//清空
            header.innerHTML='<span class="calendar-year">'+year+'</span>-<span class="calendar-month">'+month+'</span>';
            console.log(selectDate==showDate);
            if(selectDate==showDate){
                //第一行
                var _days=_self._addRow(firstDay,1,days,day,tbody);
                while(_days<=days){
                    _days=_self._addRow(0,_days,days,day,tbody);
                }
            }else{
                var _days=_self._addRow(firstDay,1,days,0,tbody);
                while(_days<=days){
                    _days=_self._addRow(0,_days,days,0,tbody);
                }
            }

        },
        //添加日历行  开始星期数(从0开始) 开始日期数(这一行从哪个日期开始) 该月最大天数数 选中日期的日期值  tbody
        _addRow:function(startDay,date,maxDays,selectDate,dom){
            var _self=this;//cal实例
            var tr=newRow(7);
            var tds=tr.getElementsByTagName("td");
            for(var i=startDay;i<7;i++){
                if(date>maxDays){
                    break;
                }
                // tds[i].innerHTML='<a href="javascript:void(0);">'+day+'</a>';
                if(date!=selectDate){
                    tds[i].className="calendar-day";
                }else{
                    tds[i].className="calendar-day calendar-selected";
                }
                tds[i].innerHTML=date;
                addEvent(tds[i],"click",function(){
                    var doms=dom.getElementsByClassName("calendar-clicked");
                    var date=this.innerText;
                    var year=_self._options.div.getElementsByClassName("calendar-year")[0].innerText;
                    var month=_self._options.div.getElementsByClassName("calendar-month")[0].innerText;
                    setClass(doms,"calendar-day");
                    this.className="calendar-day calendar-clicked";
                    _self._options.date=new Date(year,month-1,date);
                });
                date++;
            }
            dom.appendChild(tr);
            return date;
        },
        //按钮点击事件初始化
        _buttonInit:function (dom) {
            var _self=this;//实例
            var todayBtn=dom.getElementsByClassName("todayBtn")[0];//今天按钮
            var cancelBtn=dom.getElementsByClassName("cancelBtn")[0];//取消按钮
            var confirmBtn=dom.getElementsByClassName("confirmBtn")[0];//确认按钮
            var prevYearBtn=dom.getElementsByClassName("calendar-prevyear")[0];//上一年按钮
            var prevMonthBtn=dom.getElementsByClassName("calendar-prevmonth")[0];//上一月按钮
            var nextYearBtn=dom.getElementsByClassName("calendar-nextyear")[0];//下一年按钮
            var nextMonthBtn=dom.getElementsByClassName("calendar-nextmonth")[0];//下一月按钮
            //菜单界面按钮
            var calendarDateBtn=dom.getElementsByClassName("calendar-date")[0];//月份菜单按钮

            todayBtn.onclick=function(){
                _self._options.date=new Date();
                var val=formatDate(_self._options.date, _self._options.pattern);
                _self._options.dom.value=val;
                cancelBtn.onclick();
            };
            cancelBtn.onclick=function(){
                _self.hide();
            };
            confirmBtn.onclick=function(){
                var val=formatDate(_self._options.date, _self._options.pattern);
                _self._options.dom.value=val;
                cancelBtn.onclick();
            };

            prevYearBtn.onclick=function(){
                var showDate=_self._options.showDate;//显示日期
                showDate.setFullYear(showDate.getFullYear()-1);
                _self._renderDateHtml(dom,showDate,_self._options.date);
            };
            prevMonthBtn.onclick=function(){
                var showDate=_self._options.showDate;//显示日期
                showDate.setMonth(showDate.getMonth()-1);
                _self._renderDateHtml(dom,showDate,_self._options.date);
            };
            nextYearBtn.onclick=function(){
                var showDate=_self._options.showDate;//显示日期
                showDate.setFullYear(showDate.getFullYear()+1);
                _self._renderDateHtml(dom,showDate,_self._options.date);
            };
            nextMonthBtn.onclick=function(){
                var showDate=_self._options.showDate;//显示日期
                showDate.setMonth(showDate.getMonth()+1);
                _self._renderDateHtml(dom,showDate,_self._options.date);
            };
            calendarDateBtn.onclick=function(){
                var dtable=_self._options.div.getElementsByClassName("calendar-dtable")[0];
                var menu=_self._options.div.getElementsByClassName("calendar-menu")[0];
                console.log(dtable.style.display);
                if(dtable.style.display=="none"){
                    dtable.style.display="table";
                    menu.style.display="none";
                }else{
                    dtable.style.display="none";
                    menu.style.display="block";
                    _self._addMtableTbody();
                }

            }

        },
        //验证输入框中的data格式 并转换成日期对象
        _valDate:function(value){
            var dateP=/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/;
            var flag=value.match(dateP);
            if(!flag){
                return false;
            }else{
                var strs=value.split(/[-\/\._]/);
                console.log(strs[1]);
                return new Date(strs[0],strs[1]-1,strs[2]);
            }
        },
        //添加MtableTbody月份内容
        _addMtableTbody:function(){
            var _self=this;//cal实例
            var div=_self._options.div;
            var dom=div.getElementsByTagName("tbody")[1];
            dom.innerHTML="";
            var yearInput=div.getElementsByClassName("calender-menu-year")[0];
            var showDate=_self._options.showDate;
            var showMonth=showDate.getMonth()+1;
            var showYear=showDate.getFullYear();
            yearInput.value=showYear;
            var tr=newRow(4);
            var tds=tr.getElementsByTagName("td");
            var m=1;
            while(m<12){
                var tr=newRow(4);
                var tds=tr.getElementsByTagName("td");
                for(var i=0,len=tds.length;i<len;i++){
                    tds[i].innerText=m;
                    if(showMonth!=m){
                        tds[i].className="calendar-day";
                    }else{
                        if(yearInput.value==showYear){
                            tds[i].className="calendar-day calendar-selected";
                        }
                    }
                    addEvent(tds[i],"click",function(){
                        var doms=dom.getElementsByClassName("calendar-clicked");
                        var month=this.innerText;
                        var year=yearInput.value;
                        setClass(doms,"calendar-day");
                        this.className="calendar-day calendar-clicked";
                        _self._options.showDate=new Date(year,month-1);
                        div.getElementsByClassName("calendar-date")[0].onclick();
                        console.dir(_self);
                        _self._renderDateHtml(div,_self._options.showDate,_self._options.date);

                    });
                    m++;
                }
                dom.appendChild(tr);
            };
        }




    }



    //公共方法
    //获取元素到左侧的距离
    function pageX(elem) {
      return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
    }
    //获取元素到顶部的距离
    function pageY(elem) {
      return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
    }
    //模版
    var template='<div class="module-calendar"> \
        <div class="calendar-header"><i class="calendar-nav calendar-prevyear"></i><i class="calendar-nav calendar-prevmonth"></i><p class="calendar-date"></p><i class="calendar-nav calendar-nextmonth"></i><i class="calendar-nav calendar-nextyear"></i></div>\
        <div class="calendar-body"><table class="calendar-dtable"  border="0" cellspacing="0" cellpadding="0" >\
        <thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead>\
        <tbody></tbody>\
        </table>\
        <div class="calendar-menu" style="display:none"><div class="calender-menu-year-wrap"><i class="calendar-nav calendar-menu-prevyear"></i><input type="text" class="calender-menu-year"><i class="calendar-nav calendar-menu-nextyear"></i></div>\
        <table class="calendar-mtable"  border="0" cellspacing="0" cellpadding="0"  >\
        <tbody></tbody>\
        </table>\
        </div>\
        </div>\
        <div class="calendar-footer"><button class="confirmBtn">确定</button><button class="todayBtn">今天</button><button class="cancelBtn">取消</button></div>\
    </div>\
    ';

    function html2node(str){
        var div=document.createElement('div');
        div.innerHTML=str;
        return div.children[0];
    }

    //添加事件 兼容低版本浏览器
    function addEvent(obj,type,fn){
        if(obj.addEventListener){
            obj.addEventListener(type,fn);
        }else if(obj.attachEvent){
            obj.attachEvent("on"+type,fn);
        }else{
            obj["on"+type]=fn;
        }
    }
    //判断obj元素是否为pare元素的子孙元素
    //true 是   false不是
    function isExist(obj,pare){
        if(!obj){
            return false;
        }
        return obj===pare? true :isExist(obj.parentElement,pare);
    }
    //创建新的一行
    function newRow(num){
        var tr=document.createElement('tr');
        for(var i=0;i<num;i++){
            var td=document.createElement("td");
            tr.appendChild(td);
        }
        return tr;
    }
    //格式化时间
    function formatDate(date,pattern){
        var paramDate = date
        var hours = chang(paramDate.getHours());
        var minutes = chang(paramDate.getMinutes());
        var seconds = chang(paramDate.getSeconds());
        var year = paramDate.getFullYear();
        var month = chang(paramDate.getMonth() + 1);
        var date = chang(paramDate.getDate());
        function chang (i){
            if(i < 10){
                i = "0" + i;
            }
            return i;
        }
        return pattern.replace("yyyy",year).replace("MM",month).replace("dd",date).replace("HH",hours).replace("mm",minutes).replace("ss",seconds);
    }
    //设置样式
    function setClass(doms,className){
        for(var i in doms){
            doms[i].className=className;
        }
    }

    window.Calender=Calender;
})();
