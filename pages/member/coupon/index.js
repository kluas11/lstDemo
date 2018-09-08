var server = require('../../../utils/server');
var cPage = 0;
var ctype = "0";
Page({
  data: {
    cuopon_cart: true, //判断是不是我的优惠券页面
    tablists: [{
        name: "可使用",
        type: 'getUserCoupon'
      },
      {
        name: "已使用",
        type: 'getuserCouponUsed'
      }, {
        name: "已过期",
        type: 'getUserCouponExc'
      }
    ],
    tabtype: "getUserCoupon",
    pagetype: "all",
    isload: true
  },
  onLoad: function(option) {
    this.getUserCoupon("getUserCoupon");
  },
  onShow() {
    if (!this.data.isload) {
      this.getUserCoupon("getUserCoupon");
    }
  },
  //点击tab
  tabTap(e) {
    let tabtype = e.target.dataset.type;
    if (tabtype) {
      this.getUserCoupon(tabtype);
      this.setData({
        tabtype,
        pagetype: "all"
      })
    }
  },
  //点击page
  pageTap(e) {
    let pagetype = e.target.dataset.type;
    let couponData = this.data.couponData;
    if (pagetype && couponData) {
      let cuoponlist;
      let goodsCuoponlist;
      let empty;
      switch (pagetype) {
        case 'online':
          cuoponlist = couponData.online
          empty = couponData.online.length == 0 ? true : false
          goodsCuoponlist = []
          break;
        case 'offline':
          cuoponlist = []
          goodsCuoponlist = couponData.offline
          empty = couponData.offline.length == 0 ? true : false
          break;
        default:
          cuoponlist = couponData.online
          goodsCuoponlist = couponData.offline
          if (couponData.offline.length == 0 && couponData.online.length == 0) {
            empty = true
          } else {
            empty = false
          }
          break;
      }
      this.setData({
        pagetype,
        goodsCuoponlist,
        cuoponlist,
        empty
      })
    } else {
      return;
    }
  },
  // 去使用
  receivetap(e) {
    let status = e.target.dataset.status;
    let id = e.target.dataset.id;
    if (status && status == 'offline') {
      wx.navigateTo({
        url: '/pages/coupon/bg_detail/detail?id=' + id,
      })
    } else if (status && status == 'online') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      return;
    }
  },
  // 赠送
  detailtap(e) {
    let status = e.target.dataset.status;
    let id = e.target.dataset.id;
    if (status && status == 'offline') {
      wx.navigateTo({
        url: '/pages/coupon/bg_detail/detail?id=' + id,
      })
    } else if (status && status == 'online') {
      wx.navigateTo({
        url: '/pages/coupon/b_detail/b_detail?id=' + id,
      })
    } else {
      return;
    }
  },
  // 优惠券
  getUserCoupon: function(type) {
    var that = this;
    let url = `/Coupon/${type}`;
    let cuoponlist;
    let goodsCuoponlist;
    let couponData;
    let empty = false;
    server.getJSON(url, function(res) {
      console.log(res)
      if (typeof(res.data) === "string") {
        cuoponlist = [];
        goodsCuoponlist = [];
        couponData = false;
      } else if (res.data.online) {
        cuoponlist = res.data.online;
        goodsCuoponlist = res.data.offline;
        couponData = res.data
      }
      if (cuoponlist.length == 0 && goodsCuoponlist.length == 0) {
        empty = true;
      }
      that.setData({
        couponData,
        cuoponlist,
        goodsCuoponlist,
        empty,
        idload: false
      })
    });
  }
});