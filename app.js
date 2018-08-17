var server = require('./utils/server');
var md5 = require('./utils/md5.js');
// 授权登录 
App({
  onLaunch: function() {
    // auto login via SDK
    var that = this;
    //AV.User.loginWithWeapp();
    // 设备信息
    wx.getSystemInfo({
      success: function(res) {
        that.screenWidth = res.windowWidth;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  getsetting(pages,options) {
    return new Promise((reslove, reject) => {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.userInfo"]) {
            var url = pages[pages.length - 1].route;
            if (options){
              url = url + "&id=" + options
            }
            wx.redirectTo({
              url: '/pages/login/login?url='+url,
            })
          } else {
            reslove();
          }
        }
      })
    })
  },
  // 登录注册
  getlogin() {
    var leader;
    wx.getStorage({
      key: 'scene',
      success: function(res) {
        leader = res.data ? res.data : "";
        // console.log(res.data);
      }
    })
    return new Promise((request, rej) => {
      const that = this;
      wx.login({
        success(data) {
          if (data.code) {
            that.getuser().then((wx_name) => {
              server.newpostJSON(
                "/User/login", {
                  code: data.code,
                  wx_name,
                  leader
                },
                function(data) {
                  if (data.data.status) {
                    that.globalData.userInfo = {
                      user_id: data.data.user_id
                    };
                    that.globalData.openid = data.data.openid
                    // 全局app变量
                    var user = that.globalData.userInfo;
                    //本地缓存
                    wx.setStorageSync("user_id", user.user_id)
                    that.globalData.login = true;
                    request(user.user_id)
                  }
                });
            })

          }
        }
      })
    })
  },
  getuser() {
    return new Promise((reslove, reject) => {
      wx.getUserInfo({
        success: function(res) {
          reslove(res.userInfo.nickName)
        }
      })
    })
  },
  // 获取用户地址信息
  get_getLocation(cb) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        typeof cb == 'function' && cb(res);
      },
      fail() {
        wx.openSetting({
          complete() {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.userLocation']) {
                  that.get_getLocation(cb);
                } else {
                  that.get_getLocation(cb);
                }
              }
            })
          }
        })
      }
    })
  },
  getUserBalance: function(user_id, ctx, func) {
    server.getJSON("/Scanpay/get_userInfo", {
      user_id: user_id
    }, function(res) {
      let userBalance = new Number(res.data.user_money).toFixed(2);
      func(ctx, userBalance);
    });
  },

  globalData: {
    'openid': null,
    'userInfo': null,
    'login': false,
    'shopName': ''
  },
  image_oss: '?x-oss-process=style/fixed_',
  postUrl: "https://tlst.paycore.cc/index.php/WXAPI"
  // postUrl: 'https://lstmall.paycore.cc/index.php/WXAPI'
})