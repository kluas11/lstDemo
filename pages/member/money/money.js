var server = require('../../../utils/server');
var barQRCode = require('../../../utils/Bar-QR-code');
var app = getApp();
var cPage = 1;
var myVar = null;

Page({
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
  },

  data: {
    moneys:0,
    pay_point:0,
    accounts:[],
    orders: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
    myCode: ''
  },

  onReachBottom: function () {
    this.getMoneyInfodetail(++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },

  onPullDownRefresh: function () {

  },
  navigateToWithdraw: function (e) {

    wx.navigateTo({
      url: '../../member/share/withdraw/add'
    });
  },
  getMoneyInfodetail:function(page){
    var that= this;
    var user_id = getApp().globalData.userInfo.user_id
  
    var winRecord = { user_id: user_id}
    if(page>1){
      winRecord['p'] =  page
    }
    server.getJSON('/Walletpay/getWalletPaylog', winRecord, function (res) {
      // success
      console.log(res);
      that.setData({
        accounts: that.data.accounts.concat(res.data)
      })
        wx.stopPullDownRefresh();
      // var datas = res.data.result;
      // var ms = that.data.accounts
      // for (var i in datas) {
      //   ms.push(datas[i]);
      // }
    });
  },
  getMoneyInfoList() {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id)
    server.getJSON('/Walletpay/getUsermoneyPoints',{
      user_id: user_id
    }, function (res) {
      // success
      console.log(res);
      // var datas = res.data.result;
      // var ms = that.data.accounts
      // for (var i in datas) {
      //   ms.push(datas[i]);
      // }
 
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

  onLoad: function (options) {
    // console.log(options)
    let context = this;
    cPage = 1;
    this.getMoneyInfodetail(cPage)
    getCodeTimer(context);
    myVar = setInterval(function () { getCodeTimer(context) }, 2 * 60 * 1000);

    return; 
    // 功能未知
    
    // var user = AV.User.current();
    // var query = new AV.Query('Order');
    // query.include('buys');
    // query.equalTo('user', user);
    // query.descending('createdAt');
    // query.find().then(function (orderObjects) {
    //   that.setData({
    //     orders: orderObjects
    //   });
    //   // loop search order, fetch the Buy objects
    //   for (var i = 0; i < orderObjects.length; i++) {
    //     var order = orderObjects[i];
    //     var queryMapping = new AV.Query('OrderGoodsMap');
    //     queryMapping.include('goods');
    //     queryMapping.equalTo('order', order);
    //     queryMapping.find().then(function (mappingObjects) {
    //       var mappingArray = [];
    //       for (var j = 0; j < mappingObjects.length; j++) {
    //         var mappingObject = mappingObjects[j];
    //         var mapping = {
    //           avatar: mappingObject.get('goods').get('avatar'),
    //           title: mappingObject.get('goods').get('title'),
    //           price: mappingObject.get('goods').get('price'),
    //           quantity: mappingObject.get('quantity')
    //         };
    //         mappingArray.push(mapping);
    //       }
    //       // 找出orderObjectId所在的索引位置，来得到k的值
    //       var k = 0;
    //       var orders = that.data.orders;
    //       for (var index = 0; index < orders.length; index++) {
    //         var order = orders[index];
    //         if (order.get('objectId') == mappingObject.get('order').get('objectId')) {
    //           k = index;
    //           console.log('k: ' + k);
    //           break;
    //         }
    //       }
    //       var mappingData = that.data.mappingData == undefined ? [] : that.data.mappingData;
    //       mappingData[k] = mappingArray;
    //       that.setData({
    //         mappingData: mappingData
    //       });
    //     });
    //   }
    // });
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
  var user_id = getApp().globalData.userInfo.user_id
  wx.request({
    url: app.postUrl+'/Walletpay/getcode',
    data: { user_id: user_id },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },// 将数据转化为query string
    success: res => {
      console.log(res);
      barQRCode.barcode('myBarcode', res.data.code, 680, 200);
      context.setData({
        myCode: res.data.code
      });
    }
  });
}