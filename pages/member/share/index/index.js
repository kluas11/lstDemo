var server = require('../../../../utils/server');
var app = getApp();

Page({

  data: {
    login: false,
    registerStatus: 0,
    result: '',
    disabled:true
  },

  onLoad: function(options) {
    var login = app.globalData.login;
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })
      }
    });
  },
  navigateToMember: function() {
    wx.navigateTo({
      url: '../member/list',
    })
  },
  navigateToOrder: function(e) {
    wx.navigateTo({
      url: '../order/list'
    });
  },
  navigateToWithdraw: function(e) {
    wx.navigateTo({
      url: '../withdraw/add'
    });
  },
  navigateToWithdrawList: function(e) {
    wx.navigateTo({
      url: '../withdrawlist/list'
    });
  },
  navigateToFenxiao: function(e) {
    wx.navigateTo({
      url: '../erweima/index'
    });
  },

  onShow: function() {
    var that = this;
    var login = app.globalData.login;
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    // var level = app.globalData.userInfo.level;
    // var seller_id = app.globalData.userInfo.seller_id;
    this.setData({
      login: login
    });
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({
        userInfo
      }) => {
        that.setData({
          userInfo: userInfo
        });
        app.globalData.nickName = userInfo.nickName;
      }
    });
    app.getUserBalance(user_id, that, function(that, userBalance) {
      that.setData({
        moneys: userBalance
      });
    });

    server.getJSON('/User/createShareQRCode', {
      user_id
    }, function(res) {
      console.log(res)
      that.setData({
        result: res.data.qrcode
      })
      //   if (level == 3 && (seller_id == undefined || seller_id == '' || seller_id == null)) {
      //     // 一级会员需通过输入店员账号绑定的页面
      //     that.setData({
      //       registerStatus: 1
      //     })
      //   } else {
      //     var result = res.data
      //     console.log(result)
      //     that.setData({
      //       result: result,
      //       registerStatus: 2
      //     });
      // }
    });
  },

  saveQRCode: function() {
    let ctx = this;
    this.setData({
      disabled:false
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
        }else{
          ctx.downloadimg()
        }
      }
    })
  },
  // 保存图片
  downloadimg() {
    let ctx = this;
    wx.downloadFile({
      url: ctx.data.result,
      success: function(res) {
        console.log(res)
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
          },complete(){
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