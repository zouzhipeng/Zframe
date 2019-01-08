// 验证是否空
String.prototype.isEmptyString = function() {
    return this == "" || this.match(/^\s+$/);
};

String.prototype.format = function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(m,i,o,n){
        return args[i];
    });
};

// 验证是否日期
String.prototype.isValidDate = function() {
    return this
        .match(/^[1-2]\d{3}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])$/);
};

// 验证是否email,价格,电话
String.prototype.isValidEmailAddress = function() {
    return this
        .match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([0-9a-zA-Z]+.){1,2}(com|net|cn|com.cn)$/);
};

String.prototype.isValidPrice = function() {
    return this
        .match(/^[0-9]*(\.[0-9]{1,2})?$/);
};

String.prototype.isTel = function() {
    return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this
        .trim()));
};

String.prototype.isPhone = function() {

    return (/^0?1[3|4|5|7|8][0-9]\d{8}$/.test(this
        .trim()));
};

//验证身份证
String.prototype.isCardNo = function()
{
    return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this
        .trim()));
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X

};
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.LTrim = function()
{
    return this.replace(/(^\s*)/g, "");
};
String.prototype.RTrim = function()
{
    return this.replace(/(\s*$)/g, "");
};

//转2位小数货币
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}


/*打开手机上的地图app*/
function callLocalMap(lon,lat,name,address){
    function ditu(){
        wx.openLocation({
            latitude: lat, // 纬度，浮点数，范围为90 ~ -90
            longitude: lon, // 经度，浮点数，范围为180 ~ -180。
            name:name|| '', // 位置名
            address:address|| '', // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        //微信
        wx.ready(function () {
            ditu();
        });
    } else {
        if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            //ios
            //高德IOS
            setTimeout( function(e){ window.location.href ="iosamap://viewMap?sourceApplication=applicationName&poiname="+name+"&lat="+lat+"&lon="+lon+"&dev=1"; },200);
            //百度IOS
            setTimeout( function(e){ window.location.href ="baidumap://map/marker?location="+lat+","+lon+"&title="+address+"&content="+name+"&src=yourCompanyName|yourAppName";},400);
        }else{
            //安卓
            //高德安卓
            setTimeout( function(e){ window.location.href ="androidamap://viewMap?sourceApplication=appname&poiname="+name+"&lat="+lat+"&lon="+lon+"&dev=0"; },200);
            //百度安卓
            setTimeout( function(e){ window.location.href ="bdapp://map/marker?location="+lat+","+lon+"&title="+name+"&content="+address+"&traffic=on"; },400);
            //安卓默认
            setTimeout( function(e){ window.location.href ="geo:"+lon+","+lat;},600);
        }
    }
}
function isObject(o){
    return Object.prototype.toString.call(o) === '[object Object]';
}
function isArray(a) {
    return Object.prototype.toString.call(a)=== '[object Array]';
}
function isFunction(o){
    return Object.prototype.toString.call(o) === '[object Function]';
}
function isString(value) {return typeof value === 'string';}

function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
}
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

String.prototype.timeformat = function(format)
{
    if(!this || this == '0') return '无';
    return (new Date(parseInt(this) * 1000)).format(format);
};
Number.prototype.timeformat = function(format)
{
    if(!this || this == 0) return '无';
    return (new Date(this * 1000)).format(format);
};

function escapeChars(str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&acute;/g, "'");
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&brvbar;/g, '|');
    return str;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    //if (r!= null) return unescape(r[2]); return null;
    if (r!= null) return decodeURI(r[2]); return null;

}
function getHashString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.hash.substr(1).match(reg);
    //if (r!= null) return unescape(r[2]); return null;
    if (r!= null) return decodeURI(r[2]); return null;

}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split(/[\&\?]/);
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


function GetHash() {
    var url = location.hash; //获取url中"?"符后的字串
    var theHash = new Object();
    if (url.indexOf("#") != -1) {
        var str = url.substr(1);
        strs = str.split(/[\&\?]/);
        for(var i = 0; i < strs.length; i ++) {
            theHash[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theHash;
}
function showBigImg(id){
    var urls=[];
    $(id).parents('[data-type="gallery"]').find('img').each(function(index,ele){
        urls.push($(this).data('src')||$(this).attr('src'));
    });
    if (typeof window.WeixinJSBridge != 'undefined') {
        WeixinJSBridge.invoke('imagePreview', {
            "urls":urls,
            "current":$(id).data('src')||$(this).attr('src')
        });
    }else{
        alert( "请在微信中查看", null, function () {});
    }
}
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split('.')[1].length}catch(e){r1=0};
    try{r2=arg2.toString().split('.')[1].length}catch(e){r2=0};
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}
function Subtr(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split('.')[1].length}catch(e){r1=0};
    try{r2=arg2.toString().split('.')[1].length}catch(e){r2=0};
    m=Math.pow(10,Math.max(r1,r2));
//动态控制精度长度
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split('.')[1].length}catch(e){};
    try{m+=s2.split('.')[1].length}catch(e){};
    return Number(s1.replace(','))*Number(s2.replace(','))/Math.pow(10,m);
}
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split('.')[1].length}catch(e){};
    try{t2=arg2.toString().split('.')[1].length}catch(e){};
    with(Math){
        r1=Number(arg1.toString('.').replace(','));
        r2=Number(arg2.toString('.').replace(','));
        return (r1/r2)*pow(10,t2-t1);
    }
}

function is_pc() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//判断是否是微信浏览器的函数
function is_weixn(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

//处理请求
function Zrequest(param, success, error){
    var type=1;
    var loding_id;
    if(arguments[3]){
        type=arguments[3];
    }
    if(arguments[2]!=undefined){
        if(!isFunction(arguments[2])){
            type=error;
            error=null;
        }
    }
    if(type){
        //layer.load(3,{time: 3000});
        //Toast.showLoading();
        loding_id = Ztoast.loding();
    }
    if(!param.data)param.data={};
    //if(window.user_token)param.data.user_token = window.user_token;
    param.data.user_token = ZC('user_token');
    $.ajax({
        type : param.type||'POST',
        url : app_config.domain + param.url,
        data:param.data||{},
        dataType : param.dataType||"json",
        success : function(data) {
            cb(data);
        }

    });
    function cb(data){
        if(type){
            //layer.closeAll('loading');
            //Toast.closeLoading();
        	Ztoast.close(loding_id);
        }
        if (data.err > 0) {
            if(data.err==233){
                ZC.clear('user_info');
                ZC.clear('user_token');
                load_login();
            }
            if(error){
                error(data);
            }else{
            	Ztoast.msg(data.msg);
                //layer.msg(data.msg);
                //Toast.showMsg(data.msg);
            }
        }else{
            if(success) success(data);
        }
    }
}

// 禁用IOS双指缩放和双击缩放, 安卓则不需要下面这个段代码
   
   (function() {
            var agent = navigator.userAgent.toLowerCase();        //检测是否是ios

            if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
                
                // 禁用双指缩放
                document.documentElement.addEventListener('touchstart', function (event) {
                    if (event.touches.length > 1) {
                        event.preventDefault();
                    }
                }, false);
                
                // 禁用双击缩放
                var lastTouchEnd=0;  
                document.addEventListener('touchend',function (event) {  
                    var now=(new Date()).getTime();  
                    if(now-lastTouchEnd<=300){  
                        event.preventDefault();  
                    }  
                    lastTouchEnd=now;  
                },false)  
            } 
   })()