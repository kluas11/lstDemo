var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var app = getApp();
// pages/getUser/getUser.js
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
    var that = this;
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

  },
  onGotUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.getOpenId(function() {
        app.register(function() {
          getApp().globalData.login = true;
          // app.globalData.userInfo.avatarUrl = app.globalData.userInfo.head_pic;
          // app.globalData.userInfo.nickName = app.globalData.userInfo.nick_name;
          // app.globalData.userInfo = app.globalData.userInfo;
          // console.log(app.globalData.userInfo);return;

          // TODO 2018年6月21日 【修改】 顾客扫码支付，但未授权/注册。则注册完成后，回退上一页
          wx.navigateBack({
            delta: 1
          })
        });
      });
    }
  },
})