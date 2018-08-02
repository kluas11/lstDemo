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
    imageErr: "./images/icon_empty.png",
    lists_oss: App.image_oss + '72_72',
    goods_oss: App.image_oss + '224_280',
    banner_oss: App.image_oss + '750_290',
    cuoponhidden:false
  },
  onLoad: function(options) {
    // this.getcouponTap();
    // console.log(options)
    var that = this;
    wx.showToast({
      title: 'loading...',
      icon: "loading",
      duration: 99999
    })
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
        if (JSON.stringify(self.data.options) != "{}") {
          self.loadBanner(self.data.options);
        } else {
          self.gainStore().then((res) => {
            self.loadBanner(self.data.options);
          }, (err) => {
            console.log(err)
          })
        }

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
          App.globalData.store_id = res.data.store_id;
          // console.log(res.data.store_id.store_id)
          App.globalData.store_name = res.data.store_name;
          that.setData({
            shopName: res.data.store_name
          })
          console.log("门店ID",App.globalData.store_id)
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
  getcouponTap(){
    let that = this;
    this.setData({
      cuoponhidden:true
    })
    server.getJSON("/Index/getCouponList", {
      store_id: 26
    }, function (res) {
      console.log(res)
      that.setData({
          cuoponlist:res.data
        })
    });
  },
  // 去领取优惠券
  receivetap(e){
    console.log(e)
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
    }else{
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