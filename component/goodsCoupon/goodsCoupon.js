// component/getmore/getmore.js
var App = getApp();
Component({
  /**
   * 组件的属性列表
   * Cuoponitem 优惠券详情 
   * Cuoponindex 该优惠券在优惠券列表的排序
   * Cuopon  是否为优惠券中心页面 传值为是  不传为否
   * tabtype 我的优惠券查看状态  我的优惠券传值
   *
   * 
   */
  properties: {
    Cuoponitem:Object,
    Cuoponindex:Number,
    Cuopon: Boolean,
    tabtype: {
      type: String,
      value: "getUserCoupon"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods_oss: App.image_oss + '150_150',
    top_img2: '/images/coupon_top2.png',
    top_img: '/images/coupon_top.png'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    detailTap(e){
      let id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      let outtime = this.properties.tabtype == 'getUserCouponExc' ? "true" : '';
      if (id && !this.properties.Cuopon && status !='SHARING'){
        wx.navigateTo({
          url:  `/pages/coupon/bg_detail/detail?id=${id}&outtime=${outtime}`,
        })
      }
    }
  }
})
