var server = require('../../../utils/server');
const App = getApp();
var objectId;
Page({
  data: {
    goods: {},
    current: 0,
    active_index: 0,
    galleryHeight: App.screenWidth,
    tab: 0,
    collectstate: false,
    goods_num: 1,
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    goods_oss: App.image_oss + '750_750'
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
    var that = this;
    if (e.detail.errMsg === "getUserInfo:ok") {
      var goods_id = e.currentTarget.dataset.id;
      var ctype = 0;
      this.getuser_id().then(user_id => {
        server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function(res) {
          console.log(res)
          that.setData({
            collectstate: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        });
      })
    }
  },
  getuser_id() {
    return new Promise((request, reject) => {
      var user_id = wx.getStorageSync("user_id");
      if (!user_id) {
        App.getOpenId(App.register(function() {
          server.getJSON(
            "/User/validateOpenid", {
              openid: App.globalData.openid
            },
            function(res) {
              if (res.data.status) {
                var user_id = res.data.user_id;
                App.globalData.userInfo = {
                  user_id
                };
                request(user_id)
                //本地缓存
                wx.setStorageSync("user_id", user_id)
                App.globalData.login = true;
              }
            });
        }))
      } else {
        request(user_id)
      }
    })
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
    //获取商品详情
    this.getGoodsById(goodsId);
    // 用户是否收藏该商品
    if (wx.getStorageSync('user_id')) {
      this.iscollect();
    }
  },
  iscollect() {
    let that = this;
    server.getJSON("/Goods/isCollect",
      // 传user_id和goods_id
      {
        user_id: wx.getStorageSync('user_id'),
        goods_id: objectId
      },
      function(res) {
        that.setData({
          collectstate: res.data ? true : false
        })
      }
    )
  },
  getScopes() {
    // console.log(1111111111)
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

    server.getJSON('/Goods/goodsInfo', {
      goods_id: goodsId
    }, function(res) {
      var goodsInfo = res.data;
      console.log(res)
      if (res.statusCode == 200) {
        that.setData({
          goods: goodsInfo
        });
      } else {
        wx.showToast({
          title: "数据异常",
          image: "../../../images/about.png"
        })
        return;
      }

      // that.checkPrice();
    });
  },
  // checkPrice: function() {
  //   var goods = this.data.goods;
  //   var spec = ""
  //   this.setData({
  //     price: goods.goods.shop_price
  //   });
  //   if (!goods.goods.goods_spec_list) {
  //     return;
  //   }
  //   for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
  //     for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
  //       if (goods.goods.goods_spec_list[i][j].isClick == 1) {
  //         if (spec == "")
  //           spec = goods.goods.goods_spec_list[i][j].item_id
  //         else
  //           spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
  //       }
  //     }
  //   }
  //   console.log(spec);

  //   var specs = spec.split("_");
  //   for (var i = 0; i < specs.length; i++) {
  //     specs[i] = parseInt(specs[i])
  //   }
  //   specs.sort(function(a, b) {
  //     return a - b
  //   });
  //   spec = ""
  //   for (var i = 0; i < specs.length; i++) {
  //     if (spec == "")
  //       spec = specs[i]
  //     else
  //       spec = spec + "_" + specs[i]
  //   }
  //   console.log(spec);
  //   var price = goods['spec_goods_price'][spec].price;
  //   console.log(price);
  //   this.setData({
  //     price: price
  //   });
  // },
  //  立即购买了解一下
  bug: function() {
    var goods = this.data.goods;
    // 商品规格
    // var spec = ""
    // if (goods.goods.goods_spec_list != null)
    //   for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {

    //     for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
    //       if (goods.goods.goods_spec_list[i][j].isClick == 1) {
    //         if (spec == "")
    //           spec = goods.goods.goods_spec_list[i][j].item_id
    //         else
    //           spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
    //       }
    //     }
    //   }

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
  //  
  /*
    加入购物车
    说明: goods_id，goods_num，user_id 
  */
  addCart: function() {
    App.getUserInfo(function(user) {
      console.log(user)
    })
    // console.log(userID)
    return;
    var goods = this.data.goods;
    // 商品规格
    // var spec = ""
    // if (goods.goods.goods_spec_list != null)
    //   for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {

    //     for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
    //       if (goods.goods.goods_spec_list[i][j].isClick == 1) {
    //         if (spec == "")
    //           spec = goods.goods.goods_spec_list[i][j].item_id
    //         else
    //           spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
    //       }
    //     }
    //   }
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
    var that = this
    wx.previewImage({
      //从<image>的data-current取到current，得到String类型的url路径
      current: that.data.goods.original_img,
      urls: [that.data.goods.original_img] // 需要预览的图片http链接列表
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