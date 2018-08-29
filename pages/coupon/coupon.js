// pages/coupon/coupon.js
var server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeIndex:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    server.getJSON("/Coupon/getBuyCouponList", {
      // store_id: App.globalData.store_id
      store_id: 26
    }, function(res) {
      console.log(res)
      that.setData({
        cuoponlist: res.data.online,
        goodsCuoponlist: res.data.offline
      })
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})