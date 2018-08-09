var server = require('../../utils/server');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var App = getApp();
Page({
  data: {
    "address": "定位中",
    banner: [],
    goods: [],
    shopName: '',
    navArray: [],
    imageErr: "./images/icon_empty.png",
    lists_oss: App.image_oss + '72_72',
    goods_oss: App.image_oss + '224_280',
    banner_oss: App.image_oss + '750_290',
    cuoponhidden: false,
    homeIndex: true //优惠券按钮判断
  },
  onLoad: function(options) {
    // console.log("1111111",options)
    if (options.q){
      var obj = decodeURIComponent(options.q);
    }
    var that = this;
    wx.showToast({
      title: 'loading...',
      icon: "loading",
      duration: 99999
    })
    this.setData({
      options: options
    })
    //判断用户来源
    this.getInviteCode(options);
    // 首页加载
    // console.log(options)
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
    App.get_getLocation(this.getstore_id);
    App.getlogin();
  },
  getstore_id(res) {
    var self = this;
    // console.log("用户位置",res)
    var latitude = res.latitude || "";
    var longitude = res.longitude || "";
    App.globalData.lat = latitude;
    App.globalData.lng = longitude;
    // 实例划API核心类
    var map = new QQMapWX({
      key: '2NTBZ-BK3W5-NGVIZ-Q5ZZP-L7G5K-GVBFQ' // 必填
    });
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
      fail: function(res) {},
      complete: function(res) {
        // console.log(self.data.options)
        if (self.data.options.store_id) {
          self.loadBanner(self.data.options.store_id);
        } else {
          self.gainStore().then((res) => {
            self.loadBanner(self.data.options.store_id);
          }, (err) => {
            console.log(err)
          })
        }

      }
    });
  },
  // 页面显示
  onShow: function() {
    
  },
  getInviteCode: function(options) {
    //用户是否通过首页分享进入，缓存分享者 uidhge 
    if (options.uid != undefined || options.scene) {
      let uid = options.uid ? options.uid : options.scene;
      wx.setStorage({
        key: "scene",
        data: uid
      })
      wx.showToast({
        title: '来自用户:' + uid + '的分享',
        icon: 'success',
        duration: 3000
      })
    }
  },
  // 首次加入获取最近门店
  gainStore() {
    var that = this;
    var lats = App.globalData.lat
    var lngs = App.globalData.lng
    // 获取最近门店
    return new Promise((resolve, reject) => {
      try {
        server.getJSON('/Index/getNearStore', {
          log: lngs,
          lat: lats
        }, function(res) {
          App.globalData.store_id = res.data.store_id
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
      // console.log('店铺进来');
      storesId = shopId;
      that.setData({
        shopName: App.globalData.store_name
      })
    }

    App.globalData.store_id = storesId;
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
      wx.hideToast();
    });
  },
  // 点击banner图
  clickBanner: function(e) {
    var link = e.currentTarget.dataset.link;
    // var linktype = e.currentTarget.dataset.linktype;
    wx.showLoading()
    if (link) {
      switch (link.slice(0, 5)) {
        case "https":
          wx.navigateTo({
            url: "/pages/web-view/web-view?url=" + link,
            success() {
              wx.hideLoading()
            }
          });
          break;
        case "/page":
          wx.navigateTo({
            url: link,
            success() {
              wx.hideLoading()
            }
          });
          break;
      }
    } else {
      wx.hideLoading();
      return;
    }
  },
  // 搜索
  search: function(e) {
    wx.navigateTo({
      url: "../goods/list/list"
    });
  },
  // 获取优惠券
  getcouponTap() {
    let that = this;
    this.setData({
      cuoponhidden: true
    })
    server.getJSON("/Index/getCouponList", {
      store_id: App.globalData.store_id
    }, function(res) {
      console.log(res)
      that.setData({
        cuoponlist: res.data
      })
    });
  },
  // 去领取优惠券
  receivetap(e) {
    let coupon_id = e.currentTarget.dataset.coupon_id;
    server.newpostJSON("/Index/receiveCoupon", {
      coupon_id,
      user_id: wx.getStorageSync("user_id")
    }, function(res) {
      if (res.data.status) {
        wx.showToast({
          title: '领取成功',
          icon: "success"
        })
      } else {
        wx.showToast({
          title: '领取失败',
          image: '../../images/about.png',
        })
      }
    });
  },
  // 关闭领券
  hidetap(e) {
    if (e.target.id === 'cuopon_info') {
      this.setData({
        cuoponhidden: false
      })
    } else {
      return;
    }
  },
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
    console.log(!links)
    if (links == ("/pages/category/category" || "/pages/cart/cart" || "/pages/member/index/index")) {
      // 转到底部导航页面
      wx.switchTab({
        url: links
      });
    } else if (!links || links == "/pages/goods/grouplist/list") {
      //   // 还在开发页面
      wx.showToast({
        title: '功能维护中',
        icon: "success"
      })
    } else {
      // 转到普通页面
      wx.navigateTo({
        url: links,
      })
    }
  },
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