// component/getmore/getmore.js
var App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Cuoponitem:Object,
    Cuoponindex:Number
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
      if(id){
        wx.navigateTo({
          url: '/pages/coupon/bg_detail/detail?id='+id,
        })
      }
    }
  }
})
