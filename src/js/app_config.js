var app_config = {
	domain:"https://score.nweitiku.com/",
	version:"1.0.2",
    Zupload:{
        upurl:"https://score.nweitiku.com/api/upload_image/upimg",
        qiniu_token:"https://score.nweitiku.com/api/upload_image/qiniu_token",
        qiniu_path:"exam/",
        qiniu_up:1,
        before:function(){
            layer.load();
        },
        complete:function(res){
            layer.closeAll('loading');
            if(this.options.success)this.options.success(res['x:path']);
        },
        error:function(res){
            layer.closeAll('loading');
            layer.msg('上传失败！')
        },
    }
};

module.exports = app_config