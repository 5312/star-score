<template>
	<view class="main">
		<!-- <u-cell-group>
			<u-cell-item 
				:value='x.all'
				:arrow="true"
				:title="x.title" 
				v-for="x,y in group"
				:key='y'
				:icon-style='style'
			>
				<u-icon slot="icon" size="60" margin-right='100rpx' :name="x.authurl"></u-icon>
			</u-cell-item>

		</u-cell-group> -->
		<view 
			class="group flex j-between a-center "
			hover-class='hover'
			v-for="x,y in group"
			:key='y'
			@click="go(x.shop_id)"
		>
			<view class="flex a-center left">
				<image :src="x.logo.file_path" class="img" mode=""></image>
				<view class="title">
					<text>{{ x.shop_name }}</text>
					<view class="detail">{{ x.address }}</view>
				</view>
			</view>
			<view class="number flex j-start a-center">
				<text>{{ x.net_f + x.admin_f }}</text>
				<image class="image" :src="rankImage(x)" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				style:{
					// marginRight:'20rpx'
				},
				group:[
				
				]
			}
		},
		onLoad(options){
			this.$api.shop({
				page_id:0,
			}).then(res => {
				this.group = res.data.list;	
				
			})
		},
		computed:{
			rankImage(e){
				 return function (x) {
				       let sum = x.net_f +x.admin_f;				       
				       if(sum >= 80) return '../../static/star-rating/jinpai.png';
				       if(sum >= 70 && sum <= 79) return '../../static/star-rating/yinpai.png';
				       if(sum >= 60 && sum <= 69) return'../../static/star-rating/tongse.png';
				       if(sum < 60) return '../../static/star-rating/heipai.png';
				 }
			 }
		},
		methods: {
			go(options){
				uni.reLaunch({
					url:`../index/index?shopid=${options}`
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	.main{
		.group{
			padding:20rpx;
			border-bottom: 1px solid #e4e7ed;
			color: #606266;
			.left{
				.title{
					font-weight: 600;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					margin-left: 20rpx;
					.detail{
						white-space: nowrap;
						width:400rpx;
						overflow: hidden;
						text-overflow:ellipsis ;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						font-weight: 400;
					}
				}
				.img{
					width:100rpx;
					height: 100rpx;
				}
			}
			
			.number{
				color:#909399;
				.image{
					width:100rpx;
					height:100rpx;
				}
			}
		}
	}
}
</style>
