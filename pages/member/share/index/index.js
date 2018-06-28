const AV = require('../../../../utils/av-weapp.js');
var server = require('../../../../utils/server');
var app = getApp();
var maxTime = 60;
var interval = null;
var currentTime = -1; //倒计时的事件（单位：s）  

Page({

  data: {
    login: false,
    time: '获取验证码',
    registerStatus: 0,
    result: ''
  },

  onLoad: function (options) {
    var login = app.globalData.login;
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    });
  },

  navigateToMember: function () {
    wx.navigateTo({ url: '../member/list', })
  },
  navigateToOrder: function (e) {
    wx.navigateTo({ url: '../order/list' });
  },
  navigateToWithdraw: function (e) {
    wx.navigateTo({ url: '../withdraw/add' });
  },
  navigateToWithdrawList: function (e) {
    wx.navigateTo({ url: '../withdrawlist/list' });
  },
  navigateToFenxiao: function (e) {
    wx.navigateTo({ url: '../erweima/index' });
  },

  onShow: function () {
    var that = this;
    var login = app.globalData.login;
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id;

    this.setData({ login: login });
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        that.setData({
          userInfo: userInfo
        });
        app.globalData.nickName = userInfo.nickName;
      }
    });

    app.getUserBalance(app.globalData.userInfo.user_id, that, function (that, userBalance) {
      that.setData({
        moneys: userBalance
      });
    });

    server.getJSON('/User/createrweima?user_id=' + user_id, function (res) {
      console.log(res)
      if (res.data.status == 1) {
        // 一级会员需通过输入店员账号绑定的页面
        that.setData({
          registerStatus: 1
        })
      } else {
        var result = res.data
        console.log(result)
        that.setData({
          result: result,
          registerStatus: 2
        });
      }
    });
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
