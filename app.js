
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

  register: function (cb) {
    var first_leader = 0;
    wx.getStorage({
      key: 'scene',
      success: function (res) {
        first_leader = res.data;
        console.log(res.data);
      }
    })

    var app = this;
    //  this.getUserInfo(function () {
    var openId = app.globalData.openid;
    console.log(openId);
    var userInfo = app.globalData.userInfo;
    var country = userInfo.country;
    var city = userInfo.city;
    var gender = userInfo.gender;
    var nick_name = userInfo.nickName;
    var province = userInfo.province;
    var avatarUrl = userInfo.avatarUrl;
    console.log('/User/register?open_id=' + openId + "&country=" + country + "&gender=" + gender + "&nick_name=" + nick_name + "&province=" + province + "&city=" + city + "&head_pic=" + avatarUrl + "&first_leader=" + first_leader);

    server.getJSON('/User/register?open_id=' + openId + "&country=" + country + "&gender=" + gender + "&nick_name=" + nick_name + "&province=" + province + "&city=" + city + "&head_pic=" + avatarUrl + "&first_leader=" + first_leader, function (res) {
      console.log(res);
      app.globalData.userInfo = res.data.res

      typeof cb == "function" && cb()
    });

    //  })
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
