<template>
	<view class="wrap">
	<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
		<view  class="group flex j-between a-center " hover-class='hover' v-for="x,y in group" :key='y' @click="go(x.shop_id)">
			<view class="flex a-top left">
				<image :src="x.logo.file_path" class="img" mode=""></image>
				<view class="title">
					<view class="shop_name">{{ x.shop_name }}</view>
					<view class="number flex j-start a-center">
						<text>{{ x.net_f + x.admin_f }}分</text>
						<image class="image" :src="rankImage(x)" mode=""></image>
					</view>
					<view class="detail">{{ x.address }}</view>
				</view>
				<view class="right">
					<u-icon class="icon" name="more-dot-fill" color="#ddd" size="35"></u-icon>
					<view class="  height">&nbsp; </view>
					<!-- <u-tag class=" " :text="pageClass" type="primary" mode="dark" size="mini" /> -->
				</view>
			</view>
		</view>
		<u-empty v-if="group.length == 0 " text="暂无数据" mode="list"></u-empty>
	</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'Item-page',
		props: {
			pid: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				group: [],
				page:1,
				load:true,
			}
		},
		created(){
			this.loadData()
		},
		computed: {
			rankImage(e) {
				return function(x) {
					let sum = x.net_f + x.admin_f;
					if (sum >= 80) return '../../static/star-rating/jinpai.png';
					if (sum >= 70 && sum <= 79) return '../../static/star-rating/yinpai.png';
					if (sum >= 60 && sum <= 69) return '../../static/star-rating/tongse.png';
					if (sum < 60) return '../../static/star-rating/heipai.png';
				}
			}
		},
		methods: {
			loadData(){
				if(!this.load) return; 
				this.$api.shop({
					page:this.page,
					shop_class: this.pid,
				}).then(res => {
					let data = res.data.list.data;
					if(data.length == 0){
						this.page = this.page - 1;// 没数据页面就不增加
						this.load = false;
					}
					for (let i = 0; i < data.length; i++) {
						this.group.push(data[i])
					}
				})
			},
			loadMore(){
				this.page += 1;
				if(!this.load){
					uni.showToast({
						title:'没有数据了',
						icon:"none"
					})
					return;
				}
				this.loadData()
			},
			go(options) {
				uni.reLaunch({
					url: `../list/list?shopid=${options}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.listview {
	  position: absolute;
	  left: 0;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  /* #ifndef APP-NVUE */
	  display: flex;
	  flex-direction: column;
	  /* #endif */
	  /* #ifndef MP-ALIPAY */
	  flex-direction: column;
	  /* #endif */
	}
	.wrap{
		.group {
			width: auto !important;
			margin: 20rpx;
			padding: 25rpx;
			color: #606266;
			background-color: #fff;
			border-radius: 16rpx;
		
			.left {
				.right {
					text-align: right;
					white-space: nowrap;
					width: 100rpx;
		
					.icon {
						margin-bottom: 24rpx;
						transform: rotate(90deg);
					}
		
					.height {
						height: 70rpx;
						line-height: 70rpx;
						font-size: $uni-font-size-base;
					}
				}
		
				.title {
					margin-left: 20rpx;
		
					.detail {
						white-space: nowrap;
						width: 300rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						font-weight: 400;
					}
		
					.shop_name {
						white-space: nowrap;
						width: 350rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						font-weight: 600;
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						margin-bottom: 20rpx;
					}
		
					.number {
						color: #ee6300;
						font-weight: 600;
		
						.image {
							width: $uni-img-size-lg;
							height: $uni-img-size-lg;
						}
					}
				}
				.img {
					width: 180rpx;
					height: 180rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
