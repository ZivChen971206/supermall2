import{
ADD_COUNTER,
ADD_TO_CART
} from "@/store/mutation-types";

export default {
  //mutation唯一的目的就是修改state中状态
  //mutation中的每个方法尽可能完成的事件比较单一一点
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
