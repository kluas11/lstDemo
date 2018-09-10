var server = require('../../../utils/server');
const App = getApp();
Page({
  data: {
    goods_oss: App.image_oss + '130_150',
    wx_loading: true,
    order_id: ''
  },
  //退款
  refund: function(e) {
    console.log(e)
    wx.navigateTo({
      url: './request_refund/request_refund?order_id=' + this.data.order_id + '&goods_id=' + e.currentTarget.dataset.goods.goods_id
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var app = getApp();
    var order_id = options.order_id;
    this.setData({
      order_id: options.order_id
    })
    server.getJSON('/Order/orderDetails', {
        order_id
      },
      function(res) {
        var result = res.data;
        console.log(result)
        that.getshipping(result.status)
        that.setData({
          result: result,
          CouponAmount: result.discount_coupon_amount,
          couponInfo: result.couponInfo,
          wx_loading: false
        });
      });
  },
  getshipping(shipping_code) {
    var that = this;
    server.getJSON('/Order/getShippingMsg', {
        shipping_code
      },
      function(res) {
        var result = res.data;
        that.setData({
          disabled: !result.status,
          shipping_status: result.shipping_status ? result.shipping_status : '',
        })
      });
  },
  // 配送信息
  shippingTap() {
    wx.showModal({
      content: this.data.shipping_status,
      showCancel: false
    })
  },
  details: function(e) {
    var no = e.currentTarget.dataset.no;
    wx.navigateTo({
      url: '/pages/details/details?no=' + no,
      success: function(res) {
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})