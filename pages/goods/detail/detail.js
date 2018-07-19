var server = require('../../../utils/server');
const App = getApp();
var objectId;
Page({
  data: {
    goods: {},
    current: 0,
    active_index:0,
    galleryHeight: App.screenWidth,
    tab: 0,
    collectstate:false,
    goods_num: 1,
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    goods_oss:App.image_oss+'750_750'
  },
  propClick: function(e) {
    var pos = e.currentTarget.dataset.pos;
    var index = e.currentTarget.dataset.index;
    var goods = this.data.goods
    for (var i = 0; i < goods.goods.goods_spec_list[index].length; i++) {
      if (i == pos)
        goods.goods.goods_spec_list[index][pos].isClick = 1;
      else
        goods.goods.goods_spec_list[index][i].isClick = 0;
    }

    this.setData({
      goods: goods
    });
  
    this.checkPrice();
  },
  addCollect: function(e) {
    var that=this;
    var goods_id = e.currentTarget.dataset.id;
    console.log(goods_id);
    var user_id = wx.getStorageSync("user_id");
    var ctype = 0;
    server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function(res) {
      console.log(res)
      that.setData({
        collectstate:true
      })
      wx.showToast({
        title:res.data.msg,
        icon: 'success',
        duration: 2000
      })
    });
  },
  bindMinus: function(e) {

    var num = this.data.goods_num;
    if (num > 1) {
      num--;
    }
    this.setData({
      goods_num: num
    });
  },
  bindManual: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({
      goods_num: num
    });
  },
  bindPlus: function(e) {
    var num = this.data.goods_num;
    num++;
    this.setData({
      goods_num: num
    });
  },
  onLoad: function(options) {

    var goodsId = options.objectId;
    objectId = goodsId;
    // this.get_getLocation();
    this.getGoodsById(goodsId);
  },
  getScopes(){
    console.log(1111111111)
  },
  tabClick: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      active_index: index,
      tab: index
    })
  },
  getGoodsById: function(goodsId) {
    var that = this
    server.getJSON('/Goods/goodsInfo/id/' + goodsId, function(res) {
      var goodsInfo = res.data.result;
      that.setData({
        goods: goodsInfo
      });
      that.checkPrice();
    });
  },
  checkPrice: function() {
    var goods = this.data.goods;
    var spec = ""
    this.setData({
      price: goods.goods.shop_price
    });
    if (!goods.goods.goods_spec_list) {
      return;
    }
    for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
      for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
        if (goods.goods.goods_spec_list[i][j].isClick == 1) {
          if (spec == "")
            spec = goods.goods.goods_spec_list[i][j].item_id
          else
            spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
        }
      }
    }
    console.log(spec);

    var specs = spec.split("_");
    for (var i = 0; i < specs.length; i++) {
      specs[i] = parseInt(specs[i])
    }
    specs.sort(function(a, b) {
      return a - b
    });
    spec = ""
    for (var i = 0; i < specs.length; i++) {
      if (spec == "")
        spec = specs[i]
      else
        spec = spec + "_" + specs[i]
    }
    console.log(spec);
    var price = goods['spec_goods_price'][spec].price;
    console.log(price);
    this.setData({
      price: price
    });
  },

  bug: function() {
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {

        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }

    var that = this;

    // console.log(that.data.goods);return;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = App.globalData.openid //that.data.goods.goods.spec_goods_price
    var goods_num = that.data.goods_num;

    var user_id = "0"
    if (App.globalData.login)
      user_id = App.globalData.userInfo.user_id



    server.getJSON('/Cart/addCart', {
      goods_id: goods_id,
      goods_spec: goods_spec,
      session_id: session_id,
      goods_num: goods_num,
      user_id: user_id
    }, function(res) {

      if (res.data.status == 1) {
        App.globalData.stroe_id = that.data.goods.goods.store_id;
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../../cart/cart'
        });
      } else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 2000
        });


    });





    return;


  },
  addCart: function() {

    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {

        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }




    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = App.globalData.openid //that.data.goods.goods.spec_goods_price
    var goods_num = that.data.goods_num;
    var user_id = "0"
    if (App.globalData.login)
      user_id = App.globalData.userInfo.user_id



    server.getJSON('/Cart/addCart', {
      goods_id: goods_id,
      goods_spec: goods_spec,
      session_id: session_id,
      goods_num: goods_num,
      user_id: user_id
    }, function(res) {
      if (res.data.status == 1)
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1000
        });
      else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        });
    });


  },
  showCartToast: function() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
    wx.navigateTo({
      url: '/pages/cart/cart'
    });

  },
  previewImage: function(e) {
    wx.previewImage({
      //从<image>的data-current取到current，得到String类型的url路径
      current: this.data.goods.get('images')[parseInt(e.currentTarget.dataset.current)],
      urls: this.data.goods.get('images') // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage: function() {
    var path = '/pages/goods/detail/detail?objectId=' + objectId
    console.log(path);
    return {
      title: '吕氏电商系统',
      desc: '联系qq727186863',
      path: path
    }
  }
});