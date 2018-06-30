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
    var app = getApp();
    var user_id = app.globalData.userInfo.user_id
    console.log(user_id)
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
    wx.request({
      url: 'https://shop.poopg.com/index.php/WXAPI/User/apply_user_level',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        seller_id: this.data.staffAccount,
        seller_name: this.data.staffName
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.status == true) {
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
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id);
    return {
      title: '颐正养生',
      desc: '颐正养生',
      path: '/pages/index/index?uid=' + user_id
    }
  },
})