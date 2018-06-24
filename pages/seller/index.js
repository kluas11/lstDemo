var server = require('../../utils/server');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    server.getJSON("/Store/getStoreClass", function (res) {
      var store_class = res.data;
      for (var i = 0; i < store_class.length; i++) {
        if (i == 0) {
          store_class[i].select = 1;
          console.log(store_class[i])
          that.getStoreList(store_class[i].sc_id);
        }
        else {
          store_class[i].select = 0;
        }
      }
      that.setData({ store_class: store_class });
    });
  },
  getStoreList: function (sc_id) {
    // var lat;
    // var lon;
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res2) {
        console.log(res2)

        
        server.getJSON("/Store/getStores", { cid: sc_id, lat: res2.latitude, lon: res2.longitude }, function (res) {
          var stores = res.data;
          that.setData({ stores: stores });
          console.log(res)

        });
        // lat = res2.latitude;
        // lon = res2.longitude;
      }
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log('onShow')
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goods: function (e) {
    console.log(e.currentTarget);
    var id = e.currentTarget.dataset.id;
    getApp().globalData.store_name = e.currentTarget.dataset.store_name;

    wx.switchTab({
      url: '../index/index',
      success: function (res) {
        // success
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(id);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });

    /*
    wx.navigateTo({
      url: 'goods?id=' + id,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    */

  },
  take: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  onClickClass: function (e) {
    var class_id = e.currentTarget.dataset.id;
    var store_class = this.data.store_class;
    for (var i = 0; i < store_class.length; i++) {
      if (store_class[i].sc_id == class_id) {
        store_class[i].select = 1;
        this.getStoreList(store_class[i].sc_id);
      }
      else {
        store_class[i].select = 0;
      }
    }
    this.setData({ store_class: store_class });
  }
})