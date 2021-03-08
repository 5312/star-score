<template>
	<view class="main">
		<view class="tops u-skeleton">
			<image v-if="!logoSrc" class="logo u-skeleton-circle" src=""></image>
			<u-avatar v-else size="large" :src="logoSrc" mode="circle"></u-avatar>

			<view class="text-area ">
				<text class="titlehead u-skeleton-rect">{{detail.shop_name}}</text>
			</view>
			<view class="address u-skeleton-rect">
				<image class="addimg" src="../../static/address.png" mode=""></image>
				<text class="addtext ">{{detail.address}}</text>
			</view>
			<view class="star">
				<text class="star-text">综合评分：</text>
				<view class="vote-number">{{all}}</view>
				<image class="jinpai" :src="jinpai" mode="" @click="evaluate"></image>
				<!-- <view class="vote-star">
					<view class="i" :style="{ width:width,height:'100%'}"></view>
				</view> -->
			</view>
		</view>
		<view class="content">

			<view class="star-rating-box">
				<view class="title fontSize14 color333">价格</view>
				<star-rating @changeScore='changeScore' name='scoreNum' :score='scoreNum'></star-rating>
			</view>
			<view class="star-rating-box">
				<view class="title fontSize14 color333">质量</view>
				<star-rating @changeScore='changeScore' name='punctualNum' :score='punctualNum'></star-rating>
			</view>
			<view class="star-rating-box">
				<view class="title fontSize14 color333">售后</view>
				<star-rating @changeScore='changeScore' name='serviceNum' :score='serviceNum'></star-rating>
			</view>
			<view class="star-rating-box">
				<view class="title fontSize14 color333">顾客</view>
				<star-rating @changeScore='changeScore' name='peop' :score='peop'></star-rating>
			</view>
			<view class="star-rating-box">
				<view class="title fontSize14 color333">安全</view>
				<star-rating @changeScore='changeScore' name='safe' :score='safe'></star-rating>
			</view>
			<view class="star-rating-box">
				<view class="title fontSize14 color333">环境</view>
				<star-rating @changeScore='changeScore' name='ambient' :score='ambient'></star-rating>
			</view>
			<view class="textarea">
				<textarea class="text-center" v-model="msg" placeholder="写几句评价吧..." />
				<!-- 上传 -->
				<u-upload 
				ref="uUpload" 
				:action="action" 
				:form-data='header' 
				name='image' 
				:auto-upload="false" 
				max-size='1024kb' 
				@on-choose-complete='complete'
				@on-remove="remove"
				size-type='compressed'
				></u-upload>
			</view>
			<view class="btn">
				<!-- <button v-if="auth" open-type="getUserInfo" @getuserinfo='bindGetUserInfo' class="logoin" type="default" size="mini">点我登录</button> -->
				<button  class="btnn" type="default" @click="submit" size="mini">提交评价</button>
			</view>
			<view class="bottom">主办单位:习水县市场监督管理局</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				header:{
					wxapp_id:'10001'
				},
				shop_id:'',
				title: '邢老三肉丸胡辣汤',
				scoreNum: 0, //价格
				punctualNum: 0, //质量
				serviceNum: 0, //售后
				ambient: 0, //环境
				peop: 0, //顾客
				safe: 0, //安全
				detail:{
					shop_name:'九家泡馍1',
					address:'习水县啊啊啊街道1'
				},
				all:'',//综合评分
				logoSrc:'',// 头像
				msg:'',// 评价
				loading: true, // 是否显示骨架屏组件
				jinpai:'',// 金牌
				action: 'https://xishui.ydeshui.com/index.php?s=/api/shopping/base64',
				upload:[],
			};
		},
		onLoad(option) {
			let q = option.q ? decodeURIComponent(option.q) : null;
			
			if(option.shopid){
				this.shop_id = option.shopid
				this.authSet()
				return
			}else if (q) {
				let a = q.split('?')[1]
				if (a && a.length > 0) {
					let b = a.split('=')
					if (b && b.length > 0 && b[0] == 'shopid') {
						this.shop_id = b[1] || '10002';
						
						this.authSet()
					}
				}
			}else{
				//评价
				uni.reLaunch({
				    url: `../list/list`,
				});
			}
		}, 
		methods: {
			remove(index,lists,name){
				this.upload.splice(index,1);
				// console.log(this.upload)
			},
			complete(lists,name){
				let that = this;
				that.upload = [];
				lists.forEach( (x,y)=>{
					console.log(y)
					let path = x.url;
					 uni.getFileSystemManager().readFile({
						 filePath:path,
						 encoding:'base64',
						 success: r => {
							 // console.log(r.data)
							 that.upload.push(r.data)
						 }
					 })
				})
			},
			evaluate(){
				//评价
				uni.navigateTo({
				    url: `../evaluate/evaluate?net_f=${this.detail.net_f}&admin_f=${this.detail.admin_f}&jinpai=${this.jinpai}&shopid=${this.shop_id}`,
				});
			},
			alls(){
				/**
				 * 最高为10颗星满分100分，一颗星对应为10分。
				 * 评分结果分为金牌、银牌、铜牌、黑牌四个等级。
				 * 评分得分80分至100分为金牌，70至79为银牌，60至69为铜牌，
				 * 60分以下为黑牌。价格诚信20分、质量诚信40分、售后诚信10分、
				 * 顾客满意度10分、安全生产10分、生态环保10分。
				 */
				// 综合评分计算
				// let a = 60 * 1 * 0.2; // 权重
				// let b = 70 * 1 * 0.4; // 权重
				// let c = 90 * 1 * 0.1; // 权重
				// let d = 100 * 1 * 0.1; // 权重
				// let e = 90 * 1 * 0.1; // 权重
				// let f = 100 * 1 * 0.1; // 权重
				let sum = this.detail.net_f + this.detail.admin_f;
				this.all = sum + '分';
				
				if(sum > 80) this.jinpai = '../../static/star-rating/jinpai.png';
				if(sum > 70 && sum < 79) this.jinpai = '../../static/star-rating/yinpai.png';
				if(sum > 60 && sum < 69) this.jinpai = '../../static/star-rating/tongse.png';
				if(sum < 60) this.jinpai = '../../static/star-rating/heipai.png';

			},
			authSet(){//授权状态判断
				let that = this;
				uni.getSetting({
					success(res) {
						let auth = res.authSetting['scope.userInfo'];
						console.log(auth)
						if(auth){
							that.logoin();
						}else{
							uni.navigateTo({
								url: '../auth/auth?shopid='+that.shop_id,
								animationType: 'pop-in',
								animationDuration: 200,
								success(e){
									console.log(e)
								},
								fail(e){
									console.log(e)
								}
							});
						}
					}
				})
			},
			logoin(){// 登录
				let that = this;
				this.$api.login().then(res => {
					// 缓存toekn
					this.$cache.set('_token',res.data.token);
					this.loading = false;
					// 获取商户详情
					this.$api.detail({
						shop_id:that.shop_id
					}).then( r => {
						console.log(r.data.detail)
						that.detail = r.data.detail
						that.logoSrc = r.data.detail.logo.file_path;
						// 综合计算
						that.alls();
					})
				}).catch(e => {
					console.log(e)
				});
				
			},
			submit(){
				// 提交
				let that = this;
				// // this.$refs.uUpload.upload();
				console.log(this.upload)
				// // return;
				this.$api.add({
					shop_id:that.shop_id,
					msg:that.msg,
					p1:that.scoreNum * 10,
					p2:that.punctualNum * 10,
					p3:that.serviceNum * 10,
					p4:that.peop * 10,
					p5:that.safe * 10,
					p6:that.ambient * 10,
					images:this.upload
				}).then(res => {
					uni.showToast({
						title: res.data,
						icon: res.msg == 'success' ? 'success' : "none",
						mask:  false,
						duration:1500,
						complete: () => {
							setTimeout(() => {
								uni.hideToast();
							}, 30000)
						}
					});
				})
			},
			changeScore(param) {
				this[param.name] = param.score;
			},
		}
	}
