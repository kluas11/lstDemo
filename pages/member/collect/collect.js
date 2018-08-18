var server = require('../../../utils/server');
const App = getApp();
var cPage = 1;
Page({
  data: {
    image_oss:App.image_oss+"150_150",
    collects: [],
  },
  details: function(e) {
    var objectId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../../goods/detail/detail?objectId=" + objectId
    });
  },
  deleteGoods: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定删除该收藏吗？',
      success: function(res) {
        if (res.confirm) {
          var goods_id = e.currentTarget.dataset.goodsId;;
          var type = 1;
          server.getJSON('/Goods/collectGoods', {
            goods_id,
            type
          }, function(res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
            cPage = 1;
            that.data.collects = [];
            that.getCollectLists(cPage);
          });
        }
      }
    })
  },
  getCollectLists: function (page) {
    var that = this;
    server.getJSON('/User/getGoodsCollect', {
      p: page
    }, function (res) {
      console.log(res)
      that.setData({
        collects: that.data.collects.concat(res.data)
      });
      wx.stopPullDownRefresh();
    });
  },
  onLoad: function () {
    cPage = 1;
    this.getCollectLists(cPage);
    return;
  },
  onReachBottom: function() {
    this.getCollectLists(++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {
    cPage = 1;
    this.data.collects = [];
    this.getCollectLists(cPage);
  }
});