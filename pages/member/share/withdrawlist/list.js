var server = require('../../../../utils/server');
var app = getApp();
var cPage = 1;
Page({
  data: {
    moneys: 0,
    accounts: [],
    orders: [],
  },

  onReachBottom: function() {
    this.getMoneyInfoListDetail(++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  getMoneyInfoListDetail(page) {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    var winrecord = {
      user_id: user_id
    }
    if (page > 1) {
      winrecord['p'] = page
    }
    server.getJSON('/User/withdrawList', winrecord, function(res) {
      // success
      console.log(res)
      var result = res.data
      wx.stopPullDownRefresh();
      that.setData({
        accounts: that.data.accounts.concat(result),
      });
    });
  },
  onLoad: function() {
    cPage = 0;
    this.getMoneyInfoListDetail(0);
  },
  onShow: function() {
    this.getMoneyInfoList()
  },
  getMoneyInfoList() {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    server.getJSON('/Walletpay/getUsermoneyPoints', {
      user_id: user_id
    }, function(res) {
      that.setData({
        moneys: res.data.user_money || 0
      });
    });
  },
});