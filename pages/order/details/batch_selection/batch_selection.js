// pages/order/details/batch_selection/batch_selection.js
let server = require('../../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    goodsList: [],
    notSelected: '/images/not-selected.png',
    active: '/images/active.png',
    selectAll: '/images/not-selected.png',
    activeArr: []
  },

  //商品选择
  active: function(e) {
    let arr = this.data.activeArr
    arr[e.currentTarget.dataset.index] = !arr[e.currentTarget.dataset.index]
    if (!arr[e.currentTarget.dataset.index]) {
      this.setData({
        selectAll: '/images/not-selected.png'
      })
    }
    //判断是否全选
    let arrLength = 0
    arr.forEach((item) => {
      if (item) {
        arrLength++
        if (arrLength === arr.length) {
          this.setData({
            selectAll: '/images/active.png'
          })
        }
      }
    })
    this.setData({
      activeArr: arr
    })
  },

  //全选
  selectAll: function() {
    let arr = this.data.activeArr
    if (this.data.selectAll === '/images/not-selected.png') {
      arr.forEach((item, index) => {
        arr[index] = true
      })
      this.setData({
        selectAll: '/images/active.png',
        activeArr: arr
      })
    } else {
      arr.forEach((item, index) => {
        arr[index] = false
      })
      this.setData({
        selectAll: '/images/not-selected.png',
        activeArr: arr
      })
    }
  },

  //批量退款时获取商品详情列
  getData: function(order_id) {
    var _this = this;
    server.getJSON('/OrderRefund/getBeRefundedGoodsList', {
        order_id
      },
      function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          let arr = []
          for (let i = 0; i < res.data.length; i++) {
            arr.push(false)
          }
          _this.setData({
            goodsList: res.data,
            activeArr: arr
          })
        }
      })
  },

  //确认
  confirm: function() {
    wx.navigateTo({
      url: './request_refund/request_refund?order_id=' + this.data.order_id + '&activeArr=' + this.data.activeArr,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(options.order_id)
    this.setData({
      order_id: options.order_id
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