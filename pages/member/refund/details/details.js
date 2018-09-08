// pages/member/refund/details/details.js
let server = require('../../../../utils/server')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    certificate: [],
    refund_time: "",
    add_time: ""
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
            certificate: res.data.images.split(",")
          })
          _this.date(parseInt(res.data.refund_time), 'refund_time')
          _this.date(parseInt(res.data.add_time), 'add_time')
        }
      })
  },

  //时间
  date: function(timeStamp, key) {
    if (!timeStamp) return
    let date = new Date();
    date.setTime(timeStamp * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    this.setData({
      [key]: y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    })
  },

  //打开大图
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.certificate // 需要预览的图片http链接列表
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