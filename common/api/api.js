import MinHttp from './http.js'
import MinCache from './unit.js'
import tool from '../tool.js'

const minHttp = new MinHttp()
const minCache = new MinCache({
	timeout: 0
});
let time = null;
const loading = { //加载动画
	star: (url) => {
		tool.uniShowLoading({}) //加载动画
		time = setTimeout(() => { //10s请求时长
			console.log(url)
			tool.uniShowToast({
				title: '请求超时，请重试',
				icon: "none"
			})
			tool.uniHideLoading()
		}, 60000); //超时关闭
	},
	end: () => {
		tool.uniHideLoading(); //先结束动画
		clearTimeout(time); //清除定时器
	}
}
//请求拦截器
minHttp.interceptors.request(request => {
	if (request.data == undefined) request.data = {};
	//增加token
	request.data.wxapp_id = "10001"
	request.data.token = minCache.get("_token");
	//加载动画
	if (request.load) loading.star(request);
	return request;
});
//响应拦截器
minHttp.interceptors.response((response) => {
	loading.end(); //清除加载动画
	if (response.errMsg == "request:fail ") { //请求失败，进fail
		tool.uniShowToast({
			title: "请求失败，请重试",
			icon: "none"
		});
		return response;
	}
	if (response.statusCode !== 200) {
		tool.uniShowToast({
			title: "请求失败，请重试",
			icon: "none"
		})
		return response;
	} //
	if (response.data.code == -1) { //-1是token失效
		tool.uniShowToast({
			title: "token失效，重新登陆！",
			icon: "none"
		})
		minCache.clear();
		tool.getTokenValue();
	} else if (response.data.code == 0) { //这时请求也错误
		return Promise.reject(response.data.msg);
	} else { //其他情况下
		return response.data;
	}
})
minHttp.setConfig(config => { //配置
	config.baseURL = 'https://xishui.ydeshui.com/index.php?s='
	return config
})
let load = {
	load: true
}
// 登录 获取token
async function getCode() {
	const code = await uni.login({
		provider: 'weixin',
	})
	console.log(code)
	if (code[1]) {
		// 以授权
		const userInfo = await uni.getUserInfo({
			provider: 'weixin',
		})
		return [code[1],userInfo[1]];
	}
}

export default {
	// 这里统一管理api请求
	apis: {
		async login() { // 登录
			const res = await getCode();
			
			let data = {
				code: res[0].code,
				user_info: JSON.stringify(res[1].userInfo),
				signature: res[1].signature,
				encrypted_data: res[1].encryptedData,
				iv: res[1].iv,
			};
			return minHttp.post(`/api/user/login`, data,load)
		},
		detail(data){
			//详情
			return minHttp.get(`/api/shop/detail`,data)
		},
		add(data){
			return minHttp.post(`/api/shopping/add`,data,load)
		},
		list(data){
			return minHttp.get(`/api/shopping/lists`,data,load)
		}
	}
}
