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
    orderState:false,
    orders_id:"",
    goods_oss: App.image_oss + '150_150',
    paymentArray: [{ id: 0, name: "微信支付", way: 'wxPreparePay', class: "payByBalance" }, { class: "payByWXPay button-hover", id: 1, name: "余额支付", way: 'walletPay' }],
    total_amount:0,
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
    console.log(order)
    this.setData({
      orderState:true,
      orders_id: order['order_id'],
      total_amount: order['total_amount']
    })
    // var index = e.currentTarget.dataset.index;
    // var order = this.data.orders[index];
    // App.globalData.order = order;
    // wx.navigateTo({
    //   url: '../orderpay/payment?order_id=' + 1
    // });
  },
  paymentBtn: function (e) {
    var user_id = wx.getStorageSync("user_id");
    var open_id = App.globalData.openid;
    var order_id = this.data.orders_id
    var that = this;
    if (order_id == "" || !order_id || order_id == null) {
      wx.hideLoading()
      wx.showToast({
        title: '订单有误',
        image: '../../../images/about.png',
        duration: 2000,
        showCancel: false,
        complete: function () {

          // setTimeout(function () {
          //   wx.switchTab({
          //     url: '../../index/index'
          //   });
          // }, 2000);
        }
      })
      return;
    }
    if (open_id == "" || !open_id || open_id == null) {
      wx.hideLoading()
      wx.showModal({
        title: "消息提示",
        content: "获取个人信息有误,请后台关闭小程序再使用",
        showCancel: false,
        success: function (res) {
          // if (res.confirm) {
          //   wx.navigateTo({
          //     url: '/pages/address/add/add?order=1',
          //   })
          // } else if (res.cancel) {
          //   wx.navigateTo({
          //     url: '/pages/address/add/add?order=1',
          //   })
          // }
        }
      })
      return;
    }
    var payway = e.currentTarget.dataset.way
    var port = ""
    var winrecord = {}
    if (payway == "wxPreparePay") {
      port = "/Dopay/wxPreparePay"
      winrecord = {
        user_id: user_id,
        open_id: open_id,
        order_id: order_id
      }
      that.sendpayment(postUrl, port, winrecord, payway)
    } else {
      port = "/Dopay/walletPay"
      winrecord = {
        user_id: user_id,
        order_id: order_id
      }
      var total = that.data.total_amount;
      wx.showModal({
        title: "交易提示",
        content: "此次付款金额为" + total + "元",
        success: function (res) {
          if (res.confirm) {
            that.sendpayment(postUrl, port, winrecord, payway)
          } else if (res.cancel) {
            return;
          }
        },
        fail: function () {
          wx.hideLoading()
          return;
        }

      })

    }
    // console.log(winrecord)
    // console.log(postUrl + port)
    // console.log(user_id)
    // console.log(open_id)
    // console.log(order_id)
    // console.log(winrecord)

  },
  // 发送支付
  sendpayment: function (postUrl, port, winrecord, payway) {
    console.log(postUrl)
    console.log(port)
    console.log(payway)
    console.log(winrecord)
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 请求提交订单
    wx.request({
      url: postUrl + port,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: winrecord,
      method: 'POST',
      success: function (res) {

        wx.hideLoading()
        console.log(res)
        // 微信支付

        if (payway == "wxPreparePay") {
          var result = res.data.data
          wx.requestPayment({
            "timeStamp": result.timeStamp,
            "nonceStr": result.nonceStr,
            "package": result.package,
            "signType": result.signType,
            'paySign': result.paySign,
            'success': function (res) {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2000,
                complete: function () {
                  that.setData({
                    orders_id:"",
                    total_amount:0,
                  })
                  cPage = 1;
                  that.data.orders = [];
                  that.getOrderLists(ctype, cPage);
                }
              })
            },
            'fail': function (res) {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: "支付失败",
                image: '../../../images/about.png',
                duration: 2000,
                // complete: function () {
                //   setTimeout(function () {
                //     wx.switchTab({
                //       url: '../../index/index'
                //     });
                //   }, 2000)
                // }

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
              complete: function () {
                that.setData({
                  orders_id: "",
                  total_amount: 0,
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
              complete: function () {
                // setTimeout(function () {
                //   wx.switchTab({
                //     url: '../../index/index'
                //   });
                // }, 2000)
              }
            })
          }
        }

        // return;
      },
      fail: function (res) {
        wx.showToast({
          title: '下单失败',
          image: '../../../images/about.png',
          duration: 2000,
          complete: function () {
            // setTimeout(function () {
            //   wx.switchTab({
            //     url: '../../index/index'
            //   });
            // }, 2000)

          }
        })
      }, complete: function () {
        that.setData({
          orderState: false
        })
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