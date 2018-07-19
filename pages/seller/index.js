var server = require('../../utils/server');
const App = getApp();
Page({
  data: {
    goods_oss:App.image_oss+'160_170'
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    server.getJSON("/Store/getStoreClass", function(res) {
      var store_class = res.data;
      that.getStoreList(store_class[0].sc_id);
      that.setData({
        store_class: store_class,
        active_index: 0
      });
    });
  },
  getStoreList: function(sc_id) {
    // var lat;
    // var lon;
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res2) {
        server.getJSON("/Store/getStores", {
          cid: sc_id,
          lat: res2.latitude,
          lon: res2.longitude
        }, function(res) {
          var stores = res.data;
          that.setData({
            stores: stores
          });
        });
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
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goods: function(e) {
    console.log(e.currentTarget);
    var id = e.currentTarget.dataset.id;
    getApp().globalData.store_name = e.currentTarget.dataset.store_name;

    wx.switchTab({
      url: '/pages/index/index',
      success: function(res) {
        // success
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(id);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },
  take: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  onClickClass: function(e) {
    var class_id = e.currentTarget.dataset.id;
    var store_class = this.data.store_class;
    var index = e.currentTarget.dataset.index;
    this.getStoreList(class_id);
    this.setData({ 
      active_index:index
      });
  }
})