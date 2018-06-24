var server = require('../../../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    whichPage: 0,
    staffAccount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var app = getApp();
    var user_id = app.globalData.userInfo.user_id
    console.log(user_id)
    server.getJSON('/User/createrweima?user_id=' + user_id, function (res) {
      if (res.data.status == 1) {
        // 一级会员需通过输入店员账号绑定的页面
        that.setData({
          whichPage: 1
        })
      } else {
        var result = res.data
        console.log(result)
        that.setData({
          result: result,
          whichPage: 2
        });
      }
    });

  },

  accountBlur: function (e) {
    const val = e.detail.value;
    this.setData({
      staffAccount: val
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id);
    return {
      title: '颐正养生',
      desc: '颐正养生',
      path: '/pages/index/index?uid=' + user_id
    }
  },

  saveQRCode: function () {
    let ctx = this;

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })

    wx.downloadFile({
      url: ctx.data.result,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '已保存到相册'
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })

  }
})