// pages/member/refund/request_refund/only_refund/only_refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusStyle: 'display:none',
    reasonStyle: 'display:none',
    obj: {}
  },

  //货物状态
  statusClick: function() {
    this.changeData('statusStyle', 'display:none', 'display:block')
  },
  //退款原因
  reasonClick: function() {
    this.changeData('reasonStyle', 'display:none', 'display:block')
  },
  //关闭货物状态选项
  selectTopWrapper: function() {
    this.changeData('statusStyle', 'display:block', 'display:none')
  },
  //关闭退款原因选项
  reasonTopWrapper: function() {
    this.changeData('reasonStyle', 'display:block', 'display:none')
  },

  //改变data
  changeData: function(dataName, data, change) {
    if (this.data[dataName] === data) {
      this.setData({
        [dataName]: change
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      obj:JSON.parse(options.obj)
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