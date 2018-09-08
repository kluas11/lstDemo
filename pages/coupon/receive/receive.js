// pages/coupon/receive/receive.js
var server = require('../../../utils/server');
var App = getApp();
var getUrl;
var receiveUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.objectId)
    console.log(options.coupon_type)
    if (options.coupon_type){
      App.globalData.coupon_type = options.coupon_type;
    }
    let pages = getCurrentPages();
    let that = this;
    App.getsetting(pages, options.objectId).then(() => {
      var sessionId = wx.getStorageSync("sessionId");
      if (!sessionId) {
        App.getlogin().then(res => {
          that.getcoupon(options.objectId)
        })
      } else {
        that.getcoupon(options.objectId)
      }
    })
  },
  // 获取优惠券详情
  getcoupon(objectId) {
    let that = this;
    let coupon_type = App.globalData.coupon_type;
    if (coupon_type == "online"){
      getUrl = '/Coupon/getReceiveCouponDetails';
      receiveUrl = '/Coupon/receiveCoupon';
    } else if (coupon_type == "offline"){
      getUrl = '/Coupon/getReceiveOlCouponDetails';
      receiveUrl = '/Coupon/receiveOlCoupon';
    }else{
      wx.showModal({
        content: '无法获取优惠券',
        showCancel:false,
        confirmText:"返回首页",
        complete:function(){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
      return;
    }
    server.getJSON(getUrl, {
      id: objectId
    }, function(res) {
      if (typeof(res.data) != "string") {
        let imgUrl = res.data.status == 'SHARING' ? "/images/receive.png" :'/images/hasreceive.png'
        that.setData({
          coupon: res.data,
          id: objectId,
          coupon_type:App.globalData.coupon_type,
          imgUrl
        })
      }
    })
  },
  // 免费领取券
  receiveTap() {
    let that = this;
    server.newpostJSON(receiveUrl, {
      id: this.data.id
    }, function(res) {
      if (typeof(res.data) != "string") {
        console.log(res)
        if (res.data.status) {
          wx.showToast({
            title: '领取成功',
            iocn: 'success',
            duration: 3000
          })
          that.getcoupon(that.data.id)
        } else {
          wx.showToast({
            title: '不可领取该券',
            image: '/images/about.png',
            duration: 3000
          })
        }
      }
    })
  },
  getbackTap() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
   
  }
})