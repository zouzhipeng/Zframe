var Zframe_dll_4f4b4a4f13ac86692e61=function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){t.exports=i},function(module,exports){(function(__dirname,__filename){var Zpage,Zframe;Zpage=function(t){var e=this;for(var i in t.data&&(t.data=Object.assign({},this.data||{},t.data||{})),t)this[i]=t[i];if(this.src||(this.src={}),this.src.js||(this.src.js=[]),this.src.css||(this.src.css=[]),this.page_id=0,this.guid=newGuid(),this.parent=t.container||"",this.container=document.createElement("div"),this.container.id=this.guid,this.scrollTop=0,this.on_load=t.on_load||!1,this.param=t.param||"",this.hash=t.hash||"",this.is_init=!1,this.src_load=!1,this.$M=!1,
//!this.template&&(this.template = $(this.parent).children());
this.container.innerHTML=this.template,this.scroll_elem=this.container,!t.scroll_elem&&(t.scroll_elem=app_config.scroll_elem),t.scroll_elem&&(this.scroll_elem=this.container.querySelectorAll(t.scroll_elem)[0]),this.on_reachbottom=t.on_reachbottom||!1,this.is_bottom=!1,this.scroll_elem.addEventListener("scroll",function(t){t.target==this&&(e.on_scroll&&e.on_scroll(this.scrollTop),e.is_bottom?(e.is_bottom=!1,this.scrollTop>e.scrollTop&&setTimeout(function(){this.scrollTop=e.scrollTop}.bind(this),0)):(e.scrollTop=this.scrollTop,this.scrollTop>=this.scrollHeight-this.offsetHeight&&(e.is_bottom=!0,e.on_reachbottom&&e.on_reachbottom(this.scrollTop))))},!0),this.onPullRefresh){var s=0,n=0,o=0;this.scroll_elem.addEventListener("touchstart",function(t){var i=t.targetTouches[0];s=i.pageY,n=e.scroll_elem.style.marginTop?parseInt(e.scroll_elem.style.marginTop):0,console.log(s)},!1),this.scroll_elem.addEventListener("touchmove",function(t){if(0==this.scrollTop){var i=t.targetTouches[0];console.log(i.pageY+"px"),(o=(i.pageY-s)/3)>100&&(o=100),o>0&&(e.scroll_elem.style.marginTop=n+o+"px",console.log(o))}},!1),this.scroll_elem.addEventListener("touchend",function(t){s=0,e.scroll_elem.style.marginTop=n+"px",o>90&&e.onPullRefresh(),o=0},!1)}this.init=function(t,i){if(!1===(this.on_init?this.on_init(t,i):null))return!1;this.bind_event(),this.$M=Ztempl(this.container,this.data),Object.defineProperty(e,"scrollTop",{set:function(t){e.scroll_elem.scrollTop=t}}),Object.defineProperty(e,"page_title",{set:function(t){document.title=t},get:function(){return this.title}})},this.animationend=function(){e.container.classList.remove("fadeIn"+e.swipe_page),e.container.removeEventListener("animationend",e.animationend),e.is_init||(e.is_init=!0,e.on_load&&e.on_load(e.param||{},e.hash||{}))},this.show=function(t,e){if(this.src_load){if(t&&(this.param=t),e&&(this.hash=e),this.swipe_page&&(this.container.classList.add("fadeIn"+this.swipe_page),this.container.addEventListener("animationend",this.animationend,!1)),this.is_init)Ztempl.append(this.container,this.parent);else{if(!1===this.init(this.param||{},this.hash||{}))return!1;this.style&&(this.container.style=this.style),Ztempl.append(this.container,this.parent),this.swipe_page||(this.is_init=!0,this.on_load&&this.on_load(this.param||{},this.hash||{}))}this.scroll_elem.scrollTop=this.scrollTop,this.on_show&&this.on_show(this.param||{},this.hash||{}),this.page_title=this.title}}.bind(this),this.close=function(){},this.p_show=function(){this.parent.style.display=""},this.on=function(){var t=arguments,e=this;this.container.addEventListener(arguments[0],function(i){for(var s=e.container.querySelectorAll(t[1]),n=i.path||i.composedPath&&i.composedPath(),o=0;o<s.length;o++){var r=n.indexOf(s[o]);~r&&(i.preventDefault(),t[2]&&t[2].call(n[r],i,n[r].dataset))}return!1},!0)},this.$=function(t){var i=e.container.querySelectorAll(t);return 1===i.length?i[0]:i},this.bind_event=function(){for(var t=this,e=this.container.querySelectorAll("[Zevent]"),i=0;i<e.length;i++){var s=e[i].getAttribute("Zevent");(s=s.split("|")).length>1&&e[i].addEventListener(s[0],function(){var e=s[1];return function(i){t[e](i,this.dataset,this)}}(),!0)}}},Zframe={page_list:{},pagePath_list:[],page_count:0,template_list:{},code_list:{},this_page:!1,load_list:[],version:2.1,swipe_page:"",init:function(t,e){if(console.log(__dirname,__filename),this.content_id!=t){for(var i in e)this[i]=e[i];app_config.version&&(this.version=app_config.version),this.content_id=t,this.content_obj=document.getElementById(t),this.content_obj.style.position="relative";var s=this;return s.page_count=0,s.click_range_dom=app_config.click_range_dom_id?document.getElementById(app_config.click_range_dom_id):this.content_obj,s.click_range_dom.addEventListener("click",function(t){for(var e=!1,i=t.path||t.composedPath&&t.composedPath(),n=0;n<i.length-2&&!(e=i[n].getAttribute("href"));n++);if(e&&"#"!=e.substr(0,1)&&"javascript:"!=e.substr(0,11)&&("/"==e.substr(0,1)&&(e=e.substr(1)),"http"!=e.substr(0,4))){t.preventDefault(),o=e.split(/[\?]/),e=o[0];var o=o.length>1?o[1]:"",r="";o&&(r=o.split(/[\#]/),o=strtoobj(r[0]),r=r.length>1?strtoobj(r[1]):{});var a=e.replace(/\.htm[l]?/,"");a&&s.to(a,o,r)}}),Zback.back({},function(){setTimeout(function(){location.reload()},100)},1),this}},use:function(t,e){this.code_list[t]||(this.code_list[t]=e),!e.template&&(e.template=this.template_list[t]),!e.swipe_page&&(e.swipe_page=this.swipe_page),e.container=this.content_obj;var i=new Zpage(e);if(i.page_path=t,this.page_list[i.guid]=i,this.this_page=i.guid,this.page_count++,i.src_count=0,i.src&&(i.src.js&&(i.src_count+=i.src.js.length),i.src.css&&(i.src_count+=i.src.css.length)),i.load_src_count=0,this.target_page=i,0==i.src_count)this.do_load(i);else for(var s in i.src)for(var n in i.src[s]){var o=i.src[s][n].replace("{{domain}}",app_config.domain);this.loadjscssfile(o,s,i)}i.favicon_src&&this.loadjscssfile(i.favicon_src,"favicon_ico",i)},loadjscssfile:function(t,e,i){var s=this,n=t.indexOf("?")>0?"&":"?",o=t+n+"v="+this.version;if("js"==e)(r=document.createElement("script")).setAttribute("type","text/javascript"),r.setAttribute("src",o);else if("css"==e){(r=document.createElement("link")).setAttribute("rel","stylesheet"),r.setAttribute("type","text/css"),r.setAttribute("href",o)}else if("favicon_ico"==e){(r=document.createElement("link")).setAttribute("rel","shortcut icon"),r.setAttribute("type","image/x-icon"),r.setAttribute("href",o),s.loadjscssfile(o,"favicon_ico_")}else if("favicon_ico_"==e){var r;(r=document.createElement("link")).setAttribute("rel","icon"),r.setAttribute("type","image/x-icon"),r.setAttribute("href",o)}r.readyState?r.onreadystatechange=function(){"loaded"!=r.readyState&&"complete"!=r.readyState||(r.onreadystatechange=null,i&&s.do_load(i),s.load_list.push(t))}:(r.onload=function(){i&&s.do_load(i),s.load_list.push(t)},r.onerror=function(){i&&s.do_load(i),s.load_list.push(t)}),void 0!==r&&document.getElementsByTagName("head")[0].appendChild(r)},removejscssfile:function(t,e){for(var i="js"==e?"script":"css"==e?"link":"none",s="js"==e?"src":"css"==e?"href":"none",n=document.getElementsByTagName(i),o=n.length;o>=0;o--)if(n[o]&&null!=n[o].getAttribute(s)&&-1!=n[o].getAttribute(s).indexOf(t)){n[o].parentNode.removeChild(n[o]);break}},do_load:function(t){t.load_src_count++,t.load_src_count>=t.src_count&&(t.src_load=!0,this.target_page=t,t.show(this.this_page_param,this.this_page_hash))},to:function(t,e,i,s){"/"==t.substr(0,1)&&(t=t.substr(1)),this.this_page&&!s&&this.pagePath_list.push(this.this_page),i||(i={}),i.pagePath=t;var n={url:"?"+objtostr(e)+"#"+objtostr(i)};Zback.back(n,function(){console.log(this.page_count),this.page_count>=2?this.back():(history.go(-2),setTimeout(function(){location.reload()},100))}.bind(this),s),this.this_page_param=e||{},this.this_page_hash=i||{},this.template_list[t]?(this.this_page&&this.outpage(),this.executeScript(this.request_list[t])):this.ajax({url:t+".html?v="+this.version,success:function(e){this.this_page&&this.outpage(),this.request_list[t]=e,this.template_list[t]=this.clearScript(e),this.template_list[t]=Ztempl.formateTemplate(this.template_list[t],Zframe.template_list),this.executeScript(this.request_list[t])}.bind(this)})},outpage:function(t){var e=this,i=e.page_list[e.this_page];if(this.swipe_page){var s=t||this.page_list[this.this_page].container,n=function(){s.classList.remove("fadeOut"+e.swipe_page),s.removeEventListener("animationend",n),e.content_obj.removeChild(s),o.call(e)};s.classList.add("fadeOut"+this.swipe_page),s.addEventListener("animationend",n,!1)}else this.content_obj.innerHTML="",o.call(e);function o(){for(var t=i.src.css||[],e=0;e<t.length;e++){this.removejscssfile(t[e],"css");var s=this.load_list.indexOf(t[e]);~s&&this.load_list.splice(s,1)}}},back:function(t,e,i){if((isFunction(t)||isString(t))&&(i=t,t=!1),(isFunction(e)||isString(e))&&(i=e,e=!1),this.page_count>1){if(this.outpage(this.page_list[this.this_page].container),delete this.page_list[this.this_page],this.this_page=this.pagePath_list.pop(),this.this_page){var s=this.page_list[this.this_page];this.target_page=s;for(var n=this.page_list[this.this_page].src.css||[],o=0;o<n.length;o++)this.loadjscssfile(n[o],"css");s.show(t,e)}e&&(e.pagePath=s.page_path),Zback.back({url:"?"+objtostr(t||s.param)+"#"+objtostr(e||s.hash)},!1,1),this.page_count--}else isFunction(i)&&i(),isString(i)&&Zframe.to(i)},push_hash:function(t,e){var i=GetHash();i[t]=e,location.hash=objtostr(i)},executeScript:function(html){var reg=/<script[^>]*>([^\x00]+)$/i,htmlBlock=html.split("<\/script>");for(var i in htmlBlock){var blocks;if(blocks=htmlBlock[i].match(reg)){var code=blocks[1].replace(/<!--/,"");try{eval(code)}catch(t){console.log("err:",t.message),console.log(code)}}}return this},clearScript:function(t){return t.replace(/<script[\s\S]*?<\/script>/i,"")},hide:function(){this.content_obj.dataset.olddisplay=this.content_obj.style.display,this.content_obj.style.display="none"},ajax:function(){var t={type:"GET",url:"",async:"true",data:null,dataType:"text",processData:!0,contentType:"application/x-www-form-urlencoded",beforeSend:function(){},success:function(){},error:function(){}};(t=Object.assign(t,arguments[0]||{})).beforeSend();var e=function(){if(window.ActiveXObject)return new ActiveXObject("Microsoft.XMLHTTP");if(window.XMLHttpRequest)return new XMLHttpRequest}();e.responseType=t.dataType,e.open(t.type,t.url,t.async),t.contentType&&e.setRequestHeader("Content-Type",t.contentType),"GET"==t.type?e.send(function(t){if("object"==typeof t){var e="";for(var i in t)e+=i+"="+t[i]+"&";return e=e.substring(0,e.length-1)}return t}(t.data)):e.send(t.data),e.onreadystatechange=function(){4==e.readyState&&(200==e.status?t.success(e.response):t.error())}},load_template:function(t,e){for(var i=this,s=Object.keys(t),n=s.length,o=0,r=0;r<n;r++)if(this.template_list[s[r]])o++;else{var a=t[s[r]];this.ajax({url:a,success:function(){var t=s[r];return function(s){i.template_list[t]=s,++o>=n&&e&&e()}}()})}}};var Zback={bacn_fn_list:[],is_init:!1,back:function(t,e,i){e||(e=t),isFunction(e)&&this.bacn_fn_list.push(e),i?history.replaceState(t.data||{},t.title||document.title,t.url||""):history.pushState(t.data||{},t.title||document.title,t.url||""),this.is_init||this.init()},init:function(){var t=this;t.is_init=!0,window.addEventListener("popstate",function(e){if(history.state){var i=t.bacn_fn_list.pop();i&&i()}})}};function strtoobj(t){if(!t)return{};for(var e=new Object,i=t.split(/[\&\?]/),s=0;s<i.length;s++){var n=i[s].split("=");e[n[0]]=unescape(n[1])}return e}function objtostr(t){if(!t)return"";var e=[];for(var i in t)e.push(i+"="+t[i]);return e.join("&")}function newGuid(){for(var t="",e=1;e<=32;e++){t+=Math.floor(16*Math.random()).toString(16),8!=e&&12!=e&&16!=e&&20!=e||(t+="-")}return t}function isFunction(t){return"[object Function]"===Object.prototype.toString.call(t)}function isString(t){return"string"==typeof t}function GetHash(){var t=location.hash,e=new Object;if(-1!=t.indexOf("#")){var i=t.substr(1);strs=i.split(/[\&\?]/);for(var s=0;s<strs.length;s++)e[strs[s].split("=")[0]]=unescape(strs[s].split("=")[1])}return e}window.Zpage=Zpage,window.Zframe=Zframe,module.exports=Zframe}).call(this,"/","/index.js")}]);