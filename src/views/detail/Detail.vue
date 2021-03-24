<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <Scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
    >
      <!--     属性：topImages 传入值:top-images-->

      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>


    </Scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll"
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";


import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
import {itemListenerMixin} from "@/common/mixin";
import {debounce} from "@/common/utils";

import {mapActions} from 'vuex'



export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,

    Scroll,
    GoodsList,
    BackTop,

  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop:false

    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      //1.获取顶部的图片轮播数据
      const data = res.result
      this.topImages = res.result.itemInfo.topImages

      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //7.取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

    })

    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    //4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []

      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)

    }, 200)


  },
  mounted() {
  },
  updated() {

  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.newRefresh()
      this.getThemeTopY()

    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -(this.themeTopYs[index]), 200)
    },
    backClick() {
      this.$refs.scroll.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      //1.获取y值
      const positionY = -position.y

      //2.positionY和主题中值进行对比
      let length = this.themeTopYs.length
      for (let i = 0; i < length-1; i++) {
        if (this.currentIndex !== i &&
          ( positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2.将商品添加到购物车里
      this.addCart(product).then(res=>{
        this.$toast.show(res,1500)

        console.log(this.$toast)
      })
      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res)
      // })
    }
  }
}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 999;
  background-color: #fff;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>
