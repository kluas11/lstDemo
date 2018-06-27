var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var server = require('../../utils/server');
var seat;
var isLoc = false;
var q;

Page({
  data: {
    "address": "定位中",
    banner: [],
    goods: [],
    bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth),
    shopName: ''
  },

  onLoad: function(options) {
    if (options.q !== undefined) {
      q = options.q;
    }

    var scene = decodeURIComponent(options.scene);
    wx.setStorage({
      key: "scene",
      data: scene
    })
    this.getInviteCode(options);
    console.log(options);
    var app = getApp();
    app.getOpenId(function() {

      var openId = getApp().globalData.openid;
      console.log(openId)

      server.getJSON("/User/validateOpenid", {
        openid: openId
      }, function(res) {

        if (res.data.code == 200) {
          console.log('【/User/validateOpenid】')
          console.log(res.data.data)
          getApp().globalData.userInfo = res.data.data;
          var user = app.globalData.userInfo;
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                  url: '../getUser/getUser'
                })
              }
            }
          })
          getApp().globalData.login = true;
        } else {
          if (res.data.code == '400') {
            console.log("need register");
            wx.navigateTo({
              url: '../getUser/getUser'
            })
          }
        }
      });

    });

    /* 加载首页banner 和 商品分类 开始 */
    var app = getApp();
    var self = this;
    self.loadBanner(options);
    if (isLoc) {
      var address = getApp().globalData.city;
      this.setData({
        address: address
      });
      self.loadBanner(options);
      return;
    }

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;

        app.globalData.lat = latitude;
        app.globalData.lng = longitude;

        // 实例划API核心类
        var map = new QQMapWX({
          key: 'Q4NBZ-2PIH6-IITSM-MKJOI-IVPGF-WMBBG' // 必填
        });
        // address: res.result.address_component.city
        // 调用接口
        map.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log(res);

            if (res.result.ad_info.city != undefined) {
              self.setData({
                address: res.result.ad_info.city
              });
              getApp().globalData.city = res.result.ad_info.city;
              isLoc = true;
              self.loadBanner(options);
            }
          },
          fail: function(res) {
            //console.log(res);
          },
          complete: function(res) {
            //console.log(res);
          }
        });
      }
    })
    /* 加载首页banner 和 商品分类 结束 */
  },

  onReady: function() {
    if (q !== undefined) {
      var scan_url = decodeURIComponent(q);
      console.log(scan_url);
      var store_id = scan_url.substring(scan_url.indexOf('store_id'), scan_url.length);
      wx.navigateTo({
        url: '/pages/payment/payment' + '?' + store_id,
      })
      return;
    } else {
      console.log(123);
    }
  },

  //跳转视频
  jumpVideo: function() {
    wx.navigateTo({
      url: '../video/video',
    })
  },

  showCoupon: function(e) {
    wx.navigateTo({
      url: '../member/coupon/index'
    })
  },

  showOrder: function(e) {
    wx.navigateTo({
      url: '../order/list/list',
    })
  },

  showPoint: function(e) {
    wx.navigateTo({
      url: '../member/point/point'
    })
  },

  showMine: function(e) {
    wx.navigateTo({
      url: "../member/money/money"
    });
  },

  showSeller: function(e) {
    wx.navigateTo({
      url: '../seller/index'
    })
  },

  search: function(e) {
    wx.navigateTo({
      url: "../search/index"
    });
  },

  showCarts: function(e) {
    wx.navigateTo({
      url: '../recharge/recharge'
    });
  },

  getInviteCode: function(options) {

    if (options.uid != undefined) {
      wx.setStorage({
        key: "scene",
        data: options.uid
      })
      wx.showToast({
        title: '来自用户:' + options.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },

  loadBanner: function(shopId) {
    var that = this;
    var city = that.data.address;
    city = encodeURI(city);

    console.log(isNaN(shopId));
    if (isNaN(shopId)) {
      //console.log('首次进来');
      var stroe_id = '';
    } else {
      //console.log('店铺进来');
      var stroe_id = shopId;
    }

    getApp().globalData.stroe_id = stroe_id;
    console.log(stroe_id);
    server.getJSON("/Index/home", {
      city: that.data.address,
      stroe_id: stroe_id
    }, function(res) {
      console.log(res)
      var banner = res.data.result.ad;
      var goods = res.data.result.goods;
      var ad = res.data.ad;
      getApp().globalData.store_id = res.data.store_id.store_id;
      console.log(res.data.store_id.store_id)
      getApp().globalData.store_name = res.data.store_id.store_name;
      that.setData({
        shopName: res.data.store_id.store_name,
        banner: banner,
        goods: goods,
        ad: ad
      });
    });
  },

  loadMainGoods: function() {
    var that = this;
    var query = new AV.Query('Goods');
    query.equalTo('isHot', true);
    query.find().then(function(goodsObjects) {
      that.setData({
        goods: goodsObjects
      });
    });
  },

  onShow: function() {
    this.setData({
      shopName: getApp().globalData.store_name
    })
    /*
    var app = getApp();
    var self = this;
    self.loadBanner( );
    if (isLoc) {
      var address = getApp().globalData.city;
      this.setData({ address: address });
      self.loadBanner( );
      return;
    }
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;

        app.globalData.lat = latitude;
        app.globalData.lng = longitude;

        // 实例划API核心类
        var map = new QQMapWX({
          key: 'Q4NBZ-2PIH6-IITSM-MKJOI-IVPGF-WMBBG' // 必填
        });
        ////address: res.result.address_component.city
        // 调用接口
        map.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);

            if (res.result.ad_info.city != undefined) {
              self.setData({

                address: res.result.ad_info.city
              });
              getApp().globalData.city = res.result.ad_info.city;
              isLoc = true;
              self.loadBanner( );
            }
          },
          fail: function (res) {
            //console.log(res);
          },
          complete: function (res) {
            //console.log(res);
          }
        });
      }
    })
    */
  },

  clickBanner: function(e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    var linktype = e.currentTarget.dataset.linktype;
    console.log(linktype)
    console.log(linktype == 'website')

    if (linktype == 'website') {
      wx.navigateTo({
        url: "/pages/web-view/web-view?url=" + goodsId
      });
    } else {
      wx.navigateTo({
        url: "../goods/detail/detail?objectId=" + goodsId
      });
    }
  },

  showDetail: function(e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../goods/detail/detail?objectId=" + goodsId
    });
  },

  showCategories: function() {
    wx.switchTab({
      url: "../category/category"
    });
  },

  showGroupList: function() {
    wx.navigateTo({
      url: "../goods/grouplist/list"
    });
  },

  onShareAppMessage: function() {
    var user_id = getApp().globalData.userInfo.user_id
    console.log(user_id);
    return {
      title: '品尚医药',
      desc: '品尚医药',
      path: '/pages/index/index?uid=' + user_id
    }
  },

  select: function() {
    wx.navigateTo({
      url: '../switchcity/switchcity'
    })
  },

})