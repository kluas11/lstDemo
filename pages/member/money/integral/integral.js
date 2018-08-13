// pages/member/money/integral/integral.js
const App = getApp();
const user_id = wx.getStorageSync("user_id");
var server = require('../../../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_point:0,
    page:1,
    lists:[],
    loadtext:'正在加载...',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getlist(this.data.page);
    this.getpay_points();
  },
  getlist(p) {
    //获取积分消费记录
    let that = this;
    server.getJSON('/Walletpay/getPaypointsLog', {
      p,
      user_id
    }, function(res) {
      if (res.data.length<=0){
        that.setData({
          loadtext:'——没有更多了——'
        })
        return;
      }
      let arr = that.data.lists.concat(res.data);
      that.setData({
        lists: arr,
      });
      wx.hideLoading();
    });
  },
  getpay_points() {
    // 获取积分
    let that = this;
    server.getJSON('/Walletpay/getUsermoneyPoints', {
      user_id
    }, function(res) {
      that.setData({
        pay_point: res.data.pay_points || 0,
      });
    });
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
    this.setData({
      loadtext: '正在加载...',
      show:true
    })
    this.getlist(++this.data.page)
  }
})