var server = require('../../../../utils/server');
const AV = require('../../../../utils/av-weapp.js')
var app = getApp()
var maxTime = 60
var interval = null
var currentTime = -1 //倒计时的事件（单位：s） 

Page({
  data: {
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '请选择省市区',
    maskVisual: 'hidden',
    provinceName: '请选择'
  },

  isDefault: false,
  formSubmit: function (e) {
    // user 
    var money = this.data.money;
    // detail
    var bank_name = this.data.bank_name;
    // realname
    var account_bank = this.data.account_bank;
    // mobile
    var account_name = this.data.account_name;
    var user_id = getApp().globalData.userInfo.user_id


    var that = this;
    server.postJSON('/User/addWithdraw/', { user_id: user_id, money: money, bank_name: bank_name, account_bank: account_bank, account_name: account_name }, function (res) {
      if (res.data.status == 1) {
        wx.showToast({
          title: '申请提现成功',
          duration: 1000
        });
        app.getUserBalance(app.globalData.userInfo.user_id, that, function (that, userBalance) {
          that.setData({
            moneys: userBalance
          });
        });
      } else {
        console.log(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        });
      }
    });
  },

  accountNameInput: function (e) {
    const val = e.detail.value;
    this.setData({
      account_name: val
    })
  },
  navigateToWithdrawList: function (e) {
    wx.navigateTo({
      url: '../withdrawlist/list'
    });
  },
  bankNameInput: function (e) {
    const val = e.detail.value;
    this.setData({
      bank_name: val
    })
  },

  bankNumInput: function (e) {
    const val = e.detail.value;
    this.setData({
      account_bank: val
    })
  },

  amountInput: function (e) {
    const val = e.detail.value;
    this.setData({
      money: val
    })
  },

  onLoad: function (options) {
    var returnTo = options.returnTo;
    var login = app.globalData.login;
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          returnTo: returnTo
        })
      }
    })
  },

  onShow: function () {
    let that = this;
    app.getUserBalance(app.globalData.userInfo.user_id, that, function (that, userBalance) {
      that.setData({
        moneys: userBalance
      });
    });
  }

})