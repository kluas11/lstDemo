// pages/goods/activity/activity.js
var server = require('../../../utils/server');
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_oss: App.image_oss + '224_280',
    activeindex:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getactivity();
  },
  getactivity(){
    let that =this;
    server.getJSON("/Index/getActivityGoodsList", {
      store_id: 26
    }, function (res) {
      if (res.statusCode == 200) {
        that.setData({
          active_list: res.data
        });
      } else {
        that.setData({
          active_list: [],
        });
      }
    })
  },
  // 切换活动
  getactivityTap(e){
    let index = e.target.dataset.index;
    if (index){
      this.setData({
        activeindex:index
      })
    }
  },
  // 加入购物车
  cartTap(e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    server.newpostJSON('/Cart/addCart', {
      goods_id: goodsId,
      goods_num: 1,
    }, function (res) {
      // return 1/0 字符类型 是否加入成功; 
      console.log(res)
      if (res.data == "1")
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1000
        });
      else
        wx.showToast({
          title: "加入购物车失败",
          icon: 'error',
          duration: 1000
        });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})