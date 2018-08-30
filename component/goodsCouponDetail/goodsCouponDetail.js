// component/getmore/getmore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Cuoponitem: Object,
    Cuoponindex: Number
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
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
          url: '/pages/coupon/bg_detail/detail?id=' + id,
        })
      }
    }
  }
})
