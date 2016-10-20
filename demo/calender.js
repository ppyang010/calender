//

(function(){

    function Calender(options){
        this._options=options;
        this._options.dom=document.getElementById(this._options.domID);
        this._init(this._options)
    }
    Calender.prototype={
        _init:function(options){
            var dom=options.dom;
            var div=html2node(template);
            div.className="module-calender";

            addEvent(dom,"focus",function(){
                console.dir(this);
                var x=this.offsetTop
                document.body.appendChild(div);
            });
            // addEvent(dom,"blur",function(){
            //     document.body.removeChild(div);
            // });
        }

    }
    function pageX(elem) {
      return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
    }

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
        <table class="body">\
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

    window.Calender=Calender;
})();
