// pages/goods/activity/activity.js
var server = require('../../../utils/server');
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_oss: App.image_oss + '224_280',
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
        console.log(res)
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