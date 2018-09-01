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
      if (typeof(res.data) == "string") {
          that.setData({
            empty:true
          })
      } else {
        let cuoponlist = res.data.online;
        let goodsCuoponlist = res.data.offline;
        let empty =false;
        if (cuoponlist.length == 0 && goodsCuoponlist.length ==0){
          empty=true;
        }
        that.setData({
          cuoponlist,
          goodsCuoponlist,
          empty
        })
      }
    });
  },
  // 点击领取
  receivetap(e) {
    // console.log(e.currentTarget.dataset.coupon_id)
    let coupon_id = e.currentTarget.dataset.coupon_id;
    if (coupon_id) {
      wx.navigateTo({
        url: '/pages/coupon/b_detail/b_detail?coupon_id=' + coupon_id,
      })
    }
    return;
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