
var Zpage,Zframe;
Zpage = function (page_data){
    var _this = this;
    page_data.data&&(page_data.data =  Object.assign({},this.data||{},page_data.data||{}));
    for(var i in page_data){
        this[i] = page_data[i];
    }
    if(!this.src)this.src = {};
    if(!this.src.js)this.src.js = [];
    if(!this.src.css)this.src.css = [];
    this.page_id = 0;
    this.guid = newGuid();
    //this.page_title = page_data.title||'';
    this.parent = page_data.container||'';
    this.container = document.createElement("div");
    this.container.id = this.guid;
    //this.template = page_data.template||'';
    this.scrollTop = 0;
    this.on_load = page_data.on_load||false;
    //this.html = '';
    this.param =  page_data.param||'';
    this.hash =  page_data.hash||'';
    this.is_init = false;
    this.src_load = false;
    this.$M = false;


    //!this.template&&(this.template = $(this.parent).children());
    //this.template = $(this.parent).children()
    //isString(this.template)?this.container.innerHTML = this.template:$(this.container).append(this.template);
    //$(this.container).append(this.template)
    this.container.innerHTML = this.template;
    //$(this.parent).append(this.container);

    //滚动条事件
    this.scroll_elem = this.container;
    (!page_data.scroll_elem)&&(page_data.scroll_elem = app_config.scroll_elem);//app_config设置全局滚动元素
    if(page_data.scroll_elem) this.scroll_elem = this.container.querySelectorAll(page_data.scroll_elem)[0];
    this.on_reachbottom = page_data.on_reachbottom||false;
    this.is_bottom = false;
    this.scroll_elem.addEventListener('scroll', function(e){
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
    this.init = function(p,h){

        //出力事件绑定
        var on_init = this.on_init?this.on_init(p,h):null;
        if(on_init === false)return false;

        //出力事件绑定
        this.bind_event();
        //模板数据绑定
        this.$M = Ztempl(this.container,this.data);


        Object.defineProperty(_this, 'scrollTop', {
            set:function(newVal){
                _this.scroll_elem.scrollTop = newVal;
            }
        });

        Object.defineProperty(_this, 'page_title', {
            set:function(newVal){
                document.title = newVal;
            },
            get:function(){
                return this.title;
            }
        });
    };
    //渐入动画
    this.animationend = function(){
        _this.container.classList.remove("fadeIn"+_this.swipe_page);
        _this.container.removeEventListener('animationend', _this.animationend);
        if(!_this.is_init){
            _this.is_init = true;
            _this.on_load&&_this.on_load(_this.param||{},_this.hash||{});
        }
    };
    this.show = function(param,hash){
        if(!this.src_load) return;
        if(param)this.param = param;
        if(hash)this.hash = hash;

        if(this.swipe_page){
            this.container.classList.add("fadeIn"+this.swipe_page);
            this.container.addEventListener('animationend', this.animationend, false);
        }

        if(!this.is_init){
            if(this.init(this.param||{},this.hash||{}) === false)return false;
            if(this.style)this.container.style = this.style;
            //this.p_show();
            //$(this.parent).show();
            Ztempl.append(this.container,this.parent);
            if(!this.swipe_page){
                this.is_init = true;
                this.on_load&&this.on_load(this.param||{},this.hash||{});
            }
        }
        else{
            //$(this.parent).show();
            //$(this.html).wrap(this.parent);
            //this.parent.innerHTML = "";
            Ztempl.append(this.container,this.parent);
            //$(this.parent).empty().append(this.html);
        }

        //滚动条恢复
        this.scroll_elem.scrollTop = this.scrollTop;
        this.on_show&&this.on_show(this.param||{},this.hash||{});
        //处理页面title
        this.page_title = this.title;

        //Ztempl.append(this.container,this.parent);
    }.bind(this);

    this.close = function(){
    };
    this.p_show = function(){
        // if(this.parent.style.display == 'none'){
        //
        // }
        this.parent.style.display=''
    };
    this.on = function(){
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
            /*var t = _this.container.querySelectorAll(arg[1]);
            return function(e){
                e.preventDefault();
                for(var i = 0;i<t.length;i++){
                    if(t[i] == e.target){
                        arg[2]&&arg[2].call(e.target,e);
                    }
                }
                return false;
            }*/
        },true)
        //$(this.container).on(arguments[0]||false,arguments[1]||false,arguments[2]||false);
    };
    this.$ = function(str){
        var res = _this.container.querySelectorAll(str);
        return res.length === 1?res[0]:res;
    };
    this.bind_event = function(){
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
};
Zframe = {
    page_list:{},
    pagePath_list:[],
    page_count:0,
    template_list:{},
    code_list:{},
    //request_list:{},
    this_page:false,
    load_list:[],
    version:2.1,
    swipe_page:'',
    init:function(content_id,config){
        console.log(__dirname,__filename);

        if(this.content_id == content_id) return;
        for(var i in config){
            this[i] = config[i];
        }
        if(app_config.version)this.version = app_config.version;
        this.content_id = content_id;
        this.content_obj = document.getElementById(content_id);
        //设置容器position
        this.content_obj.style.position = 'relative';

        var _this = this;
        _this.page_count = 0;
        _this.click_range_dom = app_config.click_range_dom_id?document.getElementById(app_config.click_range_dom_id):this.content_obj

        //document.getElementsByTagName('body')[0].addEventListener('click', function(e){
        _this.click_range_dom.addEventListener('click', function(e){
            //$('body').on('click','a',function(e){
            //    var href= $(this).attr('href')
            var href = false;
            var epath = e.path || (e.composedPath && e.composedPath());
            for(var i = 0;i<epath.length-2;i++){
                href = epath[i].getAttribute("href");
                if(href)break;
            }
            if(!href || href.substr(0,1) == '#' || href.substr(0,11)=="javascript:"){
                return;
            }
            if(href.substr(0,1) == '/') href = href.substr(1);
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
            _this.to(page_name,param,hash);
        });

        //处理当前页后退问题
        Zback.back({},function(){setTimeout(function(){location.reload()},100);},1);
        return this;
    },
    use:function(name,page){
        //记录加载页面code
        if(!this.code_list[name])this.code_list[name] = page;

        !page['template']&&(page['template'] = this.template_list[name]);
        !page['swipe_page']&&(page['swipe_page'] = this.swipe_page);
        page['container'] = this.content_obj;
        var this_page = new Zpage(page);
        this_page.page_path = name;
        this.page_list[this_page.guid] = this_page;
        this.this_page = this_page.guid;
        this.page_count++;

        /*if(this.page_list[name]){
            //Ztempl.refresh(this.page_list[name], page,1);
            //this.page_list[name].show();
            return;
        }
        if(!this.page_list[name]){
            page['template'] = this.template_list[name];
            page['container'] = this.content_obj;
            this.page_list[name] = new Zpage(page);
        }*/
        this_page.src_count = 0;
        if(this_page.src){
            this_page.src.js && (this_page.src_count += this_page.src.js.length);
            this_page.src.css && (this_page.src_count += this_page.src.css.length);
        }
        this_page.load_src_count = 0;

        this.target_page = this_page;
        if(this_page.src_count == 0){
            this.do_load(this_page);
        }
        else{
            for(var srckey in this_page.src){
                for(var key in this_page.src[srckey]){
                    var filename = this_page.src[srckey][key].replace("{{domain}}",app_config.domain);
                    this.loadjscssfile(filename,srckey,this_page);
                    /*if(this.load_list.indexOf(filename)<0){
                        this.loadjscssfile(filename,srckey,this_page);
                    }
                    else{
                        this.do_load(this_page);
                    }*/
                }
            }
        }
        //favicon图标添加
        if(this_page.favicon_src){
            this.loadjscssfile(this_page.favicon_src,'favicon_ico',this_page);
        }
        //this.page_list[name].show();
    },
    loadjscssfile:function(filename,filetype,page){
        var _this = this;
        var and_str = filename.indexOf("?")>0?"&":"?";
        var full_filename = filename + and_str +"v=" + this.version;

        if(filetype == "js"){
            var fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src",full_filename);
        }else if(filetype == "css"){
            var fileref = document.createElement('link');
            fileref.setAttribute("rel","stylesheet");
            fileref.setAttribute("type","text/css");
            fileref.setAttribute("href",full_filename);
        }else if(filetype == "favicon_ico"){
            var fileref = document.createElement('link');
            fileref.setAttribute("rel","shortcut icon");
            fileref.setAttribute("type","image/x-icon");
            fileref.setAttribute("href",full_filename);
            _this.loadjscssfile(full_filename,'favicon_ico_');
        }else if(filetype == "favicon_ico_"){
            var fileref = document.createElement('link');
            fileref.setAttribute("rel","icon");
            fileref.setAttribute("type","image/x-icon");
            fileref.setAttribute("href",full_filename);
        }

        if (fileref.readyState){ //IE
            fileref.onreadystatechange = function(){
                //console.log(fileref.readyState);
                if (fileref.readyState == "loaded" || fileref.readyState == "complete"){
                    fileref.onreadystatechange = null;
                    page&&_this.do_load(page);
                    _this.load_list.push(filename);
                }
            };
        } else { //Others: Firefox, Safari, Chrome, and Opera
            fileref.onload = function(){
                page&&_this.do_load(page);
                _this.load_list.push(filename);
            };
            fileref.onerror = function(){
                page&&_this.do_load(page);
                _this.load_list.push(filename);
            };
        }
        if(typeof fileref != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },
    //移动已经加载过的js/css
    removejscssfile:function(filename,filetype){
        var targetelement=(filetype=="js")? "script" :(filetype=="css")? "link" : "none";
        var targetattr=(filetype=="js")?"src" : (filetype=="css")? "href" :"none";
        var allsuspects=document.getElementsByTagName(targetelement);
        for (var i=allsuspects.length; i>=0;i--){
            if (allsuspects[i] &&allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
                allsuspects[i].parentNode.removeChild(allsuspects[i])
                break;
            }
        }
    },
    do_load:function(page){
        page.load_src_count++;
        if(page.load_src_count >= page.src_count){
            page.src_load = true;
            this.target_page = page;
            page.show(this.this_page_param,this.this_page_hash);
        }
    },
    to:function(page_name,param,hash,pass_back){
        if(page_name.substr(0,1) == '/') page_name = page_name.substr(1);
        //如果跳转和当前页相同不处理
        //if(this.this_page === page_name) return;

        //保存上一个页面html
        if(this.this_page && !pass_back){
            this.pagePath_list.push(this.this_page);
            //this.page_list[this.this_page].html = this.content_obj.children;
            //$(this.page_list[this.this_page].html).find('script').remove();//移除脚本
        }

        //更新地址栏
        hash||(hash={});
        hash['pagePath'] = page_name;
        var back_param = {
            url:'?'+objtostr(param)+'#'+objtostr(hash),
        };
        //处理后退
        //if(this.this_page && this.this_page != page_name){
        Zback.back(back_param,function(){
            console.log(this.page_count);
            if(this.page_count>=2){
                this.back();
            }
            else{
                history.go(-2);
                setTimeout(function(){location.reload()},100);
            }
        }.bind(this),pass_back);
        //}

        //处理跳转
        this.this_page_param = param || {};
        this.this_page_hash = hash || {};
        if(!this.template_list[page_name]){
            this.ajax({
                url:page_name+'.html?v='+this.version,
                success:function(res){
                    this.this_page&&this.outpage();
                    //this.hide();
                    this.request_list[page_name] = res;
                    this.template_list[page_name] = this.clearScript(res);

                    //替换[[]]标签
                    this.template_list[page_name] = Ztempl.formateTemplate(this.template_list[page_name],Zframe.template_list)
                    this.executeScript(this.request_list[page_name]);
                    //$(this.content_obj).hide().html(res);
                }.bind(this)
            });
        }
            else{
                this.this_page&&this.outpage();
                //this.hide();
                this.executeScript(this.request_list[page_name]);
                //$(this.content_obj).hide().html(this.template_list[page_name]);
            }
        //this.hide();
        //this.executeScript(this.request_list[page_name]);
        //$(this.content_obj).hide().html(this.template_list[page_name]);
            
    },
    //关闭移除当前页
    outpage:function(page){
        var _this = this;
        var _this_page = _this.page_list[_this.this_page];
        if(!this.swipe_page){
            this.content_obj.innerHTML = '';
            renmove_css.call(_this);
        }
        else{
            var thispage = page||this.page_list[this.this_page].container;
            var animationend = function(){
                thispage.classList.remove("fadeOut"+_this.swipe_page);
                thispage.removeEventListener('animationend', animationend);
                _this.content_obj.removeChild(thispage);
                renmove_css.call(_this);
            };
            thispage.classList.add("fadeOut"+this.swipe_page);
            thispage.addEventListener('animationend', animationend, false);
        }

        //移除css和js
        function renmove_css(){
            var css_list = _this_page.src.css||[];
            for(var i = 0;i<css_list.length;i++){
                this.removejscssfile(css_list[i],'css');
                var css_index = this.load_list.indexOf(css_list[i]);
                if(~css_index){
                    this.load_list.splice(css_index,1);
                }
            }
        }
    },
    //页面返回
    back:function(p,h,fn){
        var _this = this;
        if(isFunction(p)||isString(p)){
            fn=p;
            p=false;
        }
        if(isFunction(h)||isString(h)){
            fn=h;
            h=false;
        }
        if(_this.page_count>1){
            _this.outpage(_this.page_list[_this.this_page].container);
            delete _this.page_list[_this.this_page];

            _this.this_page = _this.pagePath_list.pop();
            if(_this.this_page){
                var _page = _this.page_list[_this.this_page];
                _this.target_page = _page;

                //移除css和js
                var css_list = _this.page_list[_this.this_page].src.css||[];
                for(var i = 0;i<css_list.length;i++){
                    this.loadjscssfile(css_list[i],'css');
                }
                _page.show(p,h);
            }

            //更新地址栏
            (h)&&(h.pagePath = _page.page_path);
            Zback.back({
                url:'?'+objtostr(p||_page.param)+'#'+objtostr(h||_page.hash),
            },false,1);
            _this.page_count--;
        }
        //框架返回失败处理回调
        else{
            if(isFunction(fn))fn();
            if(isString(fn))Zframe.to(fn);
        }
    },
    /**
     * 地址栏加参数
     * @returns {string}
     */
    push_hash:function(key,value){
        var this_hash = GetHash();
        this_hash[key] = value;
        location.hash = objtostr(this_hash);
    },
    /**
     * 执行js
     * @param html
     */
    executeScript:function(html){
        var reg = /<script[^>]*>([^\x00]+)$/i;
        //对整段HTML片段按<\/script>拆分
        var htmlBlock = html.split("<\/script>");
        for (var i in htmlBlock)
        {
            var blocks;//匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
            if (blocks = htmlBlock[i].match(reg))
            {
                //清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作
                var code = blocks[1].replace(/<!--/, '');
                try
                {
                    eval(code) //执行脚本
                }
                catch (e)
                {
                    console.log('err:',e.message)
                    console.log(code)
                }
            }
        }
        return this;
    },
    /**
     * 清空js并返回html
     * @param html
     */
    clearScript:function (html) {
        var preg = /<script[\s\S]*?<\/script>/i; //里面的?表示尽可能少重复，也就是匹配最近的一个</script>。匹配的规则不能用 "/<script.*<\/script>/i",因为它不能匹配到换行符,但"/<script.*<\/script>/im"可以多行匹配.;或者用"/<[^>].*?>.*?<\/.*?>/si" 再简化 "/<[^>].*?<\/.*?>/si"
        var new_html = html.replace(preg,"");    //第四个参数中的3表示替换3次，默认是-1，替换全部
        return new_html;
    },
    hide:function(){
        this.content_obj.dataset.olddisplay = this.content_obj.style.display;
        this.content_obj.style.display = 'none';
    },
    /**
     * ajax请求
     */
    ajax:function(){
        var ajaxData = {
            type:"GET",
            url:"",
            async:"true",
            data:null,
            dataType:"text",
            processData:true,
            contentType:"application/x-www-form-urlencoded",
            beforeSend:function(){},
            success:function(){},
            error:function(){}
        };
        ajaxData = Object.assign(ajaxData, arguments[0]||{});
        ajaxData.beforeSend();
        var xhr = createxmlHttpRequest();
        xhr.responseType=ajaxData.dataType;
        xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
        if(ajaxData.contentType)xhr.setRequestHeader("Content-Type",ajaxData.contentType);
        if(ajaxData.type == "GET"){
            xhr.send(convertData(ajaxData.data));
        }else{
            xhr.send(ajaxData.data);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    ajaxData.success(xhr.response)
                }else{
                    ajaxData.error()
                }
            }
        }
        function createxmlHttpRequest() {
            if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        }
        function convertData(data){
            if( typeof data === 'object' ){
                var convertResult = "" ;
                for(var c in data){
                    convertResult+= c + "=" + data[c] + "&";
                }
                convertResult=convertResult.substring(0,convertResult.length-1)
                return convertResult;
            }else{
                return data;
            }
        }
    },
    //预载入模板
    load_template:function(src_list,fn){
        var _this = this;
        var keys = Object.keys(src_list);
        var count = keys.length;
        var load_count = 0;
        for(var i = 0;i<count;i++){
            if(!this.template_list[keys[i]]){
                var url = src_list[keys[i]];
                this.ajax({
                    url:url,
                    success:function(){
                        var key = keys[i];
                        return function(res){
                            _this.template_list[key] = res;
                            load_count++;
                            if(load_count>=count&&fn)fn();
                        }
                    }(),
                });
            }
            else{
                load_count++;
            }
        }
    }
};

