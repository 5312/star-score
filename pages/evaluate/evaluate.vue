<template>
	<view class="main">
		<view class="evaluate">
			<!-- 综合评价 -->
			<view class="header flex  a-center">
				<view class="left">
					<view class="show">综合评分</view>
					<!-- <view class="shuoming">网评+监管局</view> -->
					<view>{{ net_f*1 + admin_f*1 }}分</view>
				</view>
				<view class="icon">
					<view class="top">
						<text >网&emsp;评：</text>
						<text>{{ net_f}}分</text>
					</view>
					<view class="bottom">
						<text>监管局：</text>
						<text>{{ admin_f }}分</text>
					</view>
					<!-- <view class="vote-star">
						<view class="i" :style="{ width:width,height:'100%'}"></view>
					</view> -->
				</view>
				<view class="pai">
					<image :src="jinpai" mode=""></image>
					<text class="font-lg"  :style="{ color:'#ec9a05' }">金牌</text>
				</view>
			</view>
		</view>
		<!-- 分类 全部 好评-中评-差评-有图-->
		<view class="category">
			<view 
				v-for="x,y in category" 
				:key='y'   
				class='select-tag'
				:class="{ 'light':select != y,'dark':select == y}"
				@click="onSelect(y)"
			>
			{{ x.text +'('+x.num+')'}}
			</view>
		</view>
		<!-- 用户评价 -->
		<view class="people">
			<!-- 每列 -->
			<view 	
				class="once"
				v-for="x,y in group"
				:key="y"
			>
				<view class="top flex j-start a-center">
					<u-avatar :src="x.user.avatarUrl" size='mini'></u-avatar>
					<text class="title">{{ x.user.nickName }}</text>
				</view>
				<view class="detail">
					{{ x.create_time}}
				</view>
				<view class="others  flex  a-center">
					<view class="box">
						<view class="text">价格</view>
						<view>{{ x.p1 }}</view>
					</view>
					<view class="box">
						<view class="text">质量</view>
						<view>{{ x.p2 }}</view>
					</view>
					<view class="box">
						<view class="text">售后</view>
						<view>{{ x.p3 }}</view>
					</view>
					<view class="box">
						<view class="text">安全</view>
						<view>{{ x.p5 }}</view>
					</view>
					<view class="box">
						<view class="text">环保</view>
						<view>{{ x.p6 }}</view>
					</view>
					<view class="box l-height">
						<view class="text">满意度</view>
						<view>{{ x.p4 }}</view>
					</view>
				</view>
				<view class="content">
					<view class="text">{{ x.msg}}</view>
					<view class="imgbox flex  a-center">
						<image class="img" :src="'https://xishui.ydeshui.com/'+item" mode="" v-for="item,i in x.images.split(',')" :key='i'>{{}}</image>
						<!-- {{x.images.split(',')[0]}} -->
					</view>
					
				</view>
				<view class="line">
					<u-line color="#ddd" />
				</view>
			</view>
			<view class="more">
					<u-loadmore :status="status"  :load-text="loadText" @loadmore='loadmore' />
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:'loadmore',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				jinpai:null,
				net_f:null,
				admin_f:null,
				width:'90%',
				select:0,
				page:1,
				group:[
					
				],
				category:[
					{
						text:'全部',
						num:'11.2万'
					},
					{
						text:'好评',
						num:'100'
					},
					{
						text:'中评',
						num:'203'
					},
					{
						text:'差评',
						num:'50'
					}
					],
			}
		},
		onLoad(options){
			// 参数
			this.net_f = options.net_f;
			this.admin_f = options.admin_f
			this.jinpai = options.jinpai;
			this.shop_id = options.shopid;
			// 获取数据
			this.getDetail(this.page)
			
		}, 
		methods: {
			loadmore(){
				this.page+=1;
				
				this.getDetail(this.page)
			},
			getDetail(page){
				this.status = 'loading'
				// 评论列表
				this.$api.list({
					shop_id:this.shop_id,
					type:this.select,
					page:page
				}).then(res => {
					if(res.data.list.data.length != 0){
						
						this.status = 'loadmore'
					}else{
						this.status = 'nomore'
						// return
					}
					let list = res.data.list.data
					list.forEach((x,y) => {
						this.group.push(x)
					})
					
					// 全部
					this.category[0].num = res.data.zong[0];
					// 好评
					this.category[1].num = res.data.zong[1];
					// 中评
					this.category[2].num = res.data.zong[2];
					// 差评
					this.category[3].num = res.data.zong[3];
					
				})
				
			},
			onSelect(y){
				this.select = y;// 选中
				this.page = 1  ;// 切换时 页码归零
				this.group = []; // 清空
				this.getDetail(this.page)
			}
		}
	}
