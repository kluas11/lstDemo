var server = require('../../../utils/server');
const App = getApp();
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
    orderState: false,
    orders_id: "",
    goods_oss: App.image_oss + '150_150',
    total_amount: 0,
    show: false,
    loadtext: '正在加载...',
    wx_loading: true
  },
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      tab: index,
      active_index: index,
      show: false
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
    console.log(order)
    this.setData({
      orderState: true,
      orders_id: order['order_id'],
      total_amount: order['total_amount']
    })
  },
  //关闭支付窗口
  hidden_paybox(e) {
    if (e.target.id === 'paybox') {
      this.setData({
        orderState: false
      })
    }
  },
  // 发送支付
  sendpayment: function(port, winrecord, payway) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 请求提交订单
    server.newpostJSON(port, winrecord, function(res) {
      wx.hideLoading()
      if (payway == "wxPreparePay") {
        var result = res.data.data
        wx.requestPayment({
          "timeStamp": result.timeStamp,
          "nonceStr": result.nonceStr,
          "package": result.package,
          "signType": result.signType,
          'paySign': result.paySign,
          'success': function(res) {
            wx.hideLoading()
            console.log(res)
            wx.showToast({
              title: "支付成功",
              icon: "success",
              duration: 2000,
              complete: function() {
                that.setData({
                  orders_id: "",
                  total_amount: 0,
                  orderState: false
                })
                cPage = 1;
                that.data.orders = [];
                that.getOrderLists(ctype, cPage);
              }
            })
          },
          'fail': function(res) {
            wx.hideLoading()
            console.log(res)
            wx.showToast({
              title: "支付失败",
              image: '../../../images/about.png',
              duration: 2000,
            })
          }
        })
      } else {
        // 余额支付
        if (res.data.status) {
          wx.showToast({
            title: "支付成功",
            icon: "success",
            duration: 2000,
            complete: function() {
              that.setData({
                orders_id: "",
                total_amount: 0,
                orderState: false
              })
              cPage = 1;
              that.data.orders = [];
              that.getOrderLists(ctype, cPage);
            }
          })
        } else {
          wx.showToast({
            title: "余额不足",
            image: '../../../images/about.png',
            duration: 2000,
            complete: function() {}
          })
        }
      }
    })
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
          server.newpostJSON('/Dopay/cancleOrder', {
            order_id: order['order_id']
          }, function(res) {
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
          var order_id = order['order_id'];
          server.newpostJSON("/Dopay/completeOrder", {
            order_id
          }, function(res) {
            if (res.data.status) {
              wx.showToast({
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
          })
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
    server.getJSON('/Order/getOrderList', {
        p: page,
        status: ctype ? ctype : ''
      },
      function(res) {
        if (res.data.length <= 0) {
          that.setData({
            loadtext: '——没有更多了——'
          })
        }
        var datas = res.data;
        var ms = that.data.orders
        for (var i in datas) {
          ms.push(datas[i]);
        }
        wx.stopPullDownRefresh();
        that.setData({
          orders: ms,
          wx_loading: false
        });
      });
  },
  onShow: function() {

  },
  onLoad: function(option) {
    // 页面显示
    cPage = 1;
    ctype = option.type ? option.type : 2;
    this.setData({
      active_index: ctype
    })
    this.data.orders = [];
    this.getOrderLists(ctype, cPage);
  },
  onReachBottom: function() {
    this.setData({
      show: true,
      loadtext: '正在加载...'
    })
    this.getOrderLists(ctype, ++cPage);
  },
  onPullDownRefresh: function() {
    cPage = 0;
    this.data.orders = [];
    this.getOrderLists(ctype, 1);
  },
  onHide: function() {
    console.log(getCurrentPages())
  },
  onUnload: function() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2].route;
    console.log(prevPage)
    if (prevPage == "pages/order/ordersubmit/index") {
      wx.switchTab({
        url: '../../cart/cart',
      })
    }
  }
});