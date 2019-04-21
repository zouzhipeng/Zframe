
/****
 * 保存缓存：C('缓存名',缓存值,缓存时间)，缓存名必须按驼峰命名规则（页面名+文件名+方法名）避免重名，缓存时间可选
 * 读取缓存: C('缓存名',function(){})，functon为可选，如果缓存名读不到缓存或过期，则会调用function重新设置并返回，注意该functon内的同步异步问题
 *  */
var ZC = function(k, v, t){
    k='ZC_f_'+k;
    this.active_time = 300000;
    var now_tme = new Date().getTime();
    if(t === -1) t = 999999999999;
    t || (t = this.active_time);
    if (!v || typeof (v) == "function") {//读取缓存
        var cache = localStorage[k]?JSON.parse(localStorage[k]):0;
        if (cache && cache.expire_time >= now_tme) {
            return cache.value;
        }
        else {
            if (typeof (v) == "function") {
                var value = v();
                if (value) {
                    return this.ZC(k, value) ? value : false;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }
    else {//设置缓存
        var cache = {
            "expire_time": now_tme + t,//缓存过期时间
            "value": v,
        };
        try {
            localStorage[k] = JSON.stringify(cache);
            return true;
        } catch (e) {
            return false;
        }
    }
};
ZC.clear = function(k) {
    if(k){
        k='ZC_'+k;
        localStorage.removeItem(k);
    }
    else{
        localStorage.clear();
    }
};
