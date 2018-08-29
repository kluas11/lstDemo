var server = require('../../../utils/server');
var barQRCode = require('../../../utils/Bar-QR-code');
var app = getApp();
var cPage = 1;
var myVar = null;

Page({
  data: {
    moneys:0,
    pay_point:0,
    accounts:[],
    orders: [],
    myCode: '',
    show:false,
    loadtext:'正在加载...'
  },
  onReachBottom: function () {
    this.setData({
      show:true,
      loadtext: '正在加载...'
    })
    this.getMoneyInfodetail(++cPage);
  },
  navigateToWithdraw: function (e) {

    wx.navigateTo({
      url: '../../member/share/withdraw/add'
    });
  },
  getMoneyInfodetail:function(page){
    var that= this;
    var winRecord = {}
    if(page>1){
      winRecord['p'] =  page
    }
    server.getJSON('/Walletpay/getWalletPaylog', winRecord, function (res) {
      if (res.data.length<=0){
        that.setData({
          loadtext: '——没有更多了——'
        })
      }
      // success
      that.setData({
        accounts: that.data.accounts.concat(res.data)
      })
    });
  },
  getMoneyInfoList() {
    var that = this;
    var sessionId = wx.getStorageSync('sessionId');
    if (!sessionId){
      wx.showToast({
        title: '用户获取失败',
        image:"../../../images/about.png",
        duration:2000
      })
    }
    server.getJSON('/Walletpay/getUsermoneyPoints', function (res) {
      // success
      that.setData({
        // accounts: ms,
        pay_point: res.data.pay_points ||0,
        moneys: res.data.user_money ||0
      });
    });
  },

  tapRecharge: function (e) {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  jifenTap(){
    wx.navigateTo({
      url: '/pages/member/money/integral/integral',
    })
  },
  onLoad: function (options) {
    // console.log(options)
    let context = this;
    cPage = 1;
    this.getMoneyInfodetail(cPage)
    getCodeTimer(context);
    myVar = setInterval(function () { getCodeTimer(context) }, 2 * 60 * 1000);
  },

  onShow: function (options) {
    // console.log(options)
    let that = this;
    this.getMoneyInfoList();
  },

  onUnload: function () {
    clearInterval(myVar);
  },
  onHide:function(){
    clearInterval(myVar);     
  }
});
// 获取条形码
function getCodeTimer(context) {
  server.newpostJSON('/Walletpay/getcode',function(res){
    barQRCode.barcode('myBarcode', res.data.code, 680, 200);
    context.setData({
      myCode: res.data.code
    });
  })
}