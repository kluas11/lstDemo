// pages/coupon/coupon.js
var server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeIndex: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    server.getJSON("/Coupon/getBuyCouponList", {
      // store_id: App.globalData.store_id
      store_id: 26
    }, function(res) {
      // console.log(res)
      that.setData({
        cuoponlist: res.data.online,
        goodsCuoponlist: res.data.offline
      })
    });
  },
  // 点击领取
  receivetap(e) {
    // console.log(e.currentTarget.dataset.coupon_id)
    let that = this;
    let coupon_id = e.currentTarget.dataset.coupon_id;
    let cuoponlist = this.data.cuoponlist;
    cuoponlist.forEach(function(val, index) {
      if (val.coupon_id === coupon_id) {
        val.disabled = true;
      }
    })
    server.newpostJSON("/Index/receiveCoupon", {
      coupon_id,
    }, function(res) {
      if (res.data.status) {
        wx.showToast({
          title: '领取成功',
          icon: "success"
        })
        that.setData({
          cuoponlist
        })
      } else {
        wx.showToast({
          title: '领取失败',
          image: '../../images/about.png',
        })
      }
    });
  },
  // 点击购买 兑换
  detailTap(e) {
    let coupon_id = e.currentTarget.dataset.coupon_id;
    let olcoupon_id = e.currentTarget.dataset.olcoupon_id;
    let id;
    let url;
    if (coupon_id) {
      url = '/pages/coupon/b_detail/b_detail?coupon_id=' + coupon_id;
    } else if (olcoupon_id) {
      url = '/pages/coupon_detail/coupon_detail?olcoupon_id=' + olcoupon_id;
    } else {
      return;
    }
    wx.navigateTo({
      url,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})