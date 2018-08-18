// pages/member/money/integral/integral.js
const App = getApp();
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
    show:false,
    wx_loading:true
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
    }, function(res) {
      if (res.data.length<=0){
        that.setData({
          loadtext:'——没有更多了——'
        })
      }
      let arr = that.data.lists.concat(res.data);
      that.setData({
        lists: arr,
        wx_loading: false
      });
      wx.hideLoading();
    });
  },
  getpay_points() {
    // 获取积分
    let that = this;
    server.getJSON('/Walletpay/getUsermoneyPoints', function(res) {
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