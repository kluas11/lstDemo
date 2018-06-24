const AV = require('../../../../utils/av-weapp.js')
var app = getApp()
var maxTime = 60 
var interval = null 
var currentTime = -1 //倒计时的事件（单位：s）  

Page({
	
	data: {
		login:false,
    time:'获取验证码'
	},
	onLoad: function (options) {
		var login = app.globalData.login;
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    var moneys = app.globalData.userInfo.user_money
    wx.getSystemInfo({
  success: function(res) {
    that.setData({ height: res.windowHeight, moneys: moneys})
  }
})
	},
  navigateToMember:function(){
wx.navigateTo({
  url: '../member/list',
  success: function(res){
    // success
  },
  fail: function(res) {
    // fail
  },
  complete: function(res) {
    // complete
  }
})
  },



  navigateToOrder:function(e){
wx.navigateTo({
			url: '../order/list'
		});
  },

  navigateToWithdraw: function (e) {
    wx.navigateTo({
      url: '../withdraw/add'
    });
  },
  navigateToWithdrawList: function (e) {
    wx.navigateTo({
      url: '../withdrawlist/list'
    });
  },
  navigateToFenxiao: function (e) {
    wx.navigateTo({
      url: '../erweima/index'
    });
  },
	onShow: function () {
		var that = this;
		
    var login = app.globalData.login;
    var that = this;
		this.setData({login:login});
		// 调用小程序 API，得到用户信息
		wx.getUserInfo({
			success: ({userInfo}) => {
				that.setData({
					userInfo: userInfo
				});
        app.globalData.nickName = userInfo.nickName;
			}
		});
	},

})



