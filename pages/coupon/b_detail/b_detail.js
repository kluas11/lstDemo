// pages/coupon/b_detail/b_detail.js
var server = require('../../../utils/server');
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
    let that = this;
    let id = options.id;
    let coupon_id = options.coupon_id;
    let api ;
    let data;
    if (id){
      server.getJSON("/Coupon/getCouponDetails", { id }, function (res) {
        if (typeof (res.data) != "string") {
          that.setData({
            couponInfo: res.data.online,
            online:true
          })
        }
      })
    } else if (coupon_id){
      server.getJSON("/Coupon/getBuyCouponDetails", { coupon_id }, function (res) {
        if (typeof (res.data) != "string") {
          that.setData({
            couponInfo: res.data,
            online:false
          })
        }
      })
    }else{
      return;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})