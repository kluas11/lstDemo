// component/getmore/getmore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Cuoponitem: Object,
    Cuoponindex: Number
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
      if (id) {
        wx.navigateTo({
          url: '/pages/coupon/b_detail/b_detail?id=' + id,
        })
      }
    }
  }
})