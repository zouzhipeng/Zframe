var app_config = {
	domain:"/demo/",
	version:"1.0.2",
	Zupload:{
		upurl:"http://edu.qizoubixia.top/api/UploadImage/upimg",
		qiniu_token:"http://edu.qizoubixia.top/api/UploadImage/qiniu_token",
		qiniu_up:1,
		before:function(){Ztoast.loding();},
		complete:function(res){
			Ztoast.close();
			if(this.options.success)this.options.success(res['x:path']);
		},
		error:function(res){
			Ztoast.close();
			Ztoast.msg('上传失败！')
		},
	}
};