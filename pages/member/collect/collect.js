var server = require('../../../utils/server');
var cPage = 1;
Page({

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
          var user_id = wx.getStorageSync("user_id");
          var goods_id = e.currentTarget.dataset.goodsId;;
          var type = 1;
          server.getJSON('/Goods/collectGoods', {
            user_id,
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
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({
      tabClasss: classs,
      tab: index
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
    cPage = 1;
    this.data.collects = [];
    this.getCollectLists(cPage);
  },
  data: {
    orders: [],
    collects: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
  },
  getCollectLists: function(page) {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    server.getJSON('/User/getGoodsCollect', {
      user_id: user_id,
      p: page
    }, function(res) {
      console.log(res)
      that.setData({
        collects: that.data.collects.concat(res.data)
      });
      wx.stopPullDownRefresh();
    });
  },
  onLoad: function() {
    cPage = 1;
    this.getCollectLists(cPage);
    return;
  }
});