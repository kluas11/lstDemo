// pages/coupon_detail/coupon_detail.js
var server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let olcoupon_id = options.olcoupon_id;
    let that = this;
    server.getJSON("/Coupon/getBuyOlCouponDetails", {
      olcoupon_id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.setData({
          couponInfo: res.data
        })
      }
    })
  }
})