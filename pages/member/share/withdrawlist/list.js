var server = require('../../../../utils/server');
var app = getApp();
var cPage = 1;
Page({

	tabClick:function(e){
        var index = e.currentTarget.dataset.index
		var classs= ["text-normal","text-normal","text-normal","text-normal","text-normal","text-normal"]
		classs[index] = "text-select"
		this.setData({tabClasss:classs,tab:index})
	},
	
	data: {
    moneys: 0,
    accounts:[],
		orders: [],
    tabClasss:["text-select","text-normal","text-normal","text-normal","text-normal"],
	},

  onReachBottom: function () {
    this.getMoneyInfoListDetail(++cPage);
		wx.showToast({
		  title: '加载中',
		  icon: 'loading'
		})
	},
	onPullDownRefresh: function () {
    cPage = 1;
    this.data.accounts = [];
    this.getMoneyInfoListDetail(1);
	},
  getMoneyInfoListDetail(page){
    var that = this;
		var user_id = getApp().globalData.userInfo.user_id
	  var moneys = app.globalData.userInfo.user_money
    var winrecord = { user_id: user_id}
    if(page>1){
      winrecord['p'] = page
    }
    server.getJSON('/User/withdrawList', winrecord,function(res){
			// success
      console.log(res)
      var result=res.data
      wx.stopPullDownRefresh();
			that.setData({
        accounts: that.data.accounts.concat(result),
					});
		});


  },
	onLoad: function () {
		cPage = 0;
    // getMoneyInfoListDetail
    this.getMoneyInfoListDetail(0);
		// var user = AV.User.current();
		// var query = new AV.Query('Order');	
		// query.include('buys');
		// query.equalTo('user', user);
		// query.descending('createdAt');
		// query.find().then(function (orderObjects) {
		// 	that.setData({
		// 		orders: orderObjects
		// 	});
		// 	// loop search order, fetch the Buy objects
		// 	for (var i = 0; i < orderObjects.length; i++) {
		// 		var order = orderObjects[i];
		// 		var queryMapping = new AV.Query('OrderGoodsMap');
		// 		queryMapping.include('goods');
		// 		queryMapping.equalTo('order', order);
		// 		queryMapping.find().then(function (mappingObjects) {
		// 			var mappingArray = [];
		// 			for (var j = 0; j < mappingObjects.length; j++) {
		// 				var mappingObject = mappingObjects[j];
		// 				var mapping = {
		// 					avatar: mappingObject.get('goods').get('avatar'),
		// 					title: mappingObject.get('goods').get('title'),
		// 					price: mappingObject.get('goods').get('price'),
		// 					quantity: mappingObject.get('quantity')
		// 				};
		// 				mappingArray.push(mapping);
		// 			}
		// 			// 找出orderObjectId所在的索引位置，来得到k的值
		// 			var k = 0;
		// 			var orders = that.data.orders;
		// 			for (var index = 0; index < orders.length; index++) {
		// 				var order = orders[index];
		// 				if (order.get('objectId') == mappingObject.get('order').get('objectId')) {
		// 					k = index;
		// 					console.log('k: ' + k);
		// 					break;
		// 				}
		// 			}
		// 			var mappingData = that.data.mappingData == undefined ? [] : that.data.mappingData;
		// 			mappingData[k] = mappingArray;
		// 			that.setData({
		// 				mappingData: mappingData
		// 			});
		// 		});
		// 	}
		// });
	},
  onShow:function(){
    this.getMoneyInfoList()
  },
  getMoneyInfoList() {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id)
    server.getJSON('/Walletpay/getUsermoneyPoints', {
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
        moneys: res.data.user_money || 0
      });
    });
  },

});