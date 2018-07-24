var server = require('../../../../utils/server');
const AV = require('../../../../utils/av-weapp.js')
var app = getApp()
var maxTime = 60
var interval = null
var currentTime = -1 //倒计时的事件（单位：s） 

Page({
  data: {
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '请选择省市区',
    maskVisual: 'hidden',
    provinceName: '请选择',
    money:"",
    bank_name:"",
    account_bank:"",
    account_name:""
  },

  isDefault: false,
  formReset: function () {
    console.log('form发生了reset事件')
  },
  formSubmit: function (e) {
    // user 
    var that=this;
    var money = this.data.money;
    // detail
    var bank_name = this.data.bank_name;
    // realname
    var account_bank = this.data.account_bank;
    // mobile
    var account_name = this.data.account_name;
    var postUrl = app.postUrl;
    var bankNumReg = /^([1-9]{1})(\d{15}|\d{18})$/;
    console.log(bankNumReg.test(account_bank))
    if (!bankNumReg.test(account_bank)){
      this.showToasts("输入正确的卡号",false)
      return;
    }
    if (!money || !bank_name || !account_bank || !account_name){
      this.showToasts("请填写完整",false)
      return;
    }
    var user_id = app.globalData.userInfo.user_id
    console.log(user_id)
    console.log(money)
    console.log(bank_name)
    console.log(account_bank)
    console.log(account_name)
    console.log(postUrl)
    wx.request({
      url: postUrl +'/User/addWithdraw', 
      data: {
        user_id: user_id,
        money: money,
        bank_name: bank_name,
        account_username: account_name,
        account_bankno: account_bank
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.status){
          that.setData({
            bank_name: null,
            money: null,
            account_username: null,
            account_bankno: null
          })
          that.showToasts(res.data.msg || "提现成功",true)
        }else{
          that.showToasts(res.data.msg || "提现失败", false)
        }
      },
      fail:function(res){
    
        that.showToasts(res.data.msg || "提现失败", false)
      }
    })
    // server.postJSON('/User/addWithdraw/', { user_id: user_id, money: money, bank_name: bank_name, account_bank: account_bank, account_name: account_name }, function (res) {
    //   if (res.data.status == 1) {
    //     wx.showToast({
    //       title: '申请提现成功',
    //       duration: 1000
    //     });
    //     app.getUserBalance(app.globalData.userInfo.user_id, that, function (that, userBalance) {
    //       that.setData({
    //         moneys: userBalance
    //       });
    //     });
    //   } else {
    //     console.log(res);
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none',
    //       duration: 1000
    //     });
    //   }
    // });
  },
  showToasts: function (content, success){
    wx.showToast({
      title: content ,
      icon: success==true?'success':'clear',
      duration:2000,
      complete:function(){
        if(success){
          setTimeout(function () {
            wx.navigateTo({
              url: '../withdrawlist/list'
            })
          }, 2000)
        }
      }
    })
  },
// 户主姓名
  accountNameInput: function (e) {
    const val = e.detail.value;
    this.setData({
      account_name: val
    })
  },
  navigateToWithdrawList: function (e) {
    wx.navigateTo({
      url: '../withdrawlist/list'
    });
  },
  // 银行名称
  bankNameInput: function (e) {
    const val = e.detail.value;
    this.setData({
      bank_name: val
    })
  },
// 银行卡号
  bankNumInput: function (e) {
    const val = e.detail.value;
    this.setData({
      account_bank: val
    })
  },
  // 提现金额
  amountInput: function (e) {
    const val = e.detail.value;
    this.setData({
      money: val
    })
  },

  onLoad: function (options) {
    var login = app.globalData.login;
    var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       // returnTo: returnTo
    //     })
    //   }
    // })
  },
  getMoneyInfoList() {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id)
    server.getJSON('/Walletpay/getUsermoneyPoints', {
      user_id: user_id
    }, function (res) {
      // success
      console.log(res)
      // var datas = res.data.result;
      // var ms = that.data.accounts
      // for (var i in datas) {
      //   ms.push(datas[i]);
      // }

      that.setData({
        moneys: res.data.user_money || 0
      });
    });
  },
  onShow: function () {
    let that = this;
    this.getMoneyInfoList()
    // app.getUserBalance(app.globalData.userInfo.user_id, that, function (that, userBalance) {
    //   that.setData({
    //     moneys: userBalance
    //   });
    // });
  }

})