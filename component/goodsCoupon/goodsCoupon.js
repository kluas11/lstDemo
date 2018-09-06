// component/getmore/getmore.js
var App = getApp();
Component({
  /**
   * 组件的属性列表
   * Cuoponitem 优惠券详情 
   * Cuoponindex 该优惠券在优惠券列表的排序
   * Cuopon  是否为优惠券中心页面 传值为是  不传为否
   * 
   */
  properties: {
    Cuoponitem:Object,
    Cuoponindex:Number,
    Cuopon: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods_oss: App.image_oss + '150_150',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailTap(e){
      // 已购买的优惠券才有id  
      let id = e.currentTarget.dataset.id;
      if (id && !this.properties.Cuopon){
        wx.navigateTo({
          url: '/pages/coupon/bg_detail/detail?id='+id,
        })
      }
    }
  }
})
