//

(function(){

    function Calender(options){
        this._options=options;
        this._options.dom=document.getElementById(this._options.domID);
        this._init(this._options)
    }
    Calender.prototype={
        _init:function(options){
            var _self=this;
            var dom=options.dom;
            var div=html2node(template);
            _self._dateHtmlInit(div);//生成日期HTML
            _self._buttonInit(div);//按钮事件初始化
            _self._options.div=div;//存储弹窗
            addEvent(dom,"focus",function(){//显示事件
                console.dir(this);
                var x=pageX(this);
                var y=pageY(this)+this.offsetHeight;
                div.style.cssText='top:'+y+'px; left:'+x+'px;'
                document.body.appendChild(div);
            });
            addEvent(document,"click",function(e){//隐藏事件
                var target=e.target;
                 console.dir(e.target);
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
        _dateHtmlInit:function(div){
            var _self=this;
            var tbody=div.getElementsByTagName("tbody")[0];
            var now=new Date();
            var month=now.getMonth();
            var year=now.getFullYear();
            var days=(new Date(year,month,0)).getDate();//当月天数
            var lastMonthDays=new Date(year,month-1,0).getDate();//上个月天数
            var firstDay=new Date(year,month,1).getDay();//当月第一天的星期数
            var lastDay=new Date(year,month,days).getDay();//当月最后一天的星期数
            //第一行
            var _days=_self._addRow(firstDay,1,days,tbody);
            while(_days<=days){
                _days=_self._addRow(0,_days,days,tbody);
            }

        },
        //添加行  开始星期数(从0开始) 开始日期数 最大日期数
        _addRow:function(startDay,day,maxDate,dom){
            var tr=newRow();
            var tds=tr.getElementsByTagName("td");
            for(var i=startDay;i<7;i++){
                if(day>maxDate){
                    break;
                }
                tds[i].innerText=day;
                day++;
            }
            dom.appendChild(tr);
            return day;
        },
        _buttonInit:function (dom) {
            var _self=this;

            var todayBtn=dom.getElementsByClassName("todayBtn")[0];
            var cancelBtn=dom.getElementsByClassName("cancelBtn")[0];
            todayBtn.onclick=function(){

            }
            cancelBtn.onclick=function(){
                _self.hide();
            }



        }




    }
    //获取元素到左侧的距离
    function pageX(elem) {
      return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
    }
    //获取元素到顶部的距离
    function pageY(elem) {
      return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
    }
    var template='<div class="module-calender"> \
        <div class="header">\
            <select class="" name="">\
                <option value="2016">2016</option>\
            </select>年<select class="" name="">\
                <option value="1">1</option>\
            </select>月</div>\
        <table class="container">\
        <thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead>\
        <tbody></tbody>\
        <tfoot><tr><td colspan="7"><button>确定</button><button class="todayBtn">今天</button><button class="cancelBtn">取消</button></td></tr></tfoot>\
        </table>\
    </div>\
    ';
 //     var template=
 // '<div class="modal" style="display: block"></div>';
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
    function newRow(){
        var tr=document.createElement('tr');
        for(var i=0;i<7;i++){
            var td=document.createElement("td");
            tr.appendChild(td);
        }
        return tr;
    }


    window.Calender=Calender;
})();
