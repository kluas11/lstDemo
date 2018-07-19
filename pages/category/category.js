var server = require('../../utils/server');
const app = getApp();
var stopgetCategory;
var stopgetBanner;
Page({
  data: {
    wh:null,
    stairId:"",
    topCategories: [],
    subCategories: [],
    banner: '',
    nav_avtive: 0,
   loadings:true,
   list_oss:app.image_oss+'130_130'
  },

  onLoad: function() {
    // this.setData({
    //   loadings: true
    // })
    this.getTopCategory();
    try {
      var res = wx.getSystemInfoSync();
      // console.log(res.windowHeight)
      this.setData({
        wh: res.windowHeight + 'px'
      })

    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
  },

  tapTopCategory: function(e) {
    stopgetCategory.abort();//结束上一个getCategory请求
    stopgetBanner.abort();//结束上一个getBanner请求
    // 拿到objectId，作为访问子类的参数
    var objectId = e.currentTarget.dataset.id;
    var banner_name = e.currentTarget.dataset.banner;
    var index = parseInt(e.currentTarget.dataset.index);
    // if (index == this.data.nav_avtive || this.data.loadings==true){
    //   return;
    // }
    this.setData({
      nav_avtive:index,
      loadings:true
    })
    this.getCategory(objectId);
    this.getBanner(banner_name);
  },

  clickBanner: function(e) {
    var goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../goods/detail/detail?objectId=" + goodsId
    });
  },

  getTopCategory: function(parent) {
    var that = this;
    server.getJSON("/Goods/goodsCategoryList", {
      store_id: getApp().globalData.store_id
    }, function(res) {
      // console.log(res)
      var categorys = res.data.result;
      console.log(categorys)
      that.setData({
        topCategories: categorys,
      });
      that.getCategory(categorys[0].id);
      // console.log(categorys[0].name)
      that.getBanner(categorys[0].name);
    });
  },
  getCategory: function(parent) {
    var that = this;
    console.log(parent)
    stopgetCategory = server.getJSON('/Goods/goodsCategoryList/parent_id/' + parent, {
      
      store_id:getApp().globalData.store_id
    }, function(res) {
      console.log(res)
      var categorys = res.data.result;
      that.setData({
        subCategories: categorys,
        stairId: parent,
        loadings: false
      });
    });
    
  },
  avatarTap: function(e) {
    // 拿到objectId，作为访问子类的参数
    var objectId = e.currentTarget.dataset.objectId;
    var stairId = this.data.stairId
    wx.navigateTo({
      url: "../../../../goods/list/list?categoryId=" + objectId + "&parentId=" + stairId
    });
  },

  getBanner: function(banner_name) {
    var that = this;
    stopgetBanner = server.getJSON('/goods/categoryBanner/banner_name/' + banner_name, function(res) {
      // console.log(res);
      var banner = res.data.banner ? res.data.banner:'';
      that.setData({
        banner: banner
      });
    });
  }
})