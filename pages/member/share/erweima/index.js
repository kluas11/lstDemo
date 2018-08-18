var server = require('../../../../utils/server');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    staffAccount: '',
    staffName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
  },

  accountInput: function(e) {
    const val = e.detail.value;
    this.setData({
      staffAccount: val
    })
  },

  nameInput: function(e) {
    const val = e.detail.value;
    this.setData({
      staffName: val
    })
  },

  formSubmit: function() {
      seller_id = this.data.staffAccount,
      seller_name = this.data.staffName
    server.newpostJSON("/User/apply_user_level", {
        seller_id,
        seller_name
      },
      function(res) {
        if (res.data.status) {
          wx.showToast({
            title: '申请成功，请等待审核',
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 5000
          })
        }
      }
    )
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var user_id = wx.getStorageSync("user_id");
    return {
      title: '乐善亭',
      desc: '乐善亭',
      path: '/pages/index/index?uid=' + user_id
    }
  },
})