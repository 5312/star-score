<template>
	<view class="star-rating" >
		<view class="star-rating-box" @touchstart='fun' @touchmove.stop.prevent='fun' >
			<image v-for="(item,i) in 10" :key="i" class="icon-start" :src="(i+1)|getSrc(score)" mode=""></image>
		</view>
		<text class="star-rating-title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name: 'star-rating',
		data() {
			return {
				iconStartSrcList: ['', '/static/delivery_icon_star_disable.png',
					'/static/delivery_icon_star_active.png'
				],
				title: '',
				width: 0,
			}
		},
		props: {
			name: {
				type: String,
				default: '',
			},
			score: {
				type: Number,
				default: 0,
			},
		},
		methods: {
			fun(e) {
				let score=Math.ceil(((e.changedTouches[0].pageX - e.currentTarget.offsetLeft)/this.width)*10);
				if(score>=10)score=10;
				if(score<=0)score=0;
				this.$emit('changeScore', {
					name: this.name,
					score,
				})
			},
			getDescBox() {
				uni.createSelectorQuery().in(this).select('.star-rating-box').boundingClientRect(result => {
					if (result) {
						this.width = result.width;
					} else {
						this.getDescBox();
					}
				}).exec();
			},
		},
		mounted() {
			this.$nextTick(() => {
				this.getDescBox()
			});
		},
		filters: {
			getSrc: function(i, score) {
				if (score == 0) return '/static/star-rating/delivery_icon_star_empty.png';
				if (score < i) return '/static/star-rating/delivery_icon_star_disable.png';
				if (score >= i) return '/static/star-rating/delivery_icon_star_active.png';
			}
		},
		watch: {
			score(val) {
				this.title = val*10+'分'
				
			}
		}
	}
</script>

<style lang="scss">
	.star-rating {
		display: flex;
		align-items: center;
		.icon-start {
			width: 40rpx;
			height: 40rpx;
			margin: 0 6rpx;
		}

		.star-rating-title {
			min-width: 69rpx;
			padding-left: 30rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
</style>
