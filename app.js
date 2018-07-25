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
  // 获取用户的openid 用作用户的注册和登录用
  getOpenId: function(cb) {
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          server.getJSON(
            "/User/getOpenid", {
              code: res.code
            },
            function(res) {
              // 获取openId
              var openId = res.data.openid;
              console.log(res);
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
  // 注册用户
  register: function(cb) {
    var first_leader;
    wx.getStorage({
      key: 'scene',
      success: function(res) {
        first_leader = res.data ? res.data:"";
        // console.log(res.data);
      }
    })
    var app = this;
    this.getUserInfo(function(res) {
      // 获取授权
      var open_id = app.globalData.openid;
      var userInfo = res;
      // var country = userInfo.country; //国家
      // var city = userInfo.city; //城市
      // var gender = userInfo.gender; //性别
      // var nick_name = userInfo.nickName; //昵称
      // var province = userInfo.province; //省份
      server.newpostJSON(
        '/User/register', {
          open_id,
          first_leader
        },
        function(res) {
          console.log(res)
          app.globalData.userInfo = res.data.res
          typeof cb == "function" && cb()
        });
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function() {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
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
  postUrl:"https://tlst.paycore.cc/index.php/WXAPI"
  // posturl: 'https://lstmall.paycore.cc/index.php/WXAPI'
})