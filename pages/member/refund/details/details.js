// pages/member/refund/details/details.js
let server = require('../../../../utils/server')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    refund_time: 0,
    add_time: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(options.refund_id)
  },

  //获取退款详情
  getData: function(refund_id) {
    let _this = this
    server.getJSON('/OrderRefund/getUserRefundDetails', {
        refund_id: refund_id
      },
      function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          _this.setData({
            obj: res.data,
            refund_time: parseInt(res.data.refund_time),
            add_time: parseInt(res.data.add_time)
          })
          setTimeout(() => {
            _this.date(_this.data.refund_time, 'refund_time'),
              _this.date(_this.data.add_time, 'add_time')
          }, 50)
        }
      })
  },

  //时间
  date: function(input, key) {
    let d = new Date(input);
    let year = d.getFullYear();
    let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    this.setData({
      [key]: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
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