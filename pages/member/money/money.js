var server = require('../../../utils/server');
var barQRCode = require('../../../utils/Bar-QR-code');
var app = getApp();
var cPage = 0;
var myVar = null;

Page({

  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
  },

  data: {
    accounts: [
      { user_money: 12.36, change_time: '2018-06-22 17:25:56', desc: '京溪店' },
      { user_money: 47.24, change_time: '2018-06-20 12:45:36', desc: '盈隆店' },
      { user_money: 56.13, change_time: '2018-06-17 11:58:45', desc: '华夏店' },
      { user_money: 34.89, change_time: '2018-06-15 14:37:51', desc: '岗顶店' },
    ],
    orders: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
    myCode: ''
  },

  onReachBottom: function () {
    this.getMoneyInfoList(++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },

  onPullDownRefresh: function () {
    // cPage = 0;
    // this.data.accounts = [];
    // this.getMoneyInfoList(0);
  },

  getMoneyInfoList(page) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    var moneys = app.globalData.userInfo.user_money
    // wx.request({
    //   url: 'https://shop.poopg.com/index.php/WXAPI/Walletpay/getcode',
    //   data: { user_id: user_id },
    //   method: 'POST',
    //   header: { 'content-type': 'application/x-www-form-urlencoded' },// 将数据转化为query string
    //   success: res => {
    //     console.log(res);
    //     barQRCode.barcode('myBarcode', res.data.code, 680, 200);
    //     this.setData({
    //       myCode: res.data.code
    //     });
    //   }
    // });

    server.getJSON('/User/account/user_id/' + user_id + "/page/" + page, function (res) {
      // success
      console.log(res);
      var datas = res.data.result;
      var ms = that.data.accounts
      for (var i in datas) {
        ms.push(datas[i]);
      }
      wx.stopPullDownRefresh();
      that.setData({
        accounts: ms,
        moneys: moneys
      });
    });
  },

  tapRecharge: function (e) {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },

  onLoad: function () {
    cPage = 0;
    this.getMoneyInfoList(0);
    let context = this;
    getCodeTimer(context);
    myVar = setInterval(function () { getCodeTimer(context) }, 2 * 60 * 1000);

    return;
    var user = AV.User.current();
    var query = new AV.Query('Order');
    query.include('buys');
    query.equalTo('user', user);
    query.descending('createdAt');
    query.find().then(function (orderObjects) {
      that.setData({
        orders: orderObjects
      });
      // loop search order, fetch the Buy objects
      for (var i = 0; i < orderObjects.length; i++) {
        var order = orderObjects[i];
        var queryMapping = new AV.Query('OrderGoodsMap');
        queryMapping.include('goods');
        queryMapping.equalTo('order', order);
        queryMapping.find().then(function (mappingObjects) {
          var mappingArray = [];
          for (var j = 0; j < mappingObjects.length; j++) {
            var mappingObject = mappingObjects[j];
            var mapping = {
              avatar: mappingObject.get('goods').get('avatar'),
              title: mappingObject.get('goods').get('title'),
              price: mappingObject.get('goods').get('price'),
              quantity: mappingObject.get('quantity')
            };
            mappingArray.push(mapping);
          }
          // 找出orderObjectId所在的索引位置，来得到k的值
          var k = 0;
          var orders = that.data.orders;
          for (var index = 0; index < orders.length; index++) {
            var order = orders[index];
            if (order.get('objectId') == mappingObject.get('order').get('objectId')) {
              k = index;
              console.log('k: ' + k);
              break;
            }
          }
          var mappingData = that.data.mappingData == undefined ? [] : that.data.mappingData;
          mappingData[k] = mappingArray;
          that.setData({
            mappingData: mappingData
          });
        });
      }
    });
  },

  onUnload: function () {
    clearInterval(myVar);
  }
});

function getCodeTimer(context) {
  var user_id = getApp().globalData.userInfo.user_id
  wx.request({
    url: 'https://shop.poopg.com/index.php/WXAPI/Walletpay/getcode',
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