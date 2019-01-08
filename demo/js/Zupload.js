
var Zupload = function(page,t,options){
	var _this = this;
	if(typeof page === 'string'){
		options = t;
		t = page;
		page = false;
	}
	if(isFunction(options)){
		options = {
			success : options,
		}
	}
	
	var defaults = {
		//以下为该插件的属性及其默认值
		upurl : '/Api/Upf/upimg',
		//wxupurl : '/Api/Upf/wx_upimg',
		//urltype : 0,//0：七牛url，1：微信url
		success : null,
	};
	if(app_config.Zupload)defaults = Object.assign(defaults, app_config.Zupload);
	this.options = Object.assign(defaults, options||{});
	
	this.page = page||Zframe.page_list[Zframe.this_page];
	this.container = this.page.container;
    this.guid = newGuid();
    this.selector = '#Zupload'+this.guid;
	this.f = this.container.querySelector(this.selector);
	if(!this.f){
		this.f = document.createElement('input');
		this.f.setAttribute('type', 'file');
		this.f.setAttribute('style', 'display:none;');
		this.f.id = 'Zupload'+this.guid;
		this.container.appendChild(this.f);
	}
	else{
		this.f = this.f[0];
	}
	this.f.addEventListener('change', function(){
		if(_this.options.qiniu_up){
		    var file = this.files[0];
			this.value = "";
			_this.qiniu_up(file);
		}
		else{
			var fd = new FormData();
			fd.append("upfile", this.files[0]);
			this.value = "";
			Zframe.ajax({
				url: _this.options.upurl,
				type: "POST",
				processData: false,
				contentType: false,
				dataType:"json",
				data: fd,
				success: function(data) {
					if(_this.options.success){
						_this.options.success(data.img_url||data,_this);
					}
				}
			});
		}
	}, false);
	this.page.on('click',t,function(){
		//触发onclick
		var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        _this.e = this;
        _this.f.dispatchEvent(e);
	})
	this.qiniu_up = function(file){
		Zframe.ajax({
			url: _this.options.qiniu_token,
			dataType:"json",
			success: function(res) {
			    var token = res.token;
			    var domain = res.domain;
			    var config = {
			      useCdnDomain: true,
			      disableStatisticsReport: false,
			      retryCount: 6,
			    };
			    var putExtra = {
			      fname: "",
			      params: {},
			      mimeType: null
			    };
			    var subObject = { 
			        next: _this.options.next||false,
			        error: _this.options.error||false,
			        /*complete: function(res){
			        	this.options.complete&&this.options.complete.call(this);
			        }.bind(_this),*/
			       complete:_this.options.complete?_this.options.complete.bind(_this):false,
			    };
				//var key = file.name;
				var ext = file.name.split('.')[1]||"";
				var key = (new Date()).format('yyyyMMddhhmmss')+rand(1000,9999)+"."+ext;
				putExtra.params["x:path"] = domain+"/"+key;
				var observable = qiniu.upload(file, key, token, putExtra, config);
				_this.options.before&&_this.options.before();
        		subscription = observable.subscribe(subObject);
        		function rand(min,max) {
			        return Math.floor(Math.random()*(max-min))+min;
			    }
			}
		});
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