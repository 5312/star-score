<template>
	<view class="auth">
		<u-gap height="120" bg-color="#fff"></u-gap>
		<u-avatar mode="square" size="large" src="/static/basicprofile.png"></u-avatar>
		<view class="h1">申请获取以下权限</view>
		<view class="h2">获取你的公开信息(昵称，头像，手机等)</view>
		<u-gap height="50" bg-color="#fff"></u-gap>
		<button open-type="getUserInfo" @getuserinfo='bindGetUserInfo' class="logoin" type="primary" size="default">授权登录</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				id:''
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option)
			this.id = option.shopid
		},
		methods: {
			bindGetUserInfo(res) {
				if (res.detail.userInfo) {
					console.log('用户点击了授权按钮')
					uni.reLaunch({
						url: '../index/index?shopid=' +this.id
					});
				} else {
					console.log('用户点击了取消按钮')
				}
			},
		}
	}
</script>

<style lang="scss">
	.auth {
		width: 100%;
		text-align: center;
		padding: 20rpx;

		.h1 {
			font-size: $uni-font-size-lg;
			font-weight: 700;
			padding: 20rpx;
		}

		.h2 {
			color: $uni-text-color-placeholder;
			padding: 20rpx;
		}

		.logoin {
			margin-top: 30rpx;
		}
	}
</style>
