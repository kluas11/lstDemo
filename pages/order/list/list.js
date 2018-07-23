var server = require('../../../utils/server');
const App = getApp();
const postUrl = App.postUrl;
var cPage = 1; //页码  从一开始
var ctype = "0";
// 当为全部订单时候，不传status
// 当为待付款, status=1
// 当为已付款待发货status=2
// 当为已发货待收获status=3
// 当为已完成status=4
Page({
  data: {
    active_index: 0,
    orders: [],
    goods_oss: App.image_oss + '150_150'
  },
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      tab: index,
      active_index: index
    })
    cPage = 1;
    ctype = index;
    this.data.orders = [];
    this.getOrderLists(index, cPage);
  },
  // 支付
  pay: function(e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    App.globalData.order = order;
    wx.navigateTo({
      url: '../orderpay/payment?order_id=' + 1
    });
  },
  // 取消订单
  cancel: function(e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: postUrl + '/Dopay/cancleOrder',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              order_id: order['order_id']
            },
            method: 'POST',
            success: function(res) {
              console.log(res)
              if (res.data.status) {
                wx.showToast({
                  title: "订单取消成功",
                  icon: 'success',
                  duration: 2000
                })
                cPage = 0;
                that.data.orders = [];
                that.getOrderLists(ctype, 1);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'clear',
                  duration: 2000
                })
              }
            },
            fail: function(res) {
              wx.showToast({
                title: "订单取消失败",
                icon: 'clear',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  // 确定收货
  confirm: function(e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定已收货吗？',
      success: function(res) {
        if (res.confirm) {
          var user_id = that.data.user_id;
          var order_id = order['order_id'];
          wx.request({
            url: postUrl + "/Dopay/completeOrder",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              user_id,
              order_id
            },
            method: 'POST',
            success(res) {
              if (res.data.status) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                cPage = 1;
                that.data.orders = [];
                that.getOrderLists(ctype, 1);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'clear',
                  duration: 2000
                })
              }
            }
          })
          // server.postJSON('/Dopay/completeOrder',{
          //   user_id,
          //   order_id
          // } ,function(res) {
          //   console.log(res)
          //   wx.showToast({
          //     title: res.data.msg,
          //     icon: 'success',
          //     duration: 2000
          //   })
          //   cPage = 1;
          //   that.data.orders = [];
          //   that.getOrderLists(ctype, 1);
          // });
        }
      }
    })
  },
  // 详情
  details: function(e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '../details/index?order_id=' + goods['order_id']
    });
  },
  //获取订单列表
  getOrderLists: function(ctype, page) {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    server.getJSON('/Order/getOrderList', {
        user_id,
        p: page,
        status: ctype ? ctype : ''
      },
      function(res) {
        // console.log(res)
        var datas = res.data;
        var ms = that.data.orders
        for (var i in datas) {
          ms.push(datas[i]);
        }
        wx.stopPullDownRefresh();
        that.setData({
          orders: ms,
          user_id: user_id
        });
      });
  },
  onShow: function() {

  },
  onLoad: function(option) {
    // 页面显示
    cPage = 1;
    this.data.orders = [];
    this.getOrderLists(ctype, cPage);
  },
  onReachBottom: function() {
    this.getOrderLists(ctype, ++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {
    cPage = 0;
    this.data.orders = [];
    this.getOrderLists(ctype, 1);
  }
});