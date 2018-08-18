// 扫码支付页面
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
  onLoad: function(options) {
    console.log(options)
    let pages = getCurrentPages();
    app.getsetting(pages, options.q).then(() => {
      let ctx = this;
      let store_id;
      // options.q 扫公众号二维码进入   options会有有个key为q
      if (options.q) {
        //公众号设置的二维码链接，需要使用 decodeURIComponent 解析获取参数
        var scan_url = decodeURIComponent(options.q);
        let str = scan_url.substring(scan_url.indexOf('store_id'), scan_url.length); //"store_id = 26"
        store_id = str.split("=")[1];
      }
      getStoreInfo(ctx, store_id);
      this.setData({
        store_id: store_id
      })
      this.load();
    })
  },
  onShow() {

  },
  load() {
    let that = this;
    app.getlogin().then(() => {
      getCustomerInfo(that);
    })
  },
  /*******************************************************************************
   * 自定义事件
   *******************************************************************************/

  /**
  * 每次输入金额都检测是否大于用户余额
  =================================*/
  amountInput: function(e) {
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
  amountBlur: function(e) {
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
  },

  /**
  * 余额支付
  =================================*/
  payByBalance: function() {
    let ctx = this;
    ctx.setData({
      'disable.balance': true
    });
    setTimeout(function() {
      // 为什么有这个timeout呢？那是因为如果输入金额后，不先让input失焦就点击button的话，就会先触发bindTap再触发BindBlur，这样来不及读取input的内容就访问接口了，以下同理
      wx.showModal({
        title: '确认支付',
        content: '确认支付' + ctx.data.fixedAmount + '元',
        success: function(res) {
          if (res.confirm) {
            doPay('walletpay', ctx.data.fixedAmount, ctx.data.store_id,function(res) {
              console.log(res.data.payway)
              if (res.data.status == 1 && res.data.payway == 'Walletpay') {
                ctx.complete("支付成功", `余额成功支付${ctx.data.fixedAmount}元`)
                // wx.navigateTo({
                //   url: '/pages/payment/complete/complete?type=walletpay&complete=success&money=' + ctx.data.fixedAmount,
                // })
              } else if (res.data.status == 1) {
                wx.showToast({
                  title: '金额输入错误',
                });
                ctx.setData({
                  'disable.balance': false
                });
              } else if (res.data.status === 0){
                wx.showToast({
                  icon:'/images/about.png',
                  title: '支付失败',
                });
              }
            });
          } else if (res.cancel) {
            ctx.setData({
              inputAmount: 0,
              fixedAmount: 0,
              'disable.balance': false
            });
          }

        }
      })
    }, 200);
  },

  /**
  * 微信支付
  =================================*/
  payByWXPay: function() {
    let ctx = this;
    ctx.setData({
      'disable.WXPay': true
    });
    setTimeout(function() {
      doPay('wxpay', ctx.data.fixedAmount, ctx.data.store_id,function(res) {
        if (res.data.status == 1 && res.data.payway == 'wxpay') {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function(res) {
              ctx.complete("支付成功", `微信成功支付${ctx.data.fixedAmount}元`)              
              // wx.navigateTo({
              //   url: '/pages/payment/complete/complete?type=wxpay&complete=success&money=' + ctx.data.fixedAmount,
              // })
            },
            'fail': function(res) {
              ctx.complete("支付失败", `未能成功支付`)
              // wx.navigateTo({
              //   url: '/pages/payment/complete/complete?type=wxpay&complete=faile',
              // })
            }
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
  /** 
   * 支付结果
   */
  complete(title, content) {
    wx.showModal({
      title,
      content,
      showCancel: false,
      confirmText: '逛逛首页',
      complete:function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  }
})
/*******************************************************************************
 * 通用方法
 *******************************************************************************/
function doPay(payway, total_amount, store_id, func) {
  console.log(payway + '   ' + total_amount + '   ' + store_id + '   ');
  server.newpostJSON('/Scanpay/dopay', {
    payway: payway,
    total_amount: total_amount,
    store_id: store_id,
  }, func)
}

function getStoreInfo(ctx, store_id) {
  server.getJSON("/Scanpay/get_storeInfo", {
    store_id: store_id
  }, function(res) {
    ctx.setData({
      // 商家信息
      'storeInfo.name': res.data.store_name,
      'storeInfo.logo': res.data.store_logo,
    })
  });
}

function getCustomerInfo(ctx) {
  server.getJSON("/Scanpay/get_userInfo", function(res) {
    ctx.setData({
      //用户余额
      'myInfo.balance': new Number(res.data.user_money)
    })
  });
}