</script>

<style lang="scss">
$tag-bg-color:#fef0f0;
$tag-bg-select:#fa3534;
.main{
	.evaluate{
		.header{
			padding:20rpx 0;
			justify-content: space-around;
			.left{
				font-size: 60rpx;
				color: #EE7707;
				padding:20rpx;
				.show{
					font-size: 24rpx;
					color: #c1c1c1;
				}
			}
			.icon{
				view{
					padding:10rpx;
						
				}
				// text-align: center;
				.vote-star{
					height: 50rpx;
					width:300rpx;
					background: url(../../static/star-rating/star.png) 0 15rpx / 30rpx 30rpx  repeat-x;
					.i{
						height: 50rpx;
						background: url(../../static/star-rating/starsyellow1.png) 0 15rpx / 30rpx 30rpx  repeat-x;
					}
				}
			}
			.pai{
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width:100rpx;
					height: 100rpx;
				}
				.font-lg{
					font-size: $uni-font-size-lg;
				}
			}
		}
	}
	.category{
		border-top: 1rpx solid #e3e1e8;
		border-bottom: 1rpx solid #e3e1e8;
		padding:10rpx;
		width:100%;
		white-space: pre-wrap;
		font-size: $uni-font-size-sm;
		.select-tag{
			display: inline-block;
			padding:10rpx 20rpx;
			margin:10rpx 10rpx;
			// border-radius: 8rpx;
			color: #fff;
			white-space: nowrap;
		}
		.light{
			color: #000;
			// background-color:$tag-bg-color;
			// border: 1px solid #dd6161;
			// color:#fa3534;
		}
		.dark{
			color: #000;
			position: relative;
			&::after{
				content: '';
				width:80rpx;
				position: absolute;
				bottom: -20rpx;
				left: 0;
				right: 0;
				margin: auto;
				border-bottom: 4rpx solid $tag-bg-select;
			}
		}
	}
	.people{
		padding-bottom: 40rpx;
		.once{
			.line{
				margin-top: 20rpx;
				padding:0;
			}
			padding:40rpx 40rpx 0rpx 40rpx;
			.top{
				.title{
					margin-left: 20rpx;
					font-weight: 700;
					font-size: $uni-font-size-base;
				}
			}
			.detail{
				font-size: $uni-font-size-sm ;
				color: $uni-text-color-disable;
				margin-bottom: 20rpx;
			}
			.others{
				justify-content: space-around;
				padding:10rpx 0;
				border: 1px solid #ddd;
				margin-bottom: 30rpx;
				// margin-left: 20rpx;
				.box{
					text-align: center;
					margin: 0 5rpx;
					color:  #EE7707;
					font-size: $uni-font-size-lg;
					.text{
						white-space: nowrap;
						color: #000;
						font-size: $uni-font-size-sm;
					}
				}
				.l-height{
					position: relative;
					// &::before{
					// 	display: block;
					// 	content: '';
					// 	width: 4rpx;
					// 	height:55rpx;
					// 	position: absolute;
					// 	top:0;
					// 	bottom: 0;
					// 	left: -5rpx;
					// 	margin: auto;
					// 	border-left: 4rpx solid #ddd;
					// }
				}
				
			}
			.content{
				.text{
					// padding-left: 10rpx;
					font-size: $uni-font-size-lg;
					margin-bottom: 10rpx;
				}
				.imgbox{
					flex-flow: wrap;
					.img{
						width:200rpx;
						height: 200rpx;
						margin: 10rpx;
					}
				}
				
			}
		}
		.more{
			padding:30rpx 0;
		}
	}
}
</style>
