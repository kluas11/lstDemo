let server = require('../../utils/server');
let app = getApp();

Page({

  /*******************************************************************************
   * 页面的初始数据
   *******************************************************************************/
  data: {
    storeInfo: {
      name: '',
      subName: '',
      logo: ''
    },
    myInfo: {
      name: '',
      balance: 0
    },
    inputAmount: 0,
    fixedAmount: 0,
    enoughBalance: true,
    disable: {
      balance: false,
      WXPay: false
    }
  },

  /*******************************************************************************
   * 生命周期函数
   *******************************************************************************/
  onLoad: function (options) {
    let ctx = this;
    console.log(options)

    // getStoreInfo(ctx, 29);
    // getCustomerInfo(ctx, 137);
    getStoreInfo(ctx, options.store_id);
    let i = setInterval(function() {
      if (app.globalData.userInfo.user_id != undefined && app.globalData.userInfo.user_id != '' && app.globalData.userInfo.user_id != null) {
        clearInterval(i)
        getCustomerInfo(ctx, app.globalData.userInfo.user_id);
      }
    }, 1000)
  },

  /*******************************************************************************
   * 自定义事件
   *******************************************************************************/

  /**
  * 每次输入金额都检测是否大于用户余额
  =================================*/
  amountInput: function (e) {
    let inputAmount = parseFloat(e.detail.value);
    if (isNaN(inputAmount)) {
      inputAmount = 0;
    }
    this.setData({
      inputAmount: inputAmount
    })
  },

  /**
  * 输入金额后格式化，并检测是否为数字
  =================================*/
  amountBlur: function (e) {
    let inputAmount = new Number(e.detail.value);
    if (isNaN(inputAmount)) {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
      this.setData({
        fixedAmount: 0,
        inputAmount: 0
      });
    } else {
      this.setData({
        fixedAmount: new Number(new Number(inputAmount).toFixed(2)),
        inputAmount: new Number(new Number(inputAmount).toFixed(2))
      });
    }
    console.log('【输入amountBlur】' + this.data.fixedAmount);
  },

  /**
  * 余额支付
  =================================*/
  payByBalance: function () {
    let ctx = this;
    console.log('【点击payByBalance】' + ctx.data.fixedAmount);

    ctx.setData({
      'disable.balance': true
    });

    setTimeout(function () {
      // 为什么有这个timeout呢？那是因为如果输入金额后，不先让input失焦就点击button的话，就会先触发bindTap再触发BindBlur，这样来不及读取input的内容就访问接口了，以下同理
      wx.showModal({
        title: '确认支付',
        content: '确认支付' + ctx.data.fixedAmount + '元',
        success: function (res) {
          if (res.confirm) {
            doPay('walletpay', ctx.data.fixedAmount, app.globalData.store_id, app.globalData.userInfo.user_id, function (res) {      
            // doPay('walletpay', ctx.data.fixedAmount, 29, 137, function (res) {
              if (res.data.status == 1 && res.data.payway == 'walletpay') {
                wx.showToast({
                  title: '支付成功',
                });
                getCustomerInfo(ctx, app.globalData.userInfo.user_id);
                // getCustomerInfo(ctx, 137);
                ctx.setData({
                  inputAmount: 0,
                  fixedAmount: 0,
                  'disable.balance': false
                });
              } else if (res.data.status == 1) {
                wx.showToast({
                  title: '金额输入错误',
                });
                ctx.setData({
                  'disable.balance': false
                });
              }
            });
          } else if (res.cancel) { }
          ctx.setData({
            inputAmount: 0,
            fixedAmount: 0,
            'disable.balance': false
          });
        }
      })

    }, 200);
  },

  /**
  * 微信支付
  =================================*/
  payByWXPay: function () {
    let ctx = this;
    console.log('【点击payByBalance】' + ctx.data.fixedAmount);

    ctx.setData({
      'disable.WXPay': true
    });

    setTimeout(function () {
      doPay('wxpay', ctx.data.fixedAmount, app.globalData.store_id, app.globalData.userInfo.user_id, function (res) {
      // doPay('wxpay', ctx.data.fixedAmount, 29, 137, function (res) {
        if (res.data.status == 1 && res.data.payway == 'wxpay') {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res) { },
            'fail': function (res) { }
          });
          getCustomerInfo(ctx, app.globalData.userInfo.user_id);
          // getCustomerInfo(ctx, 137);
          ctx.setData({
            'disable.WXPay': false
          });
        } else if (res.data.status == 1) {
          wx.showToast({
            title: '金额输入错误',
          });
          ctx.setData({
            'disable.WXPay': false
          });
        } else {
          wx.showToast({
            title: '服务错误，请重试',
            icon: 'none',
            duration: 2000
          });
          ctx.setData({
            'disable.WXPay': false
          });
        }
      });
    }, 200);
  },

  onUnload: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})


/*******************************************************************************
 * 通用方法
 *******************************************************************************/
function doPay(payway, total_amount, store_id, user_id, func) {
  console.log(payway + '   ' + total_amount + '   ' + store_id + '   ' + user_id)
  wx.request({
    url: 'https://shop.poopg.com/index.php/WXAPI/Scanpay/dopay',
    method: 'POST',
    data: {
      payway: payway,
      total_amount: total_amount,
      store_id: store_id,
      user_id: user_id
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }, // 将数据转化为query string
    success: func,
    complete: res => {
      console.log('【回传/Scanpay/dopay】');
      console.log(res);
    }
  });
}

function getStoreInfo(ctx, store_id) {
  server.getJSON("/Scanpay/get_storeInfo", {
    store_id: store_id
  }, function (res) {
    console.log('【回传/Scanpay/get_storeInfo】');
    console.log(res);
    ctx.setData({
      'storeInfo.name': res.data.store_name,
      'storeInfo.logo': res.data.store_logo,
    })
  });
}

function getCustomerInfo(ctx, user_id) {
  server.getJSON("/Scanpay/get_userInfo", {
    user_id: user_id
  }, function (res) {
    console.log('【回传/Scanpay/get_userInfo】');
    console.log(res);
    ctx.setData({
      'myInfo.balance': new Number(res.data.user_money)
    })
  });
}