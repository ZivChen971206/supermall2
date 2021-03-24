<template>
  <div class="cart">
    <!--    导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
      v
    </nav-bar>
    <scroll class="content">
      <!--    商品的列表-->
      <cart-list></cart-list>
    </scroll>

    <!--    底部汇总-->
<cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import Scroll from "@/components/common/scroll/Scroll";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

import {mapGetters} from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    Scroll,
    CartBottomBar
  },
  computed: {
    ...mapGetters({
      length: 'cartLength',
    })
  },

}
</script>

<style scoped>
.cart {
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 49px - 40px);
  overflow: hidden;
}


.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: bold;
}
</style>
