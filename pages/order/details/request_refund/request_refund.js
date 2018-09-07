// pages/member/refund/request_refund/request_refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      obj: JSON.parse(options.obj)
    })
    console.log(this.data.obj)
  },

  onlyRefund: function() {
    wx.navigateTo({
      url: './only_refund/only_refund?obj=' + JSON.stringify(this.data.obj),
    })
  },

  returnsRefunds: function() {
    wx.navigateTo({
      url: './returns_refunds/returns_refunds?obj=' + JSON.stringify(this.data.obj),
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