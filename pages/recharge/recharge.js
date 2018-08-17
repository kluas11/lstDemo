let server = require('../../utils/server');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatedNum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 余额充值
   */
  count: function(e) {
    let that = this;
    let count = e.detail.value;
    if (/^[0-9]+(.[0-9]{1,2})?$/.exec(count)) {
      if (!(parseFloat(count) >= 1)) {
        wx.showToast({
          title: '充值金额需要大于1元',
          icon: 'none'
        });
        that.setData({
          formatedNum: ""
        })
      } else {
        that.setData({
          formatedNum: count
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      });
    }
  },
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
      let open_id = app.globalData.openid;
      let user_id = wx.getStorageSync("user_id");
      server.newpostJSON('/Recharge/prepare_pay', {
        openid: open_id,
        user_id: user_id,
        total_amount: rechargeAmount
      },function(res){
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1500)
              }
            })

          },
          'fail': function (res) {
            wx.showToast({
              title: '充值失败',
              image: '../../images/about.png',
              duration: 2000,
            })

          }
        })
      })
    }, 200)
  }
})