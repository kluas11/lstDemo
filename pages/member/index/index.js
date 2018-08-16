// const AV = require('../../../utils/av-weapp.js')
// 我的页面
var app = getApp();
Page({
  data: {
    mobile:"123"
  },
  onLoad: function(options) {

  },
  //完善信息
  navigateToEdit: function() {
    wx.navigateTo({
      url: '/pages/personalInformation/personalInformation',
    })
  },
  //我的优惠券
  navigateToCoupon: function() {
    wx.navigateTo({
      url: '/pages/member/coupon/index'
    });
  },
  // 推荐中心
  navigateToShare: function() {
    wx.navigateTo({
      url: '/pages/member/share/index/index'
    });
  },
  // 我的评价
  navigateToEvaluate: function() {
    wx.navigateTo({
      url: '/pages/member/evaluate/evaluate'
    });
  },
  // 我的积分
  navigateToPoint: function() {
    wx.navigateTo({
      url: '/pages/member/money/integral/integral'
    });
  },
  // 我的收藏
  navigateToCollect: function() {
    wx.navigateTo({
      url: '/pages/member/collect/collect'
    });
  },
  // 我的钱包
  navigateToMoney: function() {
    //url: "../order/list/list"
    wx.navigateTo({
      url: '/pages/member/money/money'
    });
  },
  // 我的订单
  navigateToOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order/list/list?type=' + e.currentTarget.dataset.cid
    });
  },
  // 地址管理
  navigateToAddress: function() {
    wx.navigateTo({
      url: '/pages/address/list/list'
    });
  },
  onShow: function() {
  },
})