var server = require('../../../../utils/server');
var app = getApp();
Page({
  data: {
    login: false,
    registerStatus: 0,
    result: '',
    disabled: true
  },
  onLoad: function(options) {
    var that = this;
    var login = app.globalData.login;
    var that = this;
    this.setData({
      login: login
    });
    server.getJSON('/User/createShareQRCode', function(res) {
      console.log(res)
      that.setData({
        result: res.data.qrcode
      })
    });
  },
  //我的团队
  navigateToMember: function() {
    wx.navigateTo({
      url: '../member/list',
    })
  },
  // 申请会员
  navigateToFenxiao: function(e) {
    wx.navigateTo({
      url: '../erweima/index'
    });
  },
  saveQRCode: function() {
    let ctx = this;
    this.setData({
      disabled: false
    })
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              ctx.downloadimg()
            },
            fail() {
              wx.openSetting({
                success() {
                  ctx.downloadimg()
                }
              });
              return;
            }
          })
        } else {
          ctx.downloadimg()
        }
      }
    })
  },
  // 保存图片
  downloadimg() {
    let ctx = this;
    wx.showLoading()
    wx.downloadFile({
      url: ctx.data.result,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '已保存到相册'
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          },
          complete() {
            ctx.setData({
              disabled: true
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
        ctx.setData({
          disabled: true
        })
      }
    })
  }
})