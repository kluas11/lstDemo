var server = require('../../../utils/server');
const App = getApp();
Page({
  data: {
    goods_oss: App.image_oss + '130_150',
    wx_loading: true,
    order_id: '',
    onShow: false
  },
  //退款
  refund: function(e) {
    console.log(e.currentTarget.dataset.goods)
    let obj = e.currentTarget.dataset.goods
    //如果可以退款
    if (obj.refund_count === "0" || obj.refund_count === "1" && obj.refund_status === "FAIL") {
      wx.navigateTo({
        url: './request_refund/request_refund?order_id=' + this.data.order_id + '&id=' + obj.id
      })
    } else {
      wx.navigateTo({
        url: '/pages/member/refund/details/details?refund_id=' + obj.refund_id,
      })
    }
  },
  //批量退款
  batch: function() {
    wx.navigateTo({
      url: './batch_selection/batch_selection?order_id=' + this.data.order_id,
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
          wx_loading: false,
          onShow: true
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
    let _this = this
    if (_this.data.onShow) {
      server.getJSON('/Order/orderDetails', {
          order_id: _this.data.order_id
        },
        function(res) {
          let result = res.data;
          console.log(result)
          _this.getshipping(result.status)
          _this.setData({
            result: result,
            CouponAmount: result.discount_coupon_amount,
            couponInfo: result.couponInfo,
            wx_loading: false
          })
        })
    }
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})