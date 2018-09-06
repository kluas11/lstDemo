// component/getmore/getmore.js
Component({
  /**
   * 组件的属性列表
   * Cuoponitem 优惠券详情
   * Cuoponindex 该优惠券在优惠券列表的排序
   * select_index 确认订单页面选择的优惠券序号
   * Cuopon  是否为优惠券中心页面 传值为是  不传为否
   */
  properties: {
    Cuoponitem: Object,
    Cuoponindex: Number,
    select_index: null,
    Cuopon:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailTap(e) {
      let id = e.currentTarget.dataset.id; 
      if (id && !this.properties.Cuopon) {
        wx.navigateTo({
          url: '/pages/coupon/b_detail/b_detail?id=' + id,
        })
      }
    }
  },
  ready:function(){
    
  }
})