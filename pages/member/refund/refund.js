// pages/member/refund/refund.js
let server = require('../../../utils/server')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: '',
    refundData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData()
  },

  //获取用户退款记录列表
  getData: function() {
    let _this = this
    server.getJSON('/OrderRefund/getUserRefundLog', {

      },
      function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          _this.setData({
            refundData: res.data
          })
        }
      })
  },
  //查看详情
  touchStart: function() {
    this.setData({
      backgroundColor: 'background-color: moccasin'
    })
  },
  //查看详情
  toucHend: function(e) {
    this.setData({
      backgroundColor: ''
    })
    wx.navigateTo({
      url: './details/details?refund_id=' + e.target.dataset.refund_id
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})