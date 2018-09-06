// pages/coupon/detail/detail.js
var server = require('../../../utils/server');
var barQRCode = require('../../../utils/Bar-QR-code');
let id;
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
    id = options.id;
    let that = this;
    server.getJSON("/Coupon/getOlCouponDetails", {
      id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.setData({
          couponInfo: res.data
        })
        that.getCodeTimer(res.data.coupon_sn);
        // that.giveOlCoupon(id);
      }
    })
  },
  // 获取条形码
  getCodeTimer(code) {
    barQRCode.qrcode('myQrcode', code, 300, 300);
  },
  // 获取优惠券赠送id
  giveOlCoupon(id) {
    let that = this;
    server.newpostJSON("/Coupon/giveOlCoupon", {
      id
    }, function(res) {
      if (typeof(res.data) != "string") {
        console.log(res.data)
        // that.setData({
        //   couponInfo: res.data
        // })
        // that.getCodeTimer(res.data.coupon_sn)
      }
    })
  },
  // 赠送
  onShareAppMessage: function() {
    return {
      title: this.data.couponInfo.name,
      path: '/pages/coupon/receive/receive?id='+id,
      complete:function(){
        console.log(1111111111)
      }
    }
  }
})