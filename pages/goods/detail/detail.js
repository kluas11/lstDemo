var server = require('../../../utils/server');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
const App = getApp();
var objectId;
Page({
  data: {
    goods: {},
    current: 0,
    active_index: 0,
    galleryHeight: App.screenWidth,
    tab: 0,
    collectstate: false,
    goods_num: 1,
    goods_oss: App.image_oss + '750_750',
    wx_loading: true
  },
  // 加入收藏
  addCollect: function(e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.id;
    let collectstate = this.data.collectstate;
    var type = collectstate ? 1 : 0;
    var msg = collectstate ? '取消收藏' : "成功收藏";
    this.getuser_id().then(() => {
      server.getJSON('/Goods/collectGoods', {
          goods_id,
          type
        },
        function(res) {
          console.log(res)
          if (res.data.status) {
            that.setData({
              collectstate: !collectstate
            })
            wx.showToast({
              title: msg,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: "收藏失败",
              icon: '/images/about.png',
              duration: 2000
            })
          }
        });
    })
  },
  // 获取用户信息
  getuser_id() {
    return new Promise((request, reject) => {
      var sessionId = wx.getStorageSync("sessionId");
      if (!sessionId) {
        App.getlogin().then(res => {
          request();
        })
      } else {
        request()
      }
    })
  },
  // ++
  bindMinus: function(e) {
    var num = this.data.goods_num;
    if (num > 1) {
      num--;
    }
    this.setData({
      goods_num: num
    });
  },
  // 数值绑定
  bindManual: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({
      goods_num: num
    });
  },
  //--
  bindPlus: function(e) {
    var num = this.data.goods_num;
    num++;
    this.setData({
      goods_num: num
    });
  },
  // 
  onLoad: function(options) {
    let pages = getCurrentPages();
    App.getsetting(pages, options.objectId).then(() => {
      // 获取到商品ID
      var goodsId = options.objectId;
      objectId = goodsId;
      // 获取到分享商品
      //获取商品详情
      this.getGoodsById(goodsId).then(() => {
        // 用户是否收藏该商品
        if (wx.getStorageSync('sessionId')) {
          this.iscollect();
        }
        //获取附近店铺
        if (!App.globalData.store_id) {
          App.get_getLocation(this.getstore_id)
        }
      });
    })
  },
  iscollect() {
    let that = this;
    server.getJSON("/Goods/isCollect",
      // 传goods_id
      {
        goods_id: objectId
      },
      function(res) {
        that.setData({
          collectstate: res.data ? true : false
        })
      }
    )
  },
  // 顶部导航
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      active_index: index,
      tab: index
    })
  },
  getGoodsById: function(goodsId) {
    var that = this
    return new Promise((reuqest, reject) => {
      server.getJSON('/Goods/goodsInfo', {
        goods_id: goodsId
      }, function(res) {
        var goodsInfo = res.data;
        if (res.statusCode == 200) {
          reuqest();
          that.setData({
            goods: goodsInfo,
            wx_loading: false
          });
        } else {
          wx.showToast({
            title: "数据异常",
            image: "../../../images/about.png"
          })
        }
      });

    })
  },
  //  立即购买了解一下
  immediatelyBuy: function(e) {
    var that = this
    var goods = this.data.goods;
    var goods_num = that.data.goods_num;
    that.getuser_id().then(() => {
      var goodsID = goods.goods_id
      if (goodsID) {
        wx.navigateTo({
          url: '/pages/order/ordersubmit/index?origin=detail' + "&goodsID=" + goodsID + "&goods_num=" + goods_num
        });
      }
    })
    return;
  },
  //  
  /*
    加入购物车
    说明: goods_id，goods_num，
  */
  addCart: function(e) {
    var that = this;
    var goodsId = this.data.goods.goods_id;
    var goodsNum = this.data.goods_num;
    that.getuser_id().then(() => {
      server.newpostJSON('/Cart/addCart', {
        goods_id: goodsId,
        goods_num: goodsNum,
      }, function(res) {
        if (res.data == "1")
          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 1000
          });
        else
          wx.showToast({
            title: "加入购物车失败",
            icon: 'error',
            duration: 1000
          });
      })
    })
    return;
  },
  // 预览图片
  previewImage: function(e) {
    var that = this
    wx.previewImage({
      //从<image>的data-current取到current，得到String类型的url路径
      current: that.data.goods.original_img,
      urls: [that.data.goods.original_img] // 需要预览的图片http链接列表
    })
  },
  // 分享
  onShareAppMessage: function() {
    var path = '/pages/goods/detail/detail?objectId=' + objectId
    return {
      title: this.data.goods.goods_name,
      path: path
    }
  },
  onShow: function() {

  },
  // 首次加入获取最近门店
  gainStore() {
    var that = this;
    var lats = App.globalData.lat
    var lngs = App.globalData.lng
    // 获取最近门店
    // if (typeof options == 'number') {
    return new Promise((resolve, reject) => {
      try {
        server.getJSON('/Index/getNearStore', {
          log: lngs,
          lat: lats
        }, function(res) {
          App.globalData.store_id = res.data.store_id;
          App.globalData.store_name = res.data.store_name;
          that.setData({
            shopName: res.data.store_name
          })
          resolve({
            state: "success"
          })
        })
      } catch (e) {
        reject(e)
      }

    })
    // }
  },
  getstore_id(res) {
    var self = this;
    var latitude = res.latitude || "";
    var longitude = res.longitude || "";
    App.globalData.lat = latitude;
    App.globalData.lng = longitude;
    // 实例划API核心类
    var map = new QQMapWX({
      key: '2NTBZ-BK3W5-NGVIZ-Q5ZZP-L7G5K-GVBFQ' // 必填
    });
    // address: res.result.address_component.city
    // 调用接口
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        if (res.result.ad_info.city != undefined) {
          // self.setData({
          //   address: res.result.ad_info.city
          // });
          App.globalData.city = res.result.ad_info.city;
        }
      },
      fail: function(res) {},
      complete: function(res) {
        self.gainStore().then((res) => {
          // self.loadBanner(self.data.options);
        }, (err) => {

        })
      }
    });
  },
});