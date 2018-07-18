// const AV = require('../../../utils/av-weapp.js')
var app = getApp();
Page({
  data: {
    
  },
  onLoad: function(options) {
    
  },
  //完善信息
  navigateToEdit: function() {
    wx.navigateTo({
      url: '/pages/register/index',
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
      url: '/pages/member/point/point'
    });
  },
  // 我的收藏
  navigateToCollect: function() {
    wx.navigateTo({
      url: '/pages/member//collect/collect'
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
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/order/list/list?cid=' + cid
    });
  },
  // 地址管理
  navigateToAddress: function() {
    wx.navigateTo({
      url: '/pages/address/list/list'
    });
  },
  onShow: function() {
    var that = this;
    // 调用小程序 API，得到用户信息
    // wx.getUserInfo({
    //   success: ({
    //     userInfo
    //   }) => {
    //     that.setData({
    //       userInfo: userInfo
    //     });
    //     app.globalData.nickName = userInfo.nickName;
    //   }
    // });
  },
  // chooseImage: function() {
  // 莫名其妙的一个功能  功能未知
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function(res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePath = res.tempFilePaths[0];
  //       new AV.File('file-name', {
  //         blob: {
  //           uri: tempFilePath,
  //         },
  //       }).save().then(
  //         // file => console.log(file.url())
  //         function(file) {
  //           // 上传成功后，将所上传的头像设置更新到页面<image>中
  //           var userInfo = that.data.userInfo;
  //           userInfo.avatarUrl = file.url();
  //           that.setData({
  //             userInfo,
  //             userInfo
  //           });
  //         }
  //       ).catch(console.error);
  //     }
  //   })
  // }
})