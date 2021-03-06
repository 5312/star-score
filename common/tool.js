import MinCache from './api/unit.js';
const minCache = new MinCache
export const baseUrl = "https://xishui.ydeshui.com/index.php?s="
let getTokenCount = 0
export default {
	uniShowToast(options) {
		let {
			title,
			icon,
			mask,
			duration,
			image
		} = options
		uni.showToast({
			title: title,
			icon: icon ? icon : "success",
			image: image ? image : "",
			mask: mask ? mask : false,
			duration: duration ? duration : 1500,
			complete: () => {
				setTimeout(() => {
					uni.hideToast();
				}, 30000)
			}
		});
	},
	uniRedirectTo(options) {
		let {
			url,
			success,
			fail,
			complete
		} = options
		uni.redirectTo({
			url: url,
			success: success ? success() : false,
			fail: fail ? fail() : false,
			complete: complete ? complete() : false
		});
	},
	uniReLaunch(options) {
		let {
			url,
			success,
			fail,
			complete
		} = options
		uni.reLaunch({
			url: url,
			success: success ? success() : false,
			fail: fail ? fail() : false,
			complete: complete ? complete() : false
		});
	},
	uniNavigateTo(options) {
		let {
			url,
			animaType,
			time,
			success,
			fail,
			complete
		} = options
		uni.navigateTo({
			url: url,
			animationType: animaType,
			animationDuration: time ? time : 3000,
			success: success ? success() : false,
			fail: fail ? fail() : false,
			complete: complete ? complete() : false
		})
	},
	uniShowLoading(options) {
		let {
			title,
			mask,
			success,
			fail,
			complete
		} = options
		uni.showLoading({
			title: title ? title : '加载中',
			mask: mask ? mask : true,
			success: () => {
				success ? success() : false
			},
			fail: () => {
				fail ? fail() : false
			},
			complete: () => {
				complete ? complete() : false
			},
		})
	},
	uniHideLoading() {
		uni.hideLoading()
	},
	wxPayMoney(timeStamp, nonceStr, pack, signType, paySign, sucfun, failfun = null, compfun = null) { //封装微信支付函数
		uni.requestPayment({
			provider: 'wxpay',
			orderInfo: "orderInfo",
			timeStamp: timeStamp + '',
			nonceStr: nonceStr,
			package: `prepay_id=${pack}`,
			signType: signType,
			paySign: paySign,
			success(res) {
				sucfun(res)
			},
			fail(err) {
				failfun ? failfun(err) : false
			},
			complete(result) {
				compfun ? compfun(result) : false
			}
		});
	},
}
