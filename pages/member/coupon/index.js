var server = require('../../../utils/server');
var cPage = 0;
var ctype = "0";
Page({
  data: {
    cuopon_cart: true, //判断是不是我的优惠券页面
  },
  onLoad: function(option) {
    this.getUserCoupon();
    this.getuserCouponUsed();
    this.getUserCouponExc();
  },
  receivetap() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 可使用优惠券
  getUserCoupon: function() {
    var that = this;
    server.getJSON('/Coupon/getUserCoupon', function(res) {
      if (typeof(res.data) === "string") {
        that.setData({
          cuoponlist: []
        })
      } else {
        that.setData({
          cuoponlist: res.data
        })
      }
    });
  },
  // 已使用优惠券
  getuserCouponUsed: function() {
    var that = this;
    server.getJSON('/Coupon/getuserCouponUsed', function(res) {
      console.log(res.data)
      // if (typeof (res.data) === "string") {
      //   that.setData({
      //     cuoponlist: []
      //   })
      // } else {
      //   that.setData({
      //     cuoponlist: res.data
      //   })
      // }
    });
  },
  // 不可用优惠券
  getUserCouponExc: function() {
    var that = this;
    server.getJSON('/Coupon/getUserCouponExc', function(res) {
      console.log(res.data)
      // if (typeof (res.data) === "string") {
      //   that.setData({
      //     cuoponlist: []
      //   })
      // } else {
      //   that.setData({
      //     cuoponlist: res.data
      //   })
      // }
    });
  }
});