var server = require('../../../utils/server');
// var AV = require('../../../utils/av-weapp');
var timeout = null
var exit;
Page({
  data: {
    amount: 0,
    carts: [],
    addressList: [],
    addressIndex: 0,
    height: 0
  },
  addressObjects: [],
  doHandler: function() {
    if (app.globalData.login)
      wx.switchTab({
        url: '/pages/member/index/index'
      });
  },
  onShow: function() {
    if (exit) {
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function(res) {
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }
    //else exit = false;
  },
  onLoad: function(options) {
    //this.readCarts(options);
    //this.loadAddress();
    exit = false;
    var that = this
    var app = getApp();
    var cartIds = options.cartIds;
    var amount = options.amount;
    console.log(cartIds, amount)
    console.log("+++初次加载++")
    
    app.globalData.cartIds = cartIds;
    app.globalData.amount = amount;
    this.setData({
      cartIds: cartIds,
      amount: amount
    });

    timeout = setTimeout(function() {
      // 未登录了解一下就到个人中心
      if (!app.globalData.login) {
        exit = true;
        wx.switchTab({
          url: '/pages/member/index/index'
        });
      } else {
        // console.log(1)
        var user_id = app.globalData.userInfo.user_id
        server.getJSON('/User/getAddressList/user_id/' + user_id, function(res) {
          var data = res.data
          console.log(data)
          exit = true;
          // 地址没有 跳转到添加地址 
          if (data.msg == "没有数据") {
            wx.navigateTo({
              url: '/pages/address/add/add?returnTo=1'
            });
          } else //ordersubmit/index
          {
            wx.navigateTo({
              url: '/pages/order/ordersubmit/index'
            });
          }
        });
      }
    }, 2000); //使用字符串执行方法

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })

  },
  // readCarts: function(options) {
  // 未知功能
  //   // from carts
  //   // amount
  //   var amount = parseInt(options.amount);
  //   this.setData({
  //     amount: amount
  //   });

  //   // cartIds str
  //   var cartIds = options.cartIds;
  //   var cartIdArray = cartIds.split(',');
  //   // restore carts object
  //   var carts = [];
  //   for (var i = 0; i < cartIdArray.length; i++) {
  //     var query = new AV.Query('Cart');
  //     query.include('goods');
  //     query.get(cartIdArray[i]).then(function(cart) {
  //       carts.push(cart);
  //     }, function(error) {

  //     });
  //   }
  //   this.setData({
  //     carts: carts
  //   });
  // }
})