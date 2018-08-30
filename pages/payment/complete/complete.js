// pages/payment/complete/complete.js
// 支付结果页面
var server = require('../../../utils/server');
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
    let that = this;
    server.getJSON('/Walletpay/getUsermoneyPoints', function(res) {
      // success
      that.setData({
        moneys: res.data.user_money || 0
      });
    });
  },
  // 点击按钮
  btnTap(e) {
    let type = e.target.dataset.type;
    if (type == 'money') {
      wx.redirectTo({
        url: '/pages/member/money/money',
      })
    } else if (type == 'recharge') {
      wx.redirectTo({
        url: '/pages/recharge/recharge',
      })
    } else {
      return;
    }
  }
})