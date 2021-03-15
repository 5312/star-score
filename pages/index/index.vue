<template>
	<view class="main">
		<view class="banner">
			<image class="bannerImg" src="../../static/banner.jpg" mode=""></image>
		</view>
		<u-tabs-swiper ref="uTabs" name="name" :list="tabList" :is-scroll="true" :current="current" @change="tabsChange"></u-tabs-swiper>
		<!-- 间隔 -->
		<view class="tab-bar-line"></view>
		<!-- 间隔 -->
		<swiper class="tab-box" ref="swiper1" :current="tabIndex" :duration="300" @transition='transition' @animationfinish='animationfinish'>
			<swiper-item class="swiper-item" v-for="(page, index) in tabList" :key="index">
				<ItemPage class="page-item" :pid="page.category_id" :ref="'page' + index"></ItemPage>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	import ItemPage from './item-page.vue'
	export default {
		components: {
			ItemPage
		},
		data() {
			return {
				current: 0,
				tabIndex: 0,
				tabList: [
					{
						name:'全部',
						category_id:''
					}
				],
				page:1,
				oneList:null
			}
		},
		onLoad(options) {
			// 首页全部
			this.getData()
		},
		methods: {
			getData(){
				this.$api.shop({
					page: this.page,
					shop_class: '',
				}).then(res => {
					let obj = res.data.catgory;
					for (let i in obj) {
						this.tabList.push(obj[i])
					}
				})
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// tabs通知swiper切换
			tabsChange(index) {
				// this.current = index;
				this.tabIndex = index;
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;

		.main {
			height: 100%;
			// overflow-y: auto;
			background-color: #f8f8f8;

			.banner {
				width: 100%;
				height: 309rpx;

				.bannerImg {
					width: 100%;
					height: 100%;
				}
			}

			.tab-box {
				height: calc(100% - 389rpx);
				// .swiper-item{
				// 	overflow: auto;
				// }
				// .page-item{
				// 	height: calc(100% - 389rpx);
				// 	overflow: auto;
				// }
			}
		}

	}
</style>
