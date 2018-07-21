var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var App = getApp();
var q;

Page({
  data: {
    "address": "定位中",
    banner: [],
    goods: [],
    shopName: '',
    navArray: [],
    imageErr: "../../images/failImg.png",
    lists_oss: App.image_oss + '72_72',
    goods_oss: App.image_oss + '224_280',
    banner_oss: App.image_oss + '750_290'
  },
  onLoad: function(options) {
    var that = this;
    this.setData({
      options: options
    })
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
    // 首页加载
    this.load();
    // 获取后台设置全部分类
    server.getJSON("/Index/getIndexNav", {}, function(res) {
      if (res.statusCode == 200) {
        that.setData({
          navArray: res.data
        })
      } else {
        console.log(res.errMsg)
      }
    })
  },
  load() {
    var that = this;
    wx.getSetting({
      //判断用户是否已经授权注册
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          // 没有授权，跳到授权注册
          wx.navigateTo({
            url: '/pages/getUser/getUser',
          })
          that.setData({
            register: true
          })
          return;
        } else {
          //已授权
          // console.log("onload")
          App.get_getLocation(that.getstore_id);
          App.getOpenId(function() {
            var openId = App.globalData.openid;
            // 获取openID
            server.getJSON(
              "/User/validateOpenid", {
                openid: openId
              },
              function(res) {
                console.log(res)
                if (res.data.status) {
                  App.globalData.userInfo = {
                    user_id: res.data.user_id
                  };
                  // 全局app变量
                  var user = App.globalData.userInfo;
                  //本地缓存
                  wx.setStorageSync("user_id", user.user_id)
                  App.globalData.login = true;
                }
              });
          });
        }
      }
    })
  },
  getstore_id(res) {
    var self = this;
    // console.log(res)
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
          self.setData({
            address: res.result.ad_info.city
          });
          App.globalData.city = res.result.ad_info.city;
        }
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        self.gainStore().then((res) => {
          // console.log(res)
          self.loadBanner(self.data.options);
        }, (err) => {
          console.log(err)
        })
      }
    });
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
    } else {}
  },
  // 页面显示
  onShow: function() {
    let shopname = App.globalData.store_name;
    const that = this;
    this.setData({
      shopName: shopname ? shopname : ""
    })
    if (this.data.register) {
      // 首页加载
      this.load();
    }
  },
  getInviteCode: function(options) {
    //用户是否通过分享进入，缓存分享者 uidhge 
    if (options.uid != undefined) {
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
          // console.log(res)
          App.globalData.store_id = res.data.store_id;
          // console.log(res.data.store_id.store_id)
          App.globalData.store_name = res.data.store_name;
          that.setData({
            shopName: res.data.store_name
          })
          // console.log(App.globalData.store_id)
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
  loadBanner: function(shopId) {
    // console.log(shopId)
    var that = this;
    var city = that.data.address;
    var storesId = "";
    city = encodeURI(city);
    if (isNaN(shopId)) {
      // console.log('首次进来');
      storesId = App.globalData.store_id;
    } else {
      //console.log('店铺进来');
      storesId = shopId;
    }
    // console.log(storesId);
    // console.log(shopId)
    App.globalData.store_id = storesId;
    // console.log(stroe_id);
    // console.log(getApp().globalData.lat)
    // console.log(getApp().globalData.lng)
    // 获取底部good列表
    server.getJSON("/Index/getColumnGoodlist", {
      store_id: storesId
    }, function(res) {
      if (res.statusCode == 200) {
        // console.log(res)
        that.setData({
          goods: res.data
        });
      } else {
        that.setData({
          goods: [],
        });
      }
    })
    server.getJSON("/Index/getBanner", {}, function(res) {
      // console.log(res)
      let banner = [];
      if (res.statusCode == 200) {
        banner = res.data
      }
      that.setData({
        banner: banner,
      });
    });

    // 获取到
    // 已废弃
    // server.getJSON("/Index/home", {
    //   city: that.data.address,
    //   stroe_id: storesId,
    //   lat: App.globalData.lat,
    //   lon: App.globalData.lng
    // }, function (res) {
    //   console.log(res)
    //   var data = res.data.result;
    //   var banner =data.ad;
    //   // var goods = data.goods;
    //   var ad = res.data.ad;
    //   // console.log(goods)
    //   console.log(banner)
    //   console.log("+++")
    //   console.log(ad)
    //   // App.globalData.store_id = res.data.store_id.store_id;
    //   // console.log(res.data.store_id.store_id)
    //   // App.globalData.store_name = res.data.store_id.store_name;
    //   that.setData({
    //     // shopName: res.data.store_id.store_name,
    //     banner: banner,
    //     // goods: goods,
    //     ad: ad
    //   });
    // });
  },
  // 点击banner图
  clickBanner: function(e) {
    var link = e.currentTarget.dataset.link;
    // var linktype = e.currentTarget.dataset.linktype;
    if (link) {
      wx.navigateTo({
        url: link
      });
    }
  },
  // 优惠券
  // showCoupon: function (e) {
  //   wx.navigateTo({
  //     url: '/pages/member/coupon/index'
  //   })
  // },
  // 我的订单
  // showOrder: function (e) {
  //   wx.navigateTo({
  //     url: '../order/list/list',
  //   })
  // },
  // 我的积分
  // showPoint: function (e) {
  //   wx.navigateTo({
  //     url: '../member/point/point'
  //   })
  // },
  // 我的付款码
  // showMine: function (e) {
  //   wx.navigateTo({
  //     url: "../member/money/money"
  //   });
  // },
  // 附近门店
  // showSeller: function (e) {
  //   wx.navigateTo({
  //     url: '../seller/index'
  //   })
  // },
  // 搜索
  search: function(e) {
    wx.navigateTo({
      url: "../goods/list/list"
    });
  },
  // 会员充值
  // showCarts: function (e) {
  //   wx.navigateTo({
  //     url: '../recharge/recharge'
  //   });
  // },
  // 商品详情
  showDetail: function(e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../goods/detail/detail?objectId=" + goodsId
    });
  },
  // 全部分类
  showtabs: function(e) {
    var links = e.currentTarget.dataset.url;
    console.log(links)
    switch (links) {
      case "/pages/category/category":
        wx.switchTab({
          url: links
        });
        break;
      case "pages/cart/cart":
        wx.switchTab({
          url: "pages/cart/cart"
        });
        break;
      case "pages/member/index/index":
        wx.switchTab({
          url: "pages/member/index/index"
        });
        break;
      default:
        console.log("123")
        break;
    }

  },
  //团购
  // showGroupList: function () {
  //   wx.navigateTo({
  //     url: "../goods/grouplist/list"
  //   });
  // },
  onShareAppMessage: function() {
    var user_id = App.globalData.userInfo.user_id
    console.log(user_id);
    return {
      title: '乐善亭',
      desc: '乐善亭',
      path: '/pages/index/index?uid=' + user_id
    }
  }
})