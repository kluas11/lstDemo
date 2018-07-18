
var server = require('./utils/server');
var md5 = require('./utils/md5.js');
// 授权登录 
App({
  onLaunch: function () {
    // auto login via SDK
    var that = this;
    //AV.User.loginWithWeapp();
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },

  getOpenId: function (cb) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //console.log(res.code);
          server.getJSON("/User/getOpenid", {
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx01555ce453e1ee21&secret=03dc41bec70e309772cb5e81cc8bab49&js_code=' + res.code + '&grant_type=authorization_code&code=' + res.code
          }, function (res) {
            // 获取openId
            var openId = res.data.openid;
            // console.log(res);
            // TODO 缓存 openId
            that.globalData.openid = openId;
            //验证是否关联openid
            typeof cb == "function" && cb()
          });
          //发起网络请求
        }
      }
    });
  },
  
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  // 获取用户地址信息
  get_getLocation() {
    var that = this;
    wx.getLocation({
      success(res) {

      },
      fail() {
        wx.openSetting({
          complete() {
            wx.getSetting({
              success(res) {
                console.log(res.authSetting)
                if (!res.authSetting['scope.userLocation']) {
                  that.get_getLocation();
                }
              }
            })
          }
        })
      }
    })
  },
  getUserBalance: function (user_id, ctx, func) {
    server.getJSON("/Scanpay/get_userInfo", { user_id: user_id }, function (res) {
      let userBalance = new Number(res.data.user_money).toFixed(2);
      func(ctx, userBalance);
    });
  },

  globalData: {
    'openid': null,
    'userInfo': null,
    'login': false,
    'shopName': ''
  }
})