//--------------Zback------------
var Zback = {
    bacn_fn_list:[],
    is_init:false,
    back:function(param,fn,pass_back){
        if(!fn)fn = param;
        if(isFunction(fn))this.bacn_fn_list.push(fn);
        if(pass_back){
            history.replaceState(param.data||{}, param.title||document.title,param.url||'');
        }
        else{
            history.pushState(param.data||{}, param.title||document.title,param.url||'');
        }
        if(!this.is_init){
            this.init();
        }
    },
    init:function(){
        var _this  = this;
        _this.is_init = true;
        window.addEventListener("popstate", function(event) {
            if(history.state){
                var fn = _this.bacn_fn_list.pop();
                if(fn) fn();
            }
        });
    }
};
//字符串转对象
function strtoobj(str){
    if(!str) return {};
    var theRequest = new Object();
    var strs = str.split(/[\&\?]/);
    for(var i = 0; i < strs.length; i ++) {
        var temp_split = strs[i].split("=");
        theRequest[temp_split[0]]=unescape(temp_split[1]);
    }
    return theRequest;
}
//对象转字符串
function objtostr(obj){
    if(!obj)return '';
    var str = [];
    for(var k in obj){
        str.push(k+'='+obj[k]);
    }
    return str.join('&');
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

window.Zpage = Zpage;
window.Zframe = Zframe;
module.exports = Zframe;