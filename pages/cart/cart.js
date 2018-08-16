var server = require('../../utils/server');
var app = getApp()
const postUrl = app.postUrl;
Page({
  data: {
    carts: [],
    goodsList: [],
    empty: true,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    selectedAllStatus: true,
    total: '',
    goods_oss: app.image_oss+'130_150',
    wx_loading:true
  },

  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        var height = height - height / 750.0 * 60;
        that.setData({ height: height })
      }
    })
  },
  // 马上去逛逛
  see: function (e) {
    wx.switchTab({
      url: "../category/category"
    });
  },
// 自减
  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].goods_num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].goods_num = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    // if (num>1){
      this.saveNum(carts[index].cart_id, num);
      // return;
    
    // update database
    //carts[index].save();
    
    this.sum();
  },
  // 增加
  bindPlus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].goods_num;
    // 自增
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].goods_num = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    // update database
    //carts[index].save();
    this.saveNum(carts[index].cart_id, num);
    this.sum();
  },
  // 输入
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = this.data.carts;
    var num = e.detail.value;
    carts[index].goods_num = num;
    // 将数值与状态写回
    this.setData({
      carts: carts
    });
    this.saveNum(carts[index].cart_id, num);
    //console.log(this.data.carts);
    this.sum();
  },
  // 取反选中
  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    console.log(index)
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });
    if (!carts[index].selected){
      this.setData({
        selectedAllStatus: false,
      });
    }else{
    
      let cas = this.data.carts;
      let checkbollen=cas.map((value,index)=>{
        if (value.selected==false){
          return false
        }else{
          return null
        }  
      })
   
      if (checkbollen.indexOf(false)>-1){
     
        this.setData({
          selectedAllStatus: false,
        });
      }else{
      
        this.setData({
          selectedAllStatus: true,
        });
      }
    }
    // update database

    // this.updataSelect(carts[index].id, carts[index].selected);
    this.sum();
  },
  // 全选按钮
  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
      // update selected status to db
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
    this.sum();
    // var open_id = app.globalData.openid;
    // this.updateAllSelect(open_id, selectedAllStatus);
  },
  // 立即结算
  bindCheckout: function () {
    // 遍历取出已勾选的cid
    var cartIds = [];
    var  goodsID=[];

    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        console.log(this.data.carts[i])
        goodsID.push(this.data.carts[i].goods_id)
      }
    }
    console.log(goodsID)

    if (goodsID.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
      return;
    }

    // return;
    // 需要获取出地址 
    wx.navigateTo({
      url: '/pages/order/ordersubmit/index?origin=cart' + "&goodsID=" + goodsID 
    });
  },
  getCarts: function () {
    var minusStatuses = [];
    var that = this;
    var store_id = app.globalData.store_id;
     var userID = wx.getStorageSync("user_id")
  //  门店
    if (!store_id){
      app.get_getLocation()
      store_id = app.globalData.store_id;
    }
     server.getJSON('/Cart/cartList',{
       user_id: userID,
       store_id: store_id
        }, function (res) {
          console.log(res)
      var carts = res.data
      // success
      if (carts.length != 0)
        that.setData({ empty: false });
      else {
        that.setData({ empty: true });
      }
      // 设置选中??
      // 全选按钮控制 selectedAllStatus
      // var selectedAllStatus = true;
      for (var i = 0; i < carts.length; i++) {
        carts[i].selected = true;
        minusStatuses[i] = carts[i].goods_num > 1 ? "normal" :"disabled"
      }
      that.setData({
        carts: carts,
        minusStatuses: minusStatuses,
        wx_loading:false
      });
      // // sum
      that.sum();
    });
  
  },
  onShow: function () {
    this.getCarts();
  },
  // 计算总和
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].goods_num * carts[i].shop_price;
      }
    }
    var newValue = parseInt(total * 100);
    total = newValue / 100.0;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total
    });
  },
  // 移除购物车
  deleteCart: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var id = this.data.carts[index].cart_id;
    var that = this
    console.log(id)
    wx.request({
      url: postUrl + "/Cart/delCart",
      data: {
        cart_id: id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result)
        if (result.data == 0) {
          console.log("err")
        }else{
          that.getCarts();
        }
      }
    })
  },
  saveNum: function (id, num) {
    var that = this
    console.log(id,num)
    wx.request({
      url: postUrl+"/Cart/updateNum",
      data: {
        cart_id: id,
        num: num
        },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (result) {
        console.log(result)
        if (result.data == "0" || result.data==0){
          console.log("err")
        }
      }
    })

  },
  // 弃用
  updataSelect: function (id, selected) {
    if (selected)
      selected = 1;
    else selected = 0;

    server.getJSON('/Cart/updateSelect/id/' + id + "/selected/" + selected, function (res) {
    });


  },
  // 弃用
  updateAllSelect: function (id, selected) {
    if (selected)
      selected = 1;
    else selected = 0;

    server.getJSON('/Cart/updateAllSelect/open_id/' + id + "/selected/" + selected, function (res) {



    });


  }
})