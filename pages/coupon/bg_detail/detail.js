// pages/coupon/detail/detail.js
var server = require('../../../utils/server');
var barQRCode = require('../../../utils/Bar-QR-code');
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
    let id =options.id;
    let that = this;
    server.getJSON("/Coupon/getOlCouponDetails", {
      id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.setData({
          couponInfo: res.data
        })
        that.getCodeTimer(res.data.coupon_sn)
      }
    })
  },
  // 获取条形码
  getCodeTimer(code) {
    barQRCode.qrcode('myQrcode', code, 300, 300);
  }
})