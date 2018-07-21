var server = require('../../../utils/server');
const App = getApp();
Page({
  data: {
    goods_oss: App.image_oss + '130_150'
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var app = getApp();
    var order_id = options.order_id;
    var glo_userid = App.globalData.userInfo && App.globalData.userInfo.user_id;
    var user_id = glo_userid ? glo_userid : wx.getStorageSync("user_id");
    server.getJSON('/order/orderDetails', {
        order_id
      },
      function(res) {
        var result = res.data;
        console.log(result)
        that.setData({
          result: result
        });
      });

  },
  details: function(e) {
    var no = e.currentTarget.dataset.no;
    wx.navigateTo({
      url: '../../details/details?no=' + no,
      success: function(res) {
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})