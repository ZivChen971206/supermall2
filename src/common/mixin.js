import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data(){
    return{
      itemListenerMixin:null,
      newRefresh:null,
    }
  },
    mounted(){
      //1.图片加载完成的事件监听
      this.newRefresh = debounce(this.$refs.scroll.refresh, 100)

      this.itemImgListener=()=>{
        this.newRefresh()
      }
      this.$bus.$on("itemImgLoad", this.itemImgListener);
    }

  }
