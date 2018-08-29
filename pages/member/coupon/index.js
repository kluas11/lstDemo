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
        name: "不可用",
        type: 'getUserCouponExc'
      }
    ],
    tabtype: "getUserCoupon",
    pagetype: "all"
  },
  onLoad: function(option) {
    this.getUserCoupon("getUserCoupon");
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
  // 查看优惠券详情
  detailTap(e){
    console.log(e)
  },
  // 使用
  receivetap(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
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
      if (typeof(res.data) === "string") {
        cuoponlist = [];
        goodsCuoponlist = [];
        couponData = false;
      } else {
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
        empty
      })
    });
  }
});