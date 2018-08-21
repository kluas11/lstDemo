var server = require('../../../utils/server');
var categoryId;
var parentId;
var keywords;
var cPage = 0;
var gsort = "shop_price";
const app = getApp();
var asc = "desc";
// 使用function初始化array，相比var initSubMenuDisplay = [] 既避免的引用复制的，同时方式更灵活，将来可以是多种方式实现，个数也不定的
function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}

//定义初始化数据，用于运行时保存
var initSubMenuHighLight = [
  ['', '', '', '', ''],
  ['', ''],
  []
];

Page({
  data: {
    menu: ["", "", ""],
    firstindex: 0,
    sencondindex: 0,
    firstate: [{
      class_id: "0",
      name: "全部分类",
      image: "",
      level: "1"
    }],
    sencondstate: [{
      class_id: "0",
      name: "全部分类",
      image: "",
      level: "1"
    }],
    subMenuDisplay: initSubMenuDisplay(),
    subMenuHighLight: initSubMenuHighLight,
    sort: [
      ['shop_price-desc', 'shop_price-asc'],
      ['sales_count-desc', 'sales_count-asc'],
      ['comment_count-asc']
    ],
    goods: [],
    empty: false,
    list_oss: app.image_oss + '150_150',
    show: false,
    loadtext: '正在加载...'
  },
  // 点击搜索执行查询
  search: function(e) {
    keywords = this.data.keywords;
    // 分类
    cPage = 0;
    this.setData({
      show:false,
      goods: []
    })
    this.getGoodsByKeywords(keywords, cPage, gsort + "-" + asc);
  },
  // 分类首个选择器
  firstateChange: function(e) {
    // 根据以及分类筛选二级分类
    var indexs = e.detail.value
    var that = this
    var store_id = app.globalData.store_id;
    if (e.detail.value != 0 && e.detail.value != "" && e.detail.value != "0") {
      var parent = that.data.firstate[indexs].class_id
      server.getJSON('/Goods/goodsCategoryList', {
        store_id: store_id,
        parent_id: parent
      }, function(res) {
        var categorys = res.data
        categorys.unshift({
          class_id: "0",
          name: "全部分类",
          image: "",
          level: "1"
        })
        that.setData({
          sencondstate: categorys,
          firstindex: indexs,
          sencondindex: 0
        })
      })
    } else {
      that.setData({
        firstindex: 0,
        sencondstate: [{
          class_id: "0",
          name: "全部分类",
          image: "",
          level: "1"
        }],
        sencondindex: 0
      })
    }


  },
  // 分类第二个选择器
  sencondChange: function(e) {
    this.setData({
      sencondindex: e.detail.value
    })
  },
  //  搜索的关键字
  bindChangeSearch: function(e) {

    var keywords = e.detail.value;

    this.setData({
      keywords: keywords
    });
  },
  onLoad: function(options) {
    // 通过分类页跳转  获取到2级的分类ID
    // 改
    // 通过首页跳转 没有2级的分类ID
    var that = this;
    //  获取到首页点击跳转全部分类
    parentId = options.parentId || "";
    categoryId = options.categoryId || "";
    var firstArray = that.data.firstate
    // 获取一级分类
    var storeids = app.globalData.store_id;
    var firstArr = server.getJSON("/Goods/goodsCategoryList", {
      store_id: storeids
    }, function(res) {
      var firstcategorys = res.data;
      that.setData({
        firstate: that.data.firstate.concat(firstcategorys),
      });
      if (parentId != "" && categoryId != "") {
        var secondArr = server.getJSON('/Goods/goodsCategoryList', {
          store_id: storeids,
          parent_id: parentId
        }, function(res) {
          var categorys = res.data;
          var sencondArr = that.data.sencondstate
          sencondArr = sencondArr.concat(categorys)
          that.setData({
            sencondstate: sencondArr,
            sencondindex: that.selectIndex(sencondArr, categoryId) || 0,
            firstindex: that.selectIndex(that.data.firstate, parentId) || 0
          });
          if (!keywords)
            // 没有关键字查询
            that.getGoods(categoryId, 0, "");
          else
            that.getGoodsByKeywords(keywords, 0, "");
        });
      }
    });

  },
  selectIndex: function(arr, indexID) {
    return arr.findIndex((value, index, arr) => {
      // console.log(value)
      return value.class_id == indexID
    })
  },
  getGoodsByKeywords: function(keyword, pageIndex, sort) {
    var that = this;
    // 排序
    var storeid = app.globalData.store_id //店铺ID
    var winrecords = {
      store_id: storeid,
      p: pageIndex || 0
    }
    var shopname = keyword || "";

    if (sort == "" || sort == null) {
      gsort = ""
      asc = ""
    } else {
      // console.log(sort)
      var sortArray = sort.split('-');
      gsort = sortArray[0];
      asc = sortArray[1] == "desc" ? 1 : 0;
      winrecords['sort_name'] = gsort
      winrecords['sort'] = asc
    }

    var firstateID = that.data.firstate[that.data.firstindex].class_id || 0
    var secondID = that.data.sencondstate[that.data.sencondindex].class_id || 0
    // var threeID = 0;
    winrecords['cat_id1'] = firstateID
    winrecords['cat_id2'] = secondID
    if (shopname != "" && shopname != undefined) {
      winrecords['goods_name'] = shopname
    }
    server.getJSON('/Goods/goodsSearch', winrecords, function(res) {

      var newgoods = res.data
      var ms = (that.data.goods).concat(newgoods)
      wx.stopPullDownRefresh();

      if (ms.length == 0) {
        that.setData({
          empty: true
        });
      } else
        that.setData({
          empty: false
        });

      that.setData({
        goods: ms
      });


    });


  },

  getGoods: function(category, pageIndex, sort) {
    var that = this;
    // 排序
    var storeid = app.globalData.store_id;
    var winrecord = {
      store_id: storeid,
      p: pageIndex || 0,
    }
    if (sort == "" || sort == null) {
      // gsort ="shop_price"
      // asc=0
    } else {
      // console.log(sort)
      var sortArray = sort.split('-');
      var shopname = keywords || "";
      gsort = sortArray[0];
      asc = sortArray[1] == "desc" ? 0 : 1;
      winrecord['sort_name'] = gsort
      winrecord['sort'] = asc
    }
    if (shopname != "" && shopname != undefined) {
      winrecord['goods_name'] = shopname
    }
    //  一级分类，二级分类
    var firstateID = that.data.firstate[that.data.firstindex].class_id || 0
    var secondID = that.data.sencondstate[that.data.sencondindex].class_id || 0
    var threeID = 0;
    winrecord['cat_id1'] = firstateID
    winrecord['cat_id2'] = secondID
    server.getJSON('/Goods/goodsSearch', winrecord, function(res) {
      var newgoods = res.data;
      if(res.data.length<=0){
        that.setData({
          loadtext: '——没有更多了——'
        })
      }
      var ms = that.data.goods.concat(newgoods)
      if (ms.length == 0) {
        that.setData({
          empty: true
        });
      } else
        that.setData({
          empty: false
        });
      wx.stopPullDownRefresh();
      that.setData({
        goods: ms
      });
    });

  },


  tapGoods: function(e) {
    var objectId = e.currentTarget.dataset.objectId;
    wx.navigateTo({
      url: "../../../../../detail/detail?objectId=" + objectId
    });
  },
  tapMainMenu: function(e) {
    //		获取当前显示的一级菜单标识
    var index = parseInt(e.currentTarget.dataset.index);
    // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplay = initSubMenuDisplay();
    //		如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }

    var menu = ["", "", "", ""];
    menu[index] = "highlight";

    if (index == 2) {
      this.setData({
        goods: []
      });
      cPage = 0;
      // console.log(this.data.sort[index])
      if (!keywords)
        // 没有关键字
        this.getGoods(categoryId, 0, this.data.sort[index][0]);
      else
        // 有关键字查询
        this.getGoodsByKeywords(keywords, 0, this.data.sort[index][0]);
    }

    // 设置为新的数组
    this.setData({
      menu: menu,
      subMenuDisplay: newSubMenuDisplay
    });
  },
  tapSubMenu: function(e) {
    // 隐藏所有一级菜单
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
    // 处理二级菜单，首先获取当前显示的二级菜单标识
    var indexArray = e.currentTarget.dataset.index.split('-');
    // 初始化状态
    // var newSubMenuHighLight = initSubMenuHighLight;
    for (var i = 0; i < initSubMenuHighLight.length; i++) {
      // 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
      //if (indexArray[0] == i) {
      for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
        // 实现清空
        initSubMenuHighLight[i][j] = '';
      }
      // 将当前菜单的二级菜单设置回去
      //}
    }
    this.setData({
      goods: []
    });
    cPage = 0;
    if (!keywords)
      this.getGoods(categoryId, 0, this.data.sort[indexArray[0]][indexArray[1]]);
    else
      this.getGoodsByKeywords(keywords, 0, this.data.sort[indexArray[0]][indexArray[1]]);

    // 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    // 设置为新的数组
    this.setData({
      subMenuHighLight: initSubMenuHighLight
    });
  },
  onReachBottom: function() {
    this.setData({
      show:true,
      loadtext: '正在加载...'
    })
    if (!keywords)
      this.getGoods(categoryId, ++cPage, gsort + "-" + asc);
    else
      this.getGoodsByKeywords(keywords, ++cPage, gsort + "-" + asc);
      
  },
  onPullDownRefresh: function() {
    this.setData({
      goods: []
    });
    cPage = 0;
    if (!keywords)
      this.getGoods(categoryId, cPage, gsort + "-" + asc);
    else
      this.getGoodsByKeywords(keywords, cPage, gsort + "-" + asc);
  }
}, 'json');