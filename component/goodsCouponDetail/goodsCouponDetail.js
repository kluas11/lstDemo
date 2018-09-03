// component/getmore/getmore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Cuoponitem: Object,
    type: String,
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的初始数据
   */
  data: {
    Cuoponitem: '',
    down: true,
    tapimg: '/images/down.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查看更多商品
    moreTap() {
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: "ease",
      })
      let goods_h;
      if (this.data.down) {
        let goods = this.properties.Cuoponitem.goods_list;
        goods_h = this.getgoods_h(goods);
        animation.height(goods_h).step()
        this.setData({
          goods: this.properties.Cuoponitem.goods_list,
          down: false,
          tapimg: '/images/up.png',
          animationData: animation.export()
        })
      } else {
        let goods = this.properties.Cuoponitem.goods_list.slice(0, 3);
        goods_h = this.getgoods_h(goods);
        animation.height(goods_h).step()
        this.setData({
          goods,
          down: true,
          tapimg: '/images/down.png',
          goods_h
        })
      }
    },
    getgoods_h(goods) {
      let goods_h = ((19 * goods.length) + 20 + 1) * 2 + "rpx";
      return goods_h;
    }
  },
  ready: function() {
    console.log(this.properties.Cuoponitem)
    let goods = this.properties.Cuoponitem.goods_list;
    let goods_h;
    let hasmore = false;
    if (goods.length > 3) {
      goods = goods.slice(0, 3);
      hasmore = true;
    }
    goods_h = this.getgoods_h(goods);
    // console.log(goods_h)
    this.setData({
      goods,
      hasmore,
      goods_h
    })
  }
})