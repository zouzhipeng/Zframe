


// Router 类，用来控制页面根据当前 URL 切换
const load_pages = {}
const app_config = {}

class Zpage{
    constructor(page_data){
        //初始绑定数据
        this.data = Object.assign({},this.data||{},page_data.data||{});
        for(var i in page_data){
            this[i] = page_data[i];
        }
        if(!this.src)this.src = {};
        if(!this.src.js)this.src.js = [];
        if(!this.src.css)this.src.css = [];
        this.page_id = 0;
        this.guid = newGuid();
        this.parent = page_data.container||'';
        this.container = document.createElement("div");
        this.container.id = this.guid;
        this.scrollTop = 0;
        this.on_load = page_data.on_load||false;
        this.param =  page_data.param||'';
        this.hash =  page_data.hash||'';
        this.is_init = false;
        this.$M = false;

        //模板内容填充
        this.container.innerHTML = this.template;

        //滚动条事件
        this.scroll_elem = this.container;
        (!page_data.scroll_elem)&&(page_data.scroll_elem = app_config.scroll_elem);//app_config设置全局滚动元素
        if(isString(page_data.scroll_elem)){
            this.scroll_elem = this.container.querySelectorAll(page_data.scroll_elem)[0];
        }

        if(!isFunction(this.on_reachbottom))this.on_reachbottom = false;
        this.is_bottom = false;
        this.scroll_elem&&this.scroll_elem.addEventListener('scroll', function(e){
            if(e.target != this) return;
            //如果产生ajax请求有可能改变scrollTop，这里需要恢复
            if(_this.on_scroll)_this.on_scroll(this.scrollTop);
            if(_this.is_bottom){
                _this.is_bottom = false;
                if(this.scrollTop>_this.scrollTop){
                    setTimeout(function(){this.scrollTop = _this.scrollTop;}.bind(this),0);
                }
            }
            else{
                _this.scrollTop = this.scrollTop;
                //触底
                if (this.scrollTop >= this.scrollHeight - this.offsetHeight) {
                    _this.is_bottom = true;
                    if(_this.on_reachbottom)_this.on_reachbottom(this.scrollTop);
                }
            }
        },true);

        //下拉加载更多事件
        if(this.onPullRefresh){
            var touchStart = 0;
            var init_m_top = 0;
            var m_top = 0;
            this.scroll_elem.addEventListener('touchstart', function(event) {
                var touch = event.targetTouches[0];
                // 把元素放在手指所在的位置
                touchStart = touch.pageY;
                init_m_top = _this.scroll_elem.style.marginTop?parseInt(_this.scroll_elem.style.marginTop):0;
                console.log(touchStart);
            }, false);

            this.scroll_elem.addEventListener('touchmove', function(event) {
                if(this.scrollTop == 0){
                    var touch = event.targetTouches[0];
                    console.log(touch.pageY + 'px');
                    m_top = (touch.pageY-touchStart)/3;
                    m_top>100&&(m_top=100);
                    if(m_top>0){
                        _this.scroll_elem.style.marginTop = init_m_top + m_top + 'px';
                        console.log(m_top);
                    }
                }
            }, false);

            this.scroll_elem.addEventListener('touchend', function(event) {
                touchStart = 0;
                _this.scroll_elem.style.marginTop = init_m_top+'px';
                if(m_top>90)_this.onPullRefresh();
                m_top = 0;
            }, false);
        }
    }
    //初始化
    init(p,h){
        //处理事件绑定
        var on_init = this.on_init?this.on_init(p,h):null;
        if(on_init === false)return false;

        //出力事件绑定
        this.bind_event();
        //模板数据绑定
        this.$M = Ztempl(this.container,this.data);

        Object.defineProperty(this, 'scrollTop', {
            set:function(newVal){
                _this.scroll_elem.scrollTop = newVal;
            }
        });

        Object.defineProperty(this, 'page_title', {
            set:function(newVal){
                document.title = newVal;
            },
            get:function(){
                return this.title;
            }
        })
    }

    //渐入动画
    animationend(){
        _this.container.classList.remove("fadeIn"+_this.swipe_page);
        _this.container.removeEventListener('animationend', _this.animationend);
        if(!_this.is_init){
            _this.is_init = true;
            _this.on_load&&_this.on_load(_this.param||{},_this.hash||{});
        }
    }

