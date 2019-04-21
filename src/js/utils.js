
////--------------公共函数-------------------
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
    if(!format)format = "";
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
//防抖
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


function timetostr(time){
    return time?(new Date(~~time*1000)).format('yyyy-MM-dd'):"";
}

//处理请求
function Zrequest(param, success, error){
    var type=1;
    var loding_id;
    if(arguments[3]!=undefined){
        type=arguments[3];
    }
    if(arguments[2]!=undefined){
        if(!isFunction(arguments[2])){
            type=error;
            error=null;
        }
    }
    if(type){
        layer.load(3,{time: 3000});
        //Toast.showLoading();
        //loding_id = Ztoast.loding();
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
            layer.closeAll('loading');
            //Toast.closeLoading();
        	//Ztoast.close(loding_id);
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
            	//Ztoast.msg(data.msg);
                layer.msg(data.msg);
                //Toast.showMsg(data.msg);
            }
        }else{
            if(success) success(data);
        }
    }
}

module.exports = {
    toDecimal2:toDecimal2,
    isObject:isObject,
    isArray:isArray,
    isFunction:isFunction,
    isString:isString,
    getLength:getLength,
    escapeChars:escapeChars,
    getQueryString:getQueryString,
    getHashString:getHashString,
    GetRequest:GetRequest,
    GetHash:GetHash,
    debounce:debounce,
    is_pc:is_pc,
    is_weixn:is_weixn,
    timetostr:timetostr,
    Zrequest:Zrequest
};
