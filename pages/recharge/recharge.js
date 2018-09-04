let server = require('../../utils/server');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatedNum: "",
    disable: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    server.getJSON('/Recharge/getRechargeRulesList', function(res) {
      let rules = res.data;
      if (typeof(rules) != 'string') {
        that.setData({
          rules
        })
      }else{
        that.setData({
          rules:''
        })
      }
    })
  },
  /**
   * 余额充值
   */
  count: function(e) {
    let that = this;
    let count = e.detail.value;
    if (/^[0-9]+(.[0-9]{1,2})?$/.exec(count)) {

      // if (!(parseFloat(count) >= 1)) {
      //   wx.showToast({
      //     title: '充值金额需要大于1元',
      //     icon: 'none'
      //   });
      //   that.setData({
      //     formatedNum: ""
      //   })
      // } else {
      that.setData({
        formatedNum: count
      })
      // }
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      });
    }
  },
  // 充值
  preparepay(rechargeAmount) {
    let that = this;
    if (!this.data.disable) {
      // 点击先把点击禁用  支付结束在开启
      this.setData({
        disable: true
      })
      server.newpostJSON('/Recharge/prepare_pay', {
        total_amount: rechargeAmount
      }, function(res) {
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function(res) {
            that.setData({
              disable: false
            })
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 2000,
              complete: function() {
                setTimeout(function() {
                  wx.navigateBack()
                }, 1500)
              }
            })

          },
          'fail': function(res) {
            that.setData({
              disable: false
            })
            wx.showToast({
              title: '充值失败',
              image: '/images/about.png',
              duration: 2000,
            })
          }
        })
      })
    } else {
      return;
    }
  },
  // 点击微信充值
  wxRecharge: function() {
    var that = this;
    setTimeout(function() {
      let rechargeAmount = that.data.formatedNum;
      if (rechargeAmount == "" || rechargeAmount == 0 || !rechargeAmount) {
        wx.showToast({
          title: '请输入正确的金额',
          icon: 'none'
        });
        return;
      }
      that.preparepay(rechargeAmount)
    }, 200)
  },
  // 选择固定充值金额 该事件绑定在父元素
  rechargeTap(e) {
    let rechargeAmount = e.currentTarget.dataset.amount;
    if (!isNaN(+rechargeAmount) && rechargeAmount) {
      this.preparepay(+rechargeAmount)
    } else {
      wx.showToast({
        title: '充值的金额有误',
        image: '/images/about.png',
        duration: 2000
      })
    }
  }
})