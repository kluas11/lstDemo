// pages/coupon/receive/receive.js
var server = require('../../../utils/server');
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: {
      "id": 28,
      "olcoupon_id": 1,
      "name": "测试线下券",
      "details": "iphone一台 - 100 元",
      "status": "NORMAL",
      "start_time": 100,
      "end_time": 3294967295,
      "canshare": 1,
      "buy_way": "MONEY",
      "buy_price": 50.00,
      "origin_buy_price": 100.00,
      "buy_paypoint": 0,
      "image": "https://lst.paycore.cc/goods/20180717/dcce6547b59cdaecd370b54a8de40d81767eebbc.png",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    let that = this;
    App.getsetting().then(() => {
      server.getJSON("/Coupon/getOlCouponDetails", {
        id: options.id
      }, function(res) {
        if (typeof(res.data) != "string") {
          that.setData({
            coupon: res.data
          })
        }
      })
    })
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

  }
})