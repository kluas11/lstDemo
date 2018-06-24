let server = require('../../utils/server');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatedNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 余额充值
   */
  count: function (e) {
    let context = this;
    let count = e.detail.value;
    if (/^[0-9]+(.[0-9]{1,2})?$/.exec(count)) {
      if (!(parseFloat(count) >= 1)) {
        wx.showToast({
          title: '充值金额需要大于1元',
          icon: 'none'
        });
      } else {
        let openId = getApp().globalData.userInfo;
        count = parseFloat(count);
        wx.request({
          url: 'https://shop.poopg.com/index.php/WXAPI/Recharge/prepare_pay',
          method: 'POST',
          data: { openid: openId.open_id, user_id: openId.user_id, total_amount: count },
          header: { 'content-type': 'application/x-www-form-urlencoded' },// 将数据转化为query string
          success: res => {
            console.log(res)
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function (res) { },
              'fail': function (res) { }
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      });
    }
  }
})

function wxPay(context) {

}