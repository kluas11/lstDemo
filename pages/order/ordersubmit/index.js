// pages/order/ordersubmit/index.js
var server = require('../../../utils/server');
const postUrl = "https://tlst.paycore.cc/index.php/WXAPI"
var tp;
var pay_points;
var points_rate;
Page({
  data: {
    distributionIndex:0,
    distributionArray:[{id:0,name:"门店自取"},{id:1,name:"邮寄"}],
    paymentIndex:0,
    paymentArray: [{ id: 0, name: "微信支付", way: 'wxpay' }, { id: 1, name: "余额支付", way:'walletpay'}],
    // 用户余额
    use_money: 0,
    // 总价格
    totalPrice: 0,
    // 商品列表清单
    shopList:[],
    // 地址列表
    addressList:{},
    // 邮费
    expressFee:0,
    use_point: 0,
    totalPrice2: -1,
    check: ['true', ''],
    "coupon": [],
    cv: '请选择优惠劵',
    cpos: -1,
    "couponCode": '',
    dtb_show: false,
    distribution_status: [{
      id: 0,
      name: '门店自取'
    }, {
      id: 1,
      name: '同城配送'
    }],
    
    selected_distribution: 0,
    outRange: false,
  },
  distributionChange:function(e){
    console.log(e.detail.value)
    this.setData({
      distributionIndex: e.detail.value
    })
  },
  paymentChange:function(e){
    this.setData({
      paymentIndex: e.detail.value
    })
  },
  // 切换地址
  addressSelect: function() {
    wx.navigateTo({
      url: '../../address/select/index'
    });
  },
  bindChange: function(e) {
    var use_money = e.detail.value;
    if (isNaN(new Number(use_money))) {
      use_money = 0;
    }
    this.setData({
      _use_money: use_money,
    });
  },
  bindChangeOfcoupon: function(e) {
    var couponCode = e.detail.value;

    this.setData({
      couponCode: couponCode,
    });
  },
  bindChangeOfPoint: function(e) {
    var use_point = e.detail.value;
    this.setData({
      use_point: use_point,
    });
  },
  bindPickerChange: function(e) {
    var value = e.detail.value;
    var cv = this.data.coupon[value];
    this.setData({
      cv: cv,
      cpos: value
    });



    this.useCoupon();

  },
  useCoupon: function() {
    if (this.data.cpos == -1)
      return;

    var use_money = this.data.use_money;
    use_money = parseInt(use_money);
    if (use_money < 0) {
      use_money = 0;
    }
    if (isNaN(use_money)) {
      use_money = 0;
    }
    var user_money = getApp().globalData.userInfo.user_money;
    if (user_money < use_money) {
      use_money = 0;
    }


    var use_point = this.data.use_point;
    use_point = parseInt(use_point)

    if (use_point < 0) {
      use_point = 0;
    }
    if (isNaN(use_point)) {
      use_point = 0;
    }

    use_point = use_point - use_point % parseInt(points_rate);
    var user_point = pay_points;
    if (parseInt(user_point) < use_point) {
      use_point = 0;
    }
    use_point = use_point - use_point % parseInt(points_rate);



    var money = this.data.couponList[this.data.cpos].money;
    var totalObj = this.data.totalPrice;
    //totalObj.total_fee = totalObj.total_fee - money

    var m = tp - use_money;
    m = m - use_point / parseInt(points_rate);
    m = m - money;
    totalObj.total_fee = m

    if (totalObj.total_fee < 0)
      totalObj.total_fee = 0;
    this.setData({
      totalPrice: totalObj
    });
  },

  use: function() {
    //totalPrice:
    var user_money = getApp().globalData.userInfo.user_money;
    var use_money = this.data._use_money;
    this.setData({
      use_money: this.data._use_money
    });
    if (use_money == "0" || use_money == 0 || use_money == "" || use_money == undefined) {
      wx.showToast({
        title: '请输入余额',
        duration: 1000
      });
      return;
    }
    user_money = parseFloat(user_money)
    use_money = parseFloat(use_money)

    var use_point = this.data.use_point;
    use_point = parseInt(use_point)


    if (use_money < 0) {
      wx.showToast({
        title: '请输入大于0元的金额',
        duration: 1000
      });
      return;
      return;
    }
    if (isNaN(use_money)) {
      wx.showToast({
        title: '输入余额有误',
        duration: 1000
      });
      return;
    }
    if (use_point < 0) {
      use_point = 0;
    }
    if (isNaN(use_point)) {
      use_point = 0;
    }

    use_point = use_point - use_point % parseInt(points_rate);
    var user_point = pay_points;
    if (parseInt(user_point) < use_point) {
      use_point = 0;
    }


    if (user_money < use_money) {
      var totalObj = this.data.totalPrice;
      use_point = use_point - use_point % parseInt(points_rate);
      var m = tp - use_point / parseInt(points_rate)
      totalObj.total_fee = m
      this.setData({
        totalPrice: totalObj
      });

      this.useCoupon();

      this.setData({
        use_money: 0
      });
      wx.showToast({
        title: '请输入小余当前余额',
        duration: 1000
      });
      return;
    }

    use_point = use_point - use_point % parseInt(points_rate);
    var m = tp - use_point / parseInt(points_rate)

    var totalPrice = m - use_money;
    if (totalPrice < 0)
      totalPrice = 0;
    var totalObj = this.data.totalPrice;
    totalObj.total_fee = totalPrice
    if (totalPrice2 < 0) totalPrice2 = 0
    this.setData({
      totalPrice: totalObj
    });

    if (this.data.selected_distribution == 1 && this.data.totalPrice3 != undefined) {
      console.log('in================')
      var totalPrice2 = this.data.totalPrice3 - use_money
      if (totalPrice2 < 0) totalPrice2 = 0
      this.setData({
        totalPrice2: totalPrice2
      })
    }

    this.useCoupon();
  },

  use_point: function() {
    //totalPrice:
    var user_point = pay_points;
    var use_point = this.data.use_point;

    if (use_point == "0" || use_point == 0 || use_point == "" || use_point == undefined) {
      wx.showToast({
        title: '请输入积分',
        duration: 1000
      });
      return;
    }


    use_point = parseInt(use_point)

    if (use_point < 0) {
      wx.showToast({
        title: '请输入大于0元的积分',
        duration: 1000
      });
      return;
      return;
    }
    if (isNaN(use_point)) {
      wx.showToast({
        title: '输入积分有误',
        duration: 1000
      });
      return;
    }

    var use_money = this.data.use_money;
    use_money = parseInt(use_money);
    if (use_money < 0) {
      use_money = 0;
    }
    if (isNaN(use_money)) {
      use_money = 0;
    }
    var user_money = getApp().globalData.userInfo.user_money;
    if (user_money < use_money) {
      use_money = 0;
    }


    if (parseInt(user_point) < use_point) {

      var totalObj = this.data.totalPrice;
      var m = tp - use_money;
      totalObj.total_fee = m
      this.setData({
        totalPrice: totalObj
      });

      this.setData({
        use_point: 0
      });
      this.useCoupon();
      wx.showToast({
        title: '请输入小余当前积分',
        duration: 1000
      });
      return;
    }

    use_point = use_point - use_point % parseInt(points_rate);
    var m = tp - use_money;
    var totalPrice = m - (use_point / parseInt(points_rate));
    if (totalPrice < 0)
      totalPrice = 0;
    var totalObj = this.data.totalPrice;
    totalObj.total_fee = totalPrice
    this.setData({
      totalPrice: totalObj
    });
    this.useCoupon();
  },
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    var app = getApp();
    // 获取到传过来的值
    var cartIds = app.globalData.cart_ids;
    var amount = app.globalData.amount;
    this.setData({
      cartIds: cartIds,
      amount: amount
    });
    // console.log(cartIds)
    this.getCarts(cartIds);
    // 页面初始化 options为页面跳转所带来的参数
  },
  initData: function() {
    var app = getApp();
    pay_points = app.globalData.userInfo.pay_points;  //
    var user_money = app.globalData.userInfo.user_money;   //余额
    this.setData({
      freemoney: user_money,
      pay_points: pay_points
    });
  },
  formSubmit: function(e) {
    // user 
    // var selected_distribution = this.data.selected_distribution
    // 地址ID
    // var address_id = this.data.address.address_id
    // 获取到user_id
    var user_id = wx.getStorageSync("user_id")
    // 获取到用户余额
    // var use_money = this.data.use_money
    // 不明
    // var pay_points = this.data.use_point
    var that = this;
    var app = getApp();
    // 优惠券判断
    // var couponTypeSelect = this.data.check[0] == "true" ? 1 : 2;
    // var coupon_id = 0;
    // if (this.data.cpos != -1) {
    //   coupon_id = this.data.couponList[this.data.cpos].id;
    // }
    // var couponCode = this.data.couponCode;
    // store_id 获取到storeID
    var stroe_id = getApp().globalData.stroe_id;
    // 获取需要买的商品 
    var cart_id = []
    // console.log(.shopList)
    that.data.shopList.map((value)=>{
      cart_id.push(value.cart_id)
    })
    cart_id=cart_id.join(',')
    console.log(cart_id)
    return;
    server.getJSON('/Cart/cart3/act/submit_order/user_id/' + user_id + "/address_id/" + address_id + "/user_money/" + use_money + "/pay_points/" + pay_points + "/couponTypeSelect/" + couponTypeSelect + "/coupon_id/" + coupon_id + "/couponCode/" + couponCode, {
      cart_id: cart_id,
      store_id: stroe_id,
      distribution_status: selected_distribution
    }, function(res) {

      if (res.data.status != 1 && res.data.status != 2) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'none'
        });
        return;
      }

      if (res.data.status == 2) {
        wx.showModal({
          title: '支付成功',
          content: '跳转到订单详情？',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.redirectTo({
                url: '/pages/order/list/list',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.navigateBack({
                delta: 999
              })
            }
          }
        });
        return;
      }

      var result = res.data.result
      app.globalData.wxdata = res.data.data
      app.globalData.order = res.data.order
      if (res.data.status == 1) {
        wx.showToast({
          title: '提交成功',
          duration: 2000
        });
        setTimeout(function() {
          if (res.data.order.pay_status == 1) {
            wx.switchTab({
              url: "../../member/index/index"
            });
            return;
          }
          wx.navigateTo({
            url: '../payment/payment?order_id=' + result
          });
        }, 2000);
      }
    });
  },

  getCarts: function(cartIds) {
    var user_id = wx.getStorageSync("user_id")
    // cosnole.log(user_id)
    var that = this
    var app = getApp()
    var stroe_id = getApp().globalData.store_id;
    // var cart_id = "4,5";
    console.log(cartIds)
    console.log(stroe_id)
    // 判断是否有地址;
     that.getAddress(user_id).then(res =>{
       console.log(res)
       
       if(res.data.status){
         that.setData({
          //  默认地址
           addressList: res.data.address
         })
        //  /Dopay/queryShippingPrice
         server.getJSON('/Dopay/queryShippingPrice', {
           store_id: stroe_id,
           address_id: res.data.address.address_id
           // distribution_status: that.data.distribution_status
         }, function (res) {
           console.log(res)
           if(res.data.status){
             that.setData({
               expressFee:res.data.fee
             })
           }
         })
       }else{
         wx.hideLoading();
         wx.showModal({
           title:"消息提示",
           content:"目前没有默认地址,跳转至地址管理页面",
           showCancel:false,
             success: function (res) {
             if (res.confirm) {
               wx.navigateTo({
                 url: '/pages/address/add/add?order=1',
               })
             } else if (res.cancel) {
               wx.navigateTo({
                 url: '/pages/address/add/add?order=1',
               })
             }
           }
         })
       }
     }).catch(e =>{
       console.log(e)
     })
     that.getUserMonder(user_id).then(res => {
       var money = res.data
       if (that.isRealNum(money)){
         that.setData({
           use_money: money
         })
       }else{
         wx.hideLoading();
         console.log("数值youwu")
       }
     }).catch(e => {
       console.log(e)
     })
  
    // 获取商品 库存 交易金额
    server.getJSON('/Dopay/confirmOrder', {
      cart_ids: cartIds,
      // distribution_status: that.data.distribution_status
    }, function(res) {
      console.log(res)
      var result=res.data
      var app = getApp();
      if (result.status==false){
       wx.hideLoading()
       app.globalData.cart_ids=""
       wx.showModal({
         title:"消息提示",
         content:"商品库存不足,请检查商品",
         success:function(res){
           if (res.confirm) {
             wx.switchTab({
               url: '../../cart/cart'
             });
           } else if (res.cancel) {
             wx.switchTab({
               url: '../../cart/cart'
             });
           }
         }
       })
     }else{
        wx.hideLoading();
        // 总价格
        // totalPrice
        var shopList = result.goodsList
        var totalPrice = result.goodsAmount
        that.setData({
          shopList: shopList,
          totalPrice: totalPrice
        })
     }

    })
    // server.getJSON('/Cart/cart2/user_id/' + user_id, {
    //   cart_id: cart_id,
    //   store_id: stroe_id,
    //   // distribution_status: that.data.distribution_status
    // }, function(res) {
    //   console.log(res)
    // 区域范围限制
      // if (res.data.status == 1) {
      //   that.setData({
      //     outRange: false
      //   })
      // }
      // if (res.data.status == -2) {
      //   that.setData({
      //     outRange: true
      //   })
      //   wx.navigateBack({
      //     delta: 1
      //   })
      // }
      // var user_data = app.globalData.userInfo;
      // console.log(user_data)
      // user_data.user_money = res.data.result.userInfo.user_money;
      // user_data.pay_points = res.data.result.userInfo.pay_points;
      // app.globalData.userInfo = user_data
      // var address = res.data.result.addressList
      // var cartList = res.data.result.cartList

      // var userInfo = res.data.result.userInfo
      // var totalPrice = res.data.result.totalPrice
      // tp = totalPrice.total_fee
      // points_rate = res.data.result.points
      // that.setData({
      //   address: address,
      //   cartList: cartList,
      //   userInfo: userInfo,
      //   totalPrice: totalPrice
      // });
      // 优惠券设置 展示不用
      // var couponList = res.data.result.couponList
      // var ms = that.data.coupon
      // for (var i in couponList) {
      //   ms.push(couponList[i].name);
      // }
      // that.setData({
      //   coupon: ms,
      //   couponList: couponList
      // });
      // that.initData();
    // })
  },
  getAddress: function (user_id){
    console.log(user_id)
    return new Promise(function (resolve, reject){
      try{
        server.getJSON('/Dopay/getAddress', {
          user_id: user_id,
          // distribution_status: that.data.distribution_status
        }, function (res) {
          resolve(res)
        })
      }
    catch(e){
        reject(e)
    }
    })
  },
  getUserMonder: function (user_id){
    console.log(user_id)
    return new Promise(function (resolve, reject) {
      try {
        server.getJSON('/Dopay/getUserMoney', {
          user_id: user_id,
          // distribution_status: that.data.distribution_status
        }, function (res) {
          resolve(res)
        })
      }
      catch (e) {
        reject(e)
      }
    })
  },
  check1: function() {
    this.setData({
      check: ['true', '']
    });
  },
  check2: function() {
    this.setData({
      check: ['', 'true']
    });
  },
  onReady: function() {
    // 页面渲染完成
  },

  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    this.setData({
      order: false
    })
    // 页面关闭
  },
  distribution: function() {
    this.setData({
      dtb_show: true
    })
  },
  slectDistribution: function(e) {
    var that = this
    let selected_distribution = e.target.dataset.distribution_status;
    this.setData({
      dtb_show: false,
      selected_distribution: selected_distribution
    });

    if (selected_distribution == 1) {
      var user_id = getApp().globalData.userInfo.user_id
      var app = getApp()
      var stroe_id = getApp().globalData.stroe_id;
      var cart_id = getApp().globalData.cart_ids;
      console.log(that.data.selected_distribution)
      server.getJSON('/Cart/cart2/user_id/' + user_id, {
        cart_id: cart_id,
        store_id: stroe_id,
        // distribution_status: that.data.selected_distribution
      }, function(res) {
        console.log(res)
        if (res.data.status == -2) {
          that.setData({
            outRange: true
          })
        }
        var tmpPrice = res.data.result.totalPrice.total_fee - that.data.use_money;
        if (tmpPrice < 0) tmpPrice = 0
        that.setData({
          totalPrice2: tmpPrice,
          totalPrice3: res.data.result.totalPrice.total_fee,
        })

        var address = res.data.result.addressList
        that.setData({
          address: address
        });
      })
    } else {
      this.setData({
        totalPrice2: -1
      })
    }
  },

  gotoAddAddr: function() {
    wx.navigateTo({
      url: '/pages/address/add/add?order=1',
    })
  },
  isRealNum: function(val){
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if(val === "" || val ==null){
        return false;
    }
    if(!isNaN(val)){
        return true;
    }else{
        return false;
    }
  }   
})