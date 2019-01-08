var Ztoast = {
	toast_list:{},
	num:0,
	template:'<div class="toast {{fadeIn}}">'+
	'	<div Zif="mask" class="mask"></div>'+
	'	<div class="toast-main {{main_class}}">'+
	'		<div Zif="close" class="toast-close"><span>取消</span></div>'+
	'		<div Zif="title" class="toast-title">{{title}}</div>'+
	'		<div class="toast-content">'+
	'			<span Zif="msg">{{msg}}</span>'+
	'			<ul Zif="is_select" class="toast-select">'+
	'				<li Zfor="option" Zdata="{li_class:li_class}" data-value="{{value}}" class="{{select == 1?\'active\':\'\'}} {{li_class}}">{{text}}</li>'+
	'			</ul>'+
	'			<div Zif="main_class == \'toast-confirm\'" class="toast-btn-box">'+
	'				<div class="confirm">确认</div>'+
	'				<div class="cancel">取消</div>'+
	'			</div>'+
	'		</div>'+
	'	</div>'+
	'</div>',
}
Ztoast.init = function(){
	var toast = function(num){
		this.id=num||Ztoast.num++;
	}
	Ztoast.select=function(fn){
		this.num++;
		var t = new toast(this.num);
		this.toast_list[this.num] = t;
		return t.select(fn);
	};
	toast.prototype.select = function(page,fn){
		var _this = this;
		if(typeof page === 'function'){
			fn = page;
			page = false;
		}
		
		this.page = page||Zframe.page_list[Zframe.this_page];
		//this.page = page;
		this.fn = fn;
		this.page.on('click','select',function(e){
			e.preventDefault();
			
			//_this.id = Ztoast.num++;
			_this.data = {
				fadeIn:"fadeIn",
				fadeOut:"fadeOut",
				is_select:true,
				mask:1,
			};
			_this.M = Ztempl(Ztoast.template,_this.data);
			_this.M.$nodes[0].id = "Ztoast_"+_this.id;
			_this.eid = this.id;
			_this.e = this;
			
			var data = Object.assign({},this.dataset);
			//选项
			data.option = [];
			var select_index = 0; 
			for(var i = 0;i < this.children.length;i++){
				if(this.value == this.children[i].value)select_index = i;
				data.option.push({
					value:this.children[i].value,
					text:this.children[i].text,
					select:0,
				})
			}
			data.option[select_index].select = 1;
			
			Ztempl.refresh(_this.data,data);
			Ztempl.append(_this.M.$nodes[0],_this.page.container);
			this.blur();
			return false;
		});
		
		this.page.on('click','.toast-select li',function(e){
			_this.close(this);
		});
		
		this.page.on('click','.toast .mask',function(e){
			_this.close();
		});
	}
	Ztoast.msg=function(msg,fn){
		this.num++;
		var t = new toast(this.num);
		this.toast_list[this.num] = t;
		return t.msg(msg,fn);
	};
	toast.prototype.msg = function(page,msg,fn){
		//var _this = this;
		if(typeof page === 'string'){
			fn = msg;
			msg = page;
			page = false;
		}
		
		this.page = page||Zframe.page_list[Zframe.this_page];
		this.data = {
			fadeIn:"fadeIn",
			fadeOut:"fadeOut",
			msg:msg,
			main_class:"toast-msg"
		};
		//this.id = Ztoast.num++;
		
		this.M = Ztempl(Ztoast.template,this.data);
		this.M.$nodes[0].id = "Ztoast_"+this.id;
		Ztempl.append(this.M.$nodes[0],this.page.container);
		setTimeout(function(){
			this.close(this.id,fn);
		}.bind(this),2000);
		return this.id;
	}
	Ztoast.loding=function(fn){
		this.num++;
		var t = new toast(this.num);
		this.toast_list[this.num] = t;
		return t.loding(fn);
	};
	toast.prototype.loding = function(page,fn){
		//var _this = this;
		if(typeof page === 'string'){
			fn = page;
			page = false;
		}
		
		this.page = page||Zframe.page_list[Zframe.this_page];
		this.data = {
			fadeIn:"fadeIn",
			fadeOut:"fadeOut",
			msg:'loading...',
			main_class:"toast-msg"
		};
		//this.id = Ztoast.num++;
		
		this.M = Ztempl(Ztoast.template,this.data);
		this.M.$nodes[0].id = "Ztoast_"+this.id;
		Ztempl.append(this.M.$nodes[0],this.page.container);
		return this.id;
	}
	Ztoast.open=function(p,fn){
		this.num++;
		var t = new toast(this.num);
		this.toast_list[this.num] = t;
		return t.open(false,p,fn);
	};
	toast.prototype.open=function(page,p,fn){
		var _this = this;
		/*if(typeof page === 'string'){
			fn = p;
			p = page;
			page = false;
		}*/
		
		this.page = page||Zframe.page_list[Zframe.this_page];
		this.data = {
			fadeIn:"fadeIn",
			fadeOut:"fadeOut",
			mask:1,
			main_class:"toast-open"
		};
		if(isString(p)){
			this.data.content = this.page.$(p);
			p = false;
		}
		if(p)this.data = Object.assign(this.data, p);
		//转换元素节点
		if(this.data.content instanceof HTMLElement){
			this.data.content_p = this.data.content.parentElement;
			this.data.content_obj = this.data.content;
			this.data.content = false;
		}
		
		//this.id = Ztoast.num++;
		
		this.M = Ztempl(Ztoast.template,this.data);
		this.M.$nodes[0].id = "Ztoast_"+this.id;
		Ztempl.append(this.M.$nodes[0],this.page.container);
		//this.page.container.appendChild(this.M.$nodes[0]);
		
		if(this.data.content_obj){
			var toast_content = this.page.$("#Ztoast_"+this.id+' .toast-content');
			toast_content.appendChild(this.data.content_obj);
			this.befor_close = function(){
				_this.data.content_p.appendChild(_this.data.content_obj);
			};
		}
		this.page.$('.toast .mask').addEventListener('click',function(e){
			_this.close(_this.id);
		});
		this.page.$('.toast .toast-close span').addEventListener('click',function(e){
			_this.close(_this.id);
		});
		
		return this.id;
	}
	Ztoast.confirm=function(p,fn,cancel){
		this.num++;
		var t = new toast(this.num);
		this.toast_list[this.num] = t;
		return t.confirm(false,p,fn);
	};
	toast.prototype.confirm = function(page,p,fn,cancel){
		var _this = this;
		this.page = page||Zframe.page_list[Zframe.this_page];
		this.data = {
			fadeIn:"fadeIn",
			fadeOut:"fadeOut",
			mask:1,
			main_class:"toast-confirm"
		};
		if(isString(p)){
			this.data.content = this.page.$(p);
			p = false;
		}
		if(p)this.data = Object.assign(this.data, p);
		
		this.M = Ztempl(Ztoast.template,this.data);
		this.M.$nodes[0].id = "Ztoast_"+this.id;
		Ztempl.append(this.M.$nodes[0],this.page.container);
		//this.page.container.appendChild(this.M.$nodes[0]);
		this.page.$('.toast .mask').addEventListener('click',function(e){
			_this.close(_this.id);
		});
		var close_obj = this.page.$('.toast .toast-close span');
		close_obj.length&&close_obj.addEventListener('click',function(e){
			_this.close(_this.id);
		});
		
		this.page.$('.toast .toast-confirm .confirm').addEventListener('click',function(e){
			fn&&fn();
			_this.close(_this.id);
		});
		this.page.$('.toast .toast-confirm .cancel').addEventListener('click',function(e){
			cancel&&cancel();
			_this.close(_this.id);
		});
		return this.id;
		
	};
	Ztoast.close=function(id,fn){
		if(!id){
			var arr = Object.keys(this.toast_list);
			id = arr[arr.length-1];
		}
		var t = this.toast_list[id];
		t.close(id,fn);
		this.toast_list[id] = null;
		delete this.toast_list[id];
	};
	toast.prototype.close = function(li,id,fn,all){
		if(!(li instanceof HTMLElement)){
			all = fn;
			fn = id;
			id = li;
			li = false;
		}
		if(typeof id != 'string'){
			(typeof fn == 'boolean')&&(all = fn);
			(typeof id == 'function')&&(fn = id);
			id = false;
		}
		if(typeof fn != 'function'){
			(typeof fn == 'boolean')&&(all = fn);
			fn = false;
		}
		!id&&(id=this.id);
		var _this = this;
		var node = this.page.container.querySelector(all?'.toast':'#Ztoast_'+id);
		var animationend = function(){
	        node.classList.remove(_this.data.fadeOut);
	        node.removeEventListener('animationend', animationend);
	        _this.page.container.removeChild(node);
	        fn&&fn();
		}
		if(this.befor_close)this.befor_close();
		if(li){
			var list = li.parentElement.children;
			var index = 0;
			for(var i = 0; i<list.length;i++){
				list[i].classList.remove('active');
				if(li == list[i])index = i;
			}
			li.classList.add('active');
			if(_this.fn)_this.fn({id:_this.eid,e:_this.e,value:li.dataset.value,text:li.textContent,index:index});
			setTimeout(function(){
				node.classList.add('fadeOut');
	            node.addEventListener('animationend', animationend, false);
			},500);
		}
		else{
			node.classList.add('fadeOut');
		    node.addEventListener('animationend', animationend, false);
		}
	}
};
Ztoast.init();