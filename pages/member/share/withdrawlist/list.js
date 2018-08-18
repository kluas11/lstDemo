var server = require('../../../../utils/server');
var app = getApp();
var cPage = 1;
Page({
  data: {
    moneys: 0,
    accounts: [],
    orders: [],
    show:false,
    loadtext:'加载中...'
  },

  onReachBottom: function() {
    this.getMoneyInfoListDetail(++cPage);
    this.setData({
      show:true
    })
  },
  getMoneyInfoListDetail(page) {
    var that = this;
    var winrecord = {}
    if (page > 1) {
      winrecord['p'] = page
    }
    server.getJSON('/User/withdrawList', winrecord, function(res) {
      // success
      var result = res.data;
      console.log(result)
      if (result.length <= 0){
        that.setData({
            loadtext: '————没有更多了————'
          })
      }
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
    server.getJSON('/Walletpay/getUsermoneyPoints', function(res) {
      that.setData({
        moneys: res.data.user_money || 0
      });
    });
  },
});