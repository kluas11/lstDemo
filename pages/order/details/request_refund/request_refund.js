// pages/member/refund/request_refund/request_refund.js
let server = require('../../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    order_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(options.order_id, options.id)
    this.setData({
      order_id: options.order_id
    })
  },

  //获取退款状态
  getData: function(order_id, id) {
    var _this = this;
    server.getJSON('/OrderRefund/getBeRefundedGood', {
        id,
        order_id
      },
      function(res) {
        console.log(res)
        _this.setData({
          obj: res.data
        })
      })
  },

  //仅退款
  onlyRefund: function() {
    wx.redirectTo({
      url: './only_refund/only_refund?obj=' + JSON.stringify(this.data.obj) + '&order_id=' + this.data.order_id
    })
  },

  //退货退款
  returnsRefunds: function() {
    wx.redirectTo({
      url: './returns_refunds/returns_refunds?obj=' + JSON.stringify(this.data.obj) + '&order_id=' + this.data.order_id
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