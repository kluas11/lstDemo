// pages/coupon/b_detail/b_detail.js
var server = require('../../../utils/server');
var App = getApp();
var id;
var coupon_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isouttime = options.outtime?true:"";
    this.setData({
      isouttime
    })
    // 隐藏右上角的转发
    wx.hideShareMenu()
    id = options.id;
    coupon_id = options.coupon_id;
    this.getcouponInof();
  },
  // getcouponInfo 获取优惠详情
  getcouponInof() {
    let that = this;
    let api;
    let data;
    if (id) {
      // 我的优惠券查看线上的优惠券详情
      server.getJSON("/Coupon/getCouponDetails", {
        id
      }, function(res) {
        if (typeof(res.data) != "string") {
          that.setData({
            couponInfo: res.data.online,
            online: true
          })
        }
      })
    } else if (coupon_id) {
      // 优惠中心查看线上的优惠券详情
      server.getJSON("/Coupon/getBuyCouponDetails", {
        coupon_id
      }, function(res) {
        if (typeof(res.data) != "string") {
          that.setData({
            couponInfo: res.data,
            online: false,
            buyout: res.data.limit_total === '0' ? true : false,
          })
        }
      })
    } else {
      return;
    }
  },
  // 领取优惠券
  receiveCouponTap(e) {
    let that = this;
    let coupon_id = e.currentTarget.dataset.coupon_id;
    server.newpostJSON("/Index/receiveCoupon", {
      coupon_id,
    }, function(res) {
      if (res.data.status) {
        that.setData({
          modalshow:true
        })
      } else {
        wx.showToast({
          title: '领取失败',
          image: '/images/about.png',
        })
      }
      that.getcouponInof();
    });
  },
  // 购买 or 兑换
  buycouponTap: function(e) {
    var that = this;
    if (this.data.couponInfo.buy_way == 'MONEY') {
      this.setData({
        orderState: true
      })
    } else if (this.data.couponInfo.buy_way == 'PAYPOINT') {
      wx.showModal({
        title: "交易提示",
        content: "兑换需要" + this.data.couponInfo.buy_paypoint + "积分",
        success: function(res) {
          if (res.confirm) {
            that.sendpayment()
          } else if (res.cancel) {
            return;
          }
        },
        fail: function() {
          wx.hideLoading()
          return;
        }
      })
    } else {
      return;
    }
  },
  // 选择现金购买支付方式   余额OR微信
  paymentBtn: function(e) {
    var payway = e.currentTarget.dataset.way;
    var that = this;
    if (payway == "wxPreparePay") {
      that.sendpayment("WXPAY")
    } else {
      wx.showModal({
        title: "交易提示",
        content: "此次付款金额为" + this.data.couponInfo.buy_price + "元",
        success: function(res) {
          if (res.confirm) {
            that.sendpayment("WALLETPAY")
          } else if (res.cancel) {
            return;
          }
        },
        fail: function() {
          wx.hideLoading()
          return;
        }
      })
    }
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
  sendpayment: function(buy_way) {
    var that = this;
    buy_way = buy_way || '';
    wx.showLoading({
      title: '加载中',
    })
    // 请求提交订单
    server.newpostJSON("/Coupon/buyCoupon", {
      coupon_id: this.data.couponInfo.coupon_id,
      buy_way
    }, function(res) {
      wx.hideLoading()
      if (buy_way == "WXPAY") {
        var result = res.data.data
        wx.requestPayment({
          "timeStamp": result.timeStamp,
          "nonceStr": result.nonceStr,
          "package": result.package,
          "signType": result.signType,
          'paySign': result.paySign,
          'success': function(res) {
            that.setData({
              orderState: false,
              modalshow: true
            })
          },
          'fail': function(res) {
            that.setData({
              orderState: false
            })
            wx.showToast({
              title: '购买失败',
              image: '/images/about.png'
            })
          }
        })
      } else {
        // 余额支付 积分兑换
        if (res.data.status) {
          that.setData({
            orderState: false,
            modalshow: true
          })
        } else {
          that.setData({
            orderState: false
          })
          wx.showToast({
            title: '购买失败',
            image: '/images/about.png'
          })
        }
      }
    })
  },
  //我知道了
  hindetap(e) {
    // console.log(e.detail.modalshow)
    this.setData({
      modalshow: e.detail.modalshow
    })
  },
  // 请求转发接口，现在无法获取到是否转发成功的回调，所以暂时在点击赠送是调用
  giveOlCoupon(id) {
    let that = this;
    server.newpostJSON("/Coupon/giveCoupon", {
      id
    }, function (res) {
      if (typeof (res.data) != "string") {
        that.getcouponInof();
      }else{
        wx.showModal({
          content: '赠送失败',
          showCancel:false
        })
      }
    })
  },
  shareTap() {
    this.giveOlCoupon(id);
  },
  // 赠送
  onShareAppMessage: function () {
    return {
      title: this.data.couponInfo.name,
      path: `/pages/coupon/receive/receive?objectId=${id}&coupon_type=online`
    }
  }
})