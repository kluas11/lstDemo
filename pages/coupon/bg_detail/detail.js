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
    this.getcouponInof();
  },
  getcouponInof() {
    let that = this;
    server.getJSON("/Coupon/getOlCouponDetails", {
      id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.setData({
          couponInfo: res.data
        })
        that.getCodeTimer(res.data.coupon_sn);
      }
    })
  },
  // 获取条形码
  getCodeTimer(code) {
    barQRCode.qrcode('myQrcode', code, 300, 300);
  },
  // 请求转发接口，现在无法获取到是否转发成功的回调，所以暂时在点击赠送是调用
  giveOlCoupon(id) {
    let that = this;
    server.newpostJSON("/Coupon/giveOlCoupon", {
      id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.getcouponInof();
      } else {
        wx.showModal({
          content: '赠送失败',
          showCancel: false
        })
      }
    })
  },
  shareTap() {
    this.giveOlCoupon(id);
  },
  // 赠送
  onShareAppMessage: function() {
    return {
      title: this.data.couponInfo.name,
      path: `/pages/coupon/receive/receive?objectId=${id}&coupon_type=offline`
    }
  }
})