
// webpack.config.js
const path = require("path");
const webpack = require("webpack");


// 获取当前运行的模式
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // 是否是调试
    devServer,      // 是否是热更新模式
    minimize;       // 是否需要压缩

if (currentTarget == "build") { // 发布模式
    debug = false, devServer = false, minimize = true;
} else if (currentTarget == "dev") { // 开发模式
    debug = true, devServer = false, minimize = false;
} else if (currentTarget == "dev-hrm") { // 热更新模式
    debug = true, devServer = true, minimize = false;
}
var PATHS = {
    // 发布目录
    publicPath: debug ? '/' : '/dist/',
    // 公共资源目录
    libsPath: path.resolve(process.cwd(), './libs'),
    // src 资源目录
    srcPath: path.resolve(process.cwd(), 'src'),
}
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

const HappyPack = require('happypack'); //多线程运行
var happyThreadPool = HappyPack.ThreadPool({ size: 4 });

module.exports = {
    entry:{
        // 入口 js
        index: './src/index.js',
        // 公共js包含的文件
        common: [
            "./src/js/Ztempl.js",
            "./src/css/common.css"
        ],
    },
    output:{
        // 输出目录
        path: path.resolve(__dirname, 'dist'),
        // 发布后，资源的引用目录
        publicPath: PATHS.publicPath,
        // 文件名称
        filename: 'js/[name].js',
        // 按需加载模块时输出的文件名称
        chunkFilename: 'js/[name].js'
    },
    plugins:[
        new webpack.DefinePlugin({
            // 全局debug标识
            __DEV__: debug,
        }),
        //热更新
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({  // 入口文件
            filename: 'index.html',
            template: `${__dirname}/src/index.html`, //源html
            inject: 'body', //注入到哪里
            hash: true, //为静态资源生成hash值
            showErrors:true,
        }),
        new CopyWebpackPlugin([ // 复制插件
            { 
                from: path.join(__dirname,'src/page'), 
                to:  path.join(__dirname,'dist/page') 
            }
        ]),
        new CopyWebpackPlugin([
            { from: 'dll/Zframe.dll.js', to: path.resolve(__dirname, 'dist') },
        ]),
        new HappyPack({
            //多线程运行 默认是电脑核数-1
            id: 'babel', //对于loaders id
            loaders: ['cache-loader','babel-loader?cacheDirectory'], //是用babel-loader解析
            threadPool: happyThreadPool,
            verboseWhenProfiling: true, //显示信息
        }),
        new webpack.HashedModuleIdsPlugin(),
          new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dll/Zframe.manifest.json')
        }),
    
    ],
    devServer: {
        contentBase:path.join(__dirname,'dist'), //可选，基本目录结构
        historyApiFallback:true,
        compress: true, //开发服务器是否启动gzip等压缩
        inline:true,
        progress:true,
        hot:true,
        port:8081
    },
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/, //排除
                include: [path.resolve(__dirname, 'src')], //包括
                loader: 'happypack/loader?id=babel',
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
        ]
    },
    mode: debug ?'development':'production', // development，production
}