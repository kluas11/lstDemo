var server = require('../../utils/server');
const app = getApp();
var stopgetCategory;
Page({
  data: {
    wh:null,
    stairId:"",
    topCategories: [],
    subCategories: [],
    nav_avtive: 0,
   loadings:true,
   list_oss:app.image_oss+'130_130'
  },
  onLoad: function() {
    this.getTopCategory();
  },
  // 点击活动
  bannerTap(){
    wx.navigateTo({
      url: '/pages/goods/activity/activity',
    })
  },
  // 点击顶级分类
  tapTopCategory: function(e) {
    stopgetCategory.abort();//结束上一个getCategory请求
    // 拿到objectId，作为访问子类的参数
    var objectId = e.currentTarget.dataset.id;
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      nav_avtive:index,
      loadings:true
    })
    this.getCategory(objectId);
  },
  // 获取顶级分类列表
  getTopCategory: function(parent) {
    var that = this;
    var storeid = app.globalData.store_id;
    server.getJSON("/Goods/goodsCategoryList", {
      store_id: storeid
    }, function(res) {
      // console.log(res.data)
      var categorys = res.data;
      that.setData({
        topCategories: categorys,
      });
      that.getCategory(categorys[0].class_id);
    });
  },
  // 获取二级分类列表
  getCategory: function(parent_id) {
    var that = this;
    var storeid = app.globalData.store_id;    
    stopgetCategory = server.getJSON('/Goods/goodsCategoryList', {
      parent_id,
      store_id: storeid
    }, function(res) {
      var categorys = res.data;
      that.setData({
        subCategories: categorys,
        stairId: parent_id,
        loadings: false
      });
    });
    
  },
  // 查看二级分类商品
  avatarTap: function(e) {
    // 拿到objectId，作为访问子类的参数
    var objectId = e.currentTarget.dataset.objectId;
    var stairId = this.data.stairId
    wx.navigateTo({
      url: "../../../../goods/list/list?categoryId=" + objectId + "&parentId=" + stairId
    });
  }
})