</script>

<style lang="scss">
page{
		height: 100%;
	
	$blue:#4463f0;
	$bluetext:#fff;
	.main {
		width: 100%;
		height: 100%;
		.tops {
			height: 30%;
			text-align: center;
			background-color: $blue;
			padding:20rpx;
			margin-bottom: 20rpx;
			.logo {
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.address{
				display: flex;
				justify-content: center;
				align-items: center;
				padding:20rpx;
				margin-top: 20rpx;
				.addimg {
					width: 30rpx;
					height: 30rpx;
					font-weight: 700;
					margin-right: 20rpx;
				}
				.addtext{
					font-size: $uni-font-size-sm;
					color: #b8b9e6;
				}
			}
			.star{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				.jinpai{
					width: 100rpx;
					height: 100rpx;
				}
				.star-text{
					color: #fff;
				}		
				.vote-number {
				  vertical-align: middle;
				  font-family: 微软雅黑, Verdana, Geneva, sans-serif;
				  font-size: 12px;
				  color: #fff;
				}
			}
			
		}

		.content {
			// height: 70%;
			background-color: $uni-bg-color-grey;
			padding-bottom: 40rpx;
			.textarea{
				border-top: 1px solid $uni-border-color;
				padding:20rpx;
				margin-bottom: 30rpx;
				background-color: $uni-bg-color;
				.text-center{
					width:100%;
					height: 100rpx;
				}
			}
			.star-rating-box{
				background-color: $uni-bg-color;
				display: flex;
				justify-content: center;
				align-items: center;
				padding:10rpx ;
				
			}
			.btn{
				text-align: center;
				margin: 40rpx 0;
				.logoin{
					background-color:$uni-color-error;
					color: #fff;
				}
				.btnn{
					background-color: #4463f0;
					color: #fff;
				}
			}
			.bottom{
				text-align: center;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
				
			}
		}
	}


	.text-area {
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;
		.titlehead{
			font-size:$uni-font-size-lg;
			color: $bluetext;
		}
	}

	.title {
		font-size: 36rpx;
		color: #000;
	}
}
</style>
