var server = require('../../../utils/server');
var cPage = 0;
var ctype = "0";
Page({
  data: {
    cuopon_cart:true,//判断是不是我的优惠券页面
  },
  onLoad: function(option) {
    this.getcuoponlist();
  },
  // onReachBottom: function() {
  //   this.getcuoponlist();
  //   wx.showToast({
  //     title: '加载中',
  //     icon: 'loading'
  //   })
  // },
  receivetap(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getcuoponlist: function() {
    var that = this;
    server.getJSON('/User/getUserCoupon', function(res) {
      console.log(res)
      that.setData({
        cuoponlist:res.data
      })
    });
  },
});