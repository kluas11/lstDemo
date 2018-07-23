var server = require('../../../utils/server');
const App = getApp();
var cPage = 0;
Page({
  data: {
    orders: [],
    collects: [],
    goods_oss: App.image_oss+'150_150'
  },
  details: function(e) {
    var objectId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "/pages/goods/detail/detail?objectId=" + objectId
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
          var user_id = wx.getStorageSync('user_id');
          var goods_id = e.currentTarget.dataset.goodsId;;
          var ctype = 1;
          server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function(res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
            cPage = 0;
            that.data.collects = [];
            that.getCollectLists(0);
          });
        }
      }
    })
  },
  onReachBottom: function() {
    this.getCollectLists(++cPage);
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function() {
    cPage = 0;
    this.data.collects = [];
    this.getCollectLists(0);

  },
  getCollectLists: function(page) {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    server.getJSON('/User/getGoodsCollect/user_id/' + user_id + "/page/" + page, function(res) {
      var datas = res.data.result;
      var ms = that.data.collects
      for (var i in datas) {
        ms.push(datas[i]);
      }
      wx.stopPullDownRefresh();
      that.setData({
        collects: ms
      });
    });
  },
  onLoad: function() {
    cPage = 0;
    this.getCollectLists(0);
    return;
  }
});