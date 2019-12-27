module.exports = {
	baseUrl: "./", //cli3以后被弃用
	// publicPath: '/',  //部署应用包时的基本URL，默认应用是被部署在一个域名的根路径上，与cli3的baseUrl 性质一样
	// publicPath:'./',  //所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
	// publicPath:'',  //所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
	outputDir: "dist/hcms", //build生成环境构建文件的目录,默认显示dist
	assetsDir: "", //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
	filenameHashing: false, //关闭文件名包含hash,false：关闭，true：包含hash
	lintOnSave: false, //true时，@vue/cli-plugin-eslint安装以后，会将lint错误输出为编译错误，警告但不会编译失败
	// lintOnSave:'lintOnSave',//输入编译错误，且编译失败
	// lintOnSave: process.env.NODE_ENV !== 'production',//生产环境禁用esliint

	devServer: {
		open: true,
		// proxy: {
		//   "/api": {
		//     //要访问的跨域的域名
		//     // target: "192.168.94.119:8930",
		//     // ws: false, // 是否启用websockets
		//     //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
		//     // changOrigin: true
		//   }
		// },
		// before: function (app, server) {
		//     app.get('/', function (req, res) {
		//         res.redirect('/myModuleManagement.html');
		//     });
		// }
		historyApiFallback: {
			rewrites: [{
					from: /^\/$/,
					to: '/login.html'
				},
				{
					from: /^\/login/,
					to: "/login.html"
				},
				{
					from: /./,
					to: "/views/404.html"
				}
			]
		}
	},

	configureWebpack: config => {
		config.optimization = {
			splitChunks: {
				chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
				minSize: 30000, // 最小尺寸，30000
				minChunks: 1, // 最小 chunk ，默认1
				maxAsyncRequests: 5, // 最大异步请求数， 默认5
				maxInitialRequests: 3, // 最大初始化请求数，默认3
				automaticNameDelimiter: "~", // 打包分隔符
				name: function () {}, // 打包后的名称，此选项可接收 function
				cacheGroups: {
					//开始设置缓存的chunk
					// libs: {//
					//     name: "chunk-libs",//打包之后的名字
					//     test: /[\\/]node_modules[\\/]/,//校验规则(查找符合校验规则的文件)
					//     priority: 10, //设置优先级 越大越高，可以时负数
					//     chunks: "all"
					// },
				}
			}
		};
	},

	pages: {
		login: {
			entry: "src/login/login.js",
			template: "src/login/login.html",
			filename: "login.html",
			title: "登陆页面",
			chunks: ["chunk-vendors", "chunk-common", "login"]
		},
		// menu: {
		// 	entry: "src/login/views/menu/menu.js",
		// 	template: "src/login/views/menu/menu.html",
		// 	filename: "menu.html",
		// },
	}
};