    //显示
    show(param,hash){
        if(param)this.param = param
        if(hash)this.hash = hash;

        if(this.swipe_page){
            this.container.classList.add("fadeIn"+this.swipe_page);
            this.container.addEventListener('animationend', this.animationend, false);
        }

        //判断是否需要初始化
        if(!this.is_init){
            if(this.init(this.param||{},this.hash||{}) === false)return false;
            if(this.style)this.container.style = this.style;
            Ztempl.append(this.container,this.parent);
            if(!this.swipe_page){
                this.is_init = true;
                this.on_load&&this.on_load(this.param||{},this.hash||{});
            }
        }
        else{
            Ztempl.append(this.container,this.parent);
        }

        //滚动条恢复
        this.scroll_elem.scrollTop = this.scrollTop;
        this.on_show&&this.on_show(this.param||{},this.hash||{});
        //处理页面title
        this.page_title = this.title;
    }
    //动态绑定事件
    on(){
        var arg = arguments;
        var _this = this;
        this.container.addEventListener(arguments[0], function(e){
            var t = _this.container.querySelectorAll(arg[1]);
            var epath = e.path || (e.composedPath && e.composedPath());
            for(var i = 0;i<t.length;i++){
                var index = epath.indexOf(t[i]);
                if(~index){
                    e.preventDefault();
                    arg[2]&&arg[2].call(epath[index],e,epath[index].dataset);
                }
            }
            return false;
        },true)
    }
    //查找元素
    $(str){
        var res = _this.container.querySelectorAll(str);
        return res.length === 1?res[0]:res;
    }
    //元素绑定事件
    bind_event(){
        var _this = this;
        var list = this.container.querySelectorAll("[Zevent]");
        for(var i=0; i<list.length;i++){
            var p = list[i].getAttribute('Zevent');
            p = p.split('|');
            if(p.length>1){
                list[i].addEventListener(p[0], function(){
                    var fn = p[1];
                    return function(e){
                        _this[fn](e,this.dataset,this);
                    }
                }(),true)
            }
        }
    }
}

class Zframe {
  init(content_id,_app_config,default_path){
    let _this = this;
    if(_app_config) app_config = _app_config;

    //设置父元素
    if(app_config.version)this.version = app_config.version;
    this.content_id = content_id;
    this.content_obj = document.getElementById(content_id);

    //处理点击后的监听
    _this.click_range_dom = app_config.click_range_dom_id?document.getElementById(app_config.click_range_dom_id):this.content_obj
    _this.click_range_dom.addEventListener('click', function(e){
        var href = false;
        var epath = e.path || (e.composedPath && e.composedPath());
        for(var i = 0;i<epath.length-2;i++){
            href = epath[i].getAttribute("href");
            if(href)break;
        }
        if(!href || href.substr(0,1) == '#' || href.substr(0,11)=="javascript:"){
            return;
        }
        //补上开头的/
        if(href.substr(0,1) != '/') href = '/'+href;
        //http开头的直接跳转
        if(href.substr(0,4) == 'http'){
            //location.href = href;
            return;
        }
        e.preventDefault();
        param = href.split(/[\?]/);
        href = param[0];
        var param = param.length>1?param[1]:'';
        var hash = '';
        if(param){
            hash = param.split(/[\#]/);
            param=strtoobj(hash[0]);
            hash=hash.length>1?strtoobj(hash[1]):{};
        }
        var page_name = href.replace(/\.htm[l]?/,'');
        
        if(!page_name) return;
        _this.go(page_name,param,hash);
    });




    // 点击浏览器后退 / 前进按钮时会触发 window.onpopstate 事件，我们在这时切换到相应页面
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    window.addEventListener('popstate', () => {
      this.load(location.pathname)
    })
    

    // 打开页面时加载当前页面
    this.load(default_path||location.pathname)
    return this
  }

  // 前往 path，变更地址栏 URL，并加载相应页面
  go(path,p,h) {
    // 变更地址栏 URL
    history.pushState({}, '', path)
    // 加载页面
    this.load(path)
  }

  // 加载 path 路径的页面
  load(path) {
    // 首页
    if (path === '/') path = '/index'
    if(!load_pages[path])load_pages[path] = this.create(path)

    // 创建页面实例
    let page = load_pages[path];
    //设置父元素
    page['container'] = this.content_obj

    var this_page = new Zpage(page)
    this_page.show()
    console.log("Load:",path);
  }

  create(path) {
      var _path = './page'+path
      var page = require(_path+'')
      return page.default
  }
}

  
function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
        var n = Math.floor(Math.random()*16.0).toString(16);
        guid +=   n;
        if((i==8)||(i==12)||(i==16)||(i==20))
            guid += "-";
    }
    return guid;
}
function isFunction(o){
    return Object.prototype.toString.call(o) === '[object Function]';
}
function isString(value) {
    return typeof value === 'string';
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

  // 导出 router 实例
  export default new Zframe();