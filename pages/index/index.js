var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var App = getApp();
var seat;
var q;

Page({
  data: {
    "address": "定位中",
    banner: [],
    goods: [],
    bannerHeight: Math.ceil(290.0 / 750.0 * App.screenWidth),
    shopName: ''
  },
  onLoad: function (options) {
    if (options.q !== undefined) {
      q = options.q;
    }
    var scene = decodeURIComponent(options.scene);
    wx.setStorage({
      key: "scene",
      data: scene
    })

    //判断用户来源
    this.getInviteCode(options);
    App.getOpenId(function () {
      var openId = App.globalData.openid;
      console.log(openId)
      server.getJSON("/User/validateOpenid", {
        openid: openId
      }, function (res) {
        if (res.data.code == 200) {
          // console.log("用户信息",res.data.data)
          App.globalData.userInfo = res.data.data;
          var user = App.globalData.userInfo;
          wx.setStorageSync("user_id", user.user_id)
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                  url: '../getUser/getUser'
                })
              }
            }
          })
          App.globalData.login = true;
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
    var self = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;

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
          success: function (res) {
            console.log(res)
            if (res.result.ad_info.city != undefined) {
              self.setData({
                address: res.result.ad_info.city
              });
              App.globalData.city = res.result.ad_info.city;
            }
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            self.loadBanner(options);
          }
        });
      }
    })
    /* 加载首页banner 和 商品分类 结束 */
  },
  onReady: function () {
    if (q !== undefined) {
      var scan_url = decodeURIComponent(q);
      console.log(scan_url);
      var store_id = scan_url.substring(scan_url.indexOf('store_id'), scan_url.length);
      wx.navigateTo({
        url: '/pages/payment/payment' + '?' + store_id,
      })
      return;
    } else {
    }
  },
  // 页面显示
  onShow: function () {
    let shopname =App.globalData.store_name;
    this.setData({
      shopName: shopname ? shopname : ""
    })
  },
  getInviteCode: function (data) {
    //用户是否通过分享进入，缓存分享者 uid
    if (data.uid != undefined) {
      wx.setStorage({
        key: "scene",
        data: data.uid
      })
      wx.showToast({
        title: '来自用户:' + data.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },
  loadBanner: function (shopId) {
    var that = this;
    var city = that.data.address;
    city = encodeURI(city);
    // console.log(isNaN(shopId));
    if (isNaN(shopId)) {
      //console.log('首次进来');
      var stroe_id = '';
    } else {
      //console.log('店铺进来');
      var stroe_id = shopId;
    }
    App.globalData.stroe_id = stroe_id;
    // console.log(stroe_id);
    // console.log(getApp().globalData.lat)
    // console.log(getApp().globalData.lng)
    server.getJSON("/Index/home", {
      city: that.data.address,
      stroe_id: stroe_id,
      lat: App.globalData.lat,
      lon: App.globalData.lng
    }, function (res) {
      console.log(res)
      var data = res.data.result;
      var banner =data.ad;
      var goods = data.goods;
      var ad = res.data.ad;
      App.globalData.store_id = res.data.store_id.store_id;
      App.globalData.store_name = res.data.store_id.store_name;
      that.setData({
        shopName: res.data.store_id.store_name,
        banner: banner,
        goods: goods,
        ad: ad
      });
    });
  },
  // 点击banner图
  clickBanner: function (e) {
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
        url: "/pages/goods/detail/detail?objectId=" + goodsId
      });
    }
  },
  // 优惠券
  showCoupon: function (e) {
    wx.navigateTo({
      url: '../member/coupon/index'
    })
  },
  // 我的订单
  showOrder: function (e) {
    wx.navigateTo({
      url: '../order/list/list',
    })
  },
  // 我的积分
  showPoint: function (e) {
    wx.navigateTo({
      url: '../member/point/point'
    })
  },
  // 我的付款码
  showMine: function (e) {
    wx.navigateTo({
      url: "../member/money/money"
    });
  },
  // 附近门店
  showSeller: function (e) {
    wx.navigateTo({
      url: '../seller/index'
    })
  },
  // 搜索
  search: function (e) {
    wx.navigateTo({
      url: "../search/index"
    });
  },
  // 会员充值
  showCarts: function (e) {
    wx.navigateTo({
      url: '../recharge/recharge'
    });
  },
  // 商品详情
  showDetail: function (e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../goods/detail/detail?objectId=" + goodsId
    });
  },
  // 全部分类
  showCategories: function () {
    wx.switchTab({
      url: "../category/category"
    });
  },
  //团购
  showGroupList: function () {
    wx.navigateTo({
      url: "../goods/grouplist/list"
    });
  },
  onShareAppMessage: function () {
    var user_id = App.globalData.userInfo.user_id
    console.log(user_id);
    return {
      title: '乐善亭',
      desc: '乐善亭',
      path: '/pages/index/index?uid=' + user_id
    }
  }
})