// pages/coupon_detail/coupon_detail.js
var server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let olcoupon_id = options.olcoupon_id;
    let that = this;
    server.getJSON("/Coupon/getBuyOlCouponDetails", {
      olcoupon_id
    }, function(res) {
      if (typeof(res.data) != "string") {
        that.setData({
          couponInfo: res.data
        })
      }
    })
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
    server.newpostJSON("/Coupon/buyOlCoupon", {
      olcoupon_id: this.data.couponInfo.olcoupon_id,
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
              orderState: false,
              modalshow: true
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
          // if (res.data.msg =='余额不足')
          wx.showToast({
            title: res.data.msg,
            image: '/images/about.png'
          })
          // console.log(res.data.msg)
        }
      }
    })
  },
  //我知道了
  hindetap(e){
    // console.log(e.detail.modalshow)
    this.setData({
      modalshow: e.detail.modalshow
    })
  }
})