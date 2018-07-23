// pages/order/ordersubmit/index.js
var server = require('../../../utils/server');
const postUrl = "https://tlst.paycore.cc/index.php/WXAPI"
var tp;
var pay_points;
var points_rate;
const app = getApp();
Page({
  data: {
    goodsID:"",
    goodsNum:"",
    orginPage:"",
    orderId:"",
    orderState:false,
    addressToggle:false,
    addressIndex:0,
    distributionIndex:1,
    distributionArray:[{id:0,name:"门店自取"},{id:1,name:"邮寄"}],
    paymentIndex:0, 
    paymentArray: [{ id: 0, name: "微信支付", way: 'wxPreparePay', class: "payByBalance" }, { class:"payByWXPay button-hover",id: 1, name: "余额支付", way:'walletPay'}],
    // 用户余额
    use_money: 0,
    // 总价格
    totalPrice: 0,
    // 商品列表清单
    shopList:[],
    // 地址列表
    addressList:[],
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
  // 切换地址
  switchaddress:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    var Index = e.currentTarget.dataset.index;
    console.log(Index)
    var address_id = that.data.addressList[Index].address_id
    console.log(address_id)
    var stroe_id = getApp().globalData.store_id;
    console.log(stroe_id)
    server.getJSON('/Dopay/queryShippingPrice', {
      store_id: stroe_id,
      address_id: address_id
      // distribution_status: that.data.distribution_status
    }, function (res) {
      console.log(res)
      if (res.data.status) {
      
        that.setData({
          expressFee: res.data.fee,
          addressIndex: Index,
          addressToggle: false
        })
        wx.hideLoading()
      }
    })
    
  },
  // 切换配送方式
  distributionChange:function(e){
    console.log(e.detail.value)
    var that=this
    var addressIndex = that.data.addressIndex
    var address_id = that.data.addressList[addressIndex].address_id
    var stroe_id = getApp().globalData.stroe_id;
    if (e.detail.value==1){
      server.getJSON('/Dopay/queryShippingPrice', {
        store_id: stroe_id,
        address_id: address_id
        // distribution_status: that.data.distribution_status
      }, function (res) {
        console.log(res)
        if (res.data.status) {
          that.setData({
            expressFee: res.data.fee
          })
        }
      })
    }
    this.setData({
      distributionIndex: e.detail.value
    })

  },
  //  支付方式启用
  paymentChange:function(e){
    this.setData({
      paymentIndex: e.detail.value
    })
  },
  // 切换地址
  addressSelect: function() {
    this.setData({
      addressToggle:true
    })
    // wx.navigateTo({
    //   url: '../../address/select/index'
    // });
  },
  // 优惠券切换弃用
  // bindChange: function(e) {
  //   var use_money = e.detail.value;
  //   if (isNaN(new Number(use_money))) {
  //     use_money = 0;
  //   }
  //   this.setData({
  //     _use_money: use_money,
  //   });
  // },
  bindChangeOfcoupon: function(e) {
    var couponCode = e.detail.value;

    this.setData({
      couponCode: couponCode,
    });
  },
  // 积分启用
  // bindChangeOfPoint: function(e) {
  //   var use_point = e.detail.value;
  //   this.setData({
  //     use_point: use_point,
  //   });
  // },
  // 优惠券选择吧
  // bindPickerChange: function(e) {
  //   var value = e.detail.value;
  //   var cv = this.data.coupon[value];
  //   this.setData({
  //     cv: cv,
  //     cpos: value
  //   });



  //   this.useCoupon();

  // },
  // 使用优惠券
  // useCoupon: function() {
  //   if (this.data.cpos == -1)
  //     return;

  //   var use_money = this.data.use_money;
  //   use_money = parseInt(use_money);
  //   if (use_money < 0) {
  //     use_money = 0;
  //   }
  //   if (isNaN(use_money)) {
  //     use_money = 0;
  //   }
  //   var user_money = getApp().globalData.userInfo.user_money;
  //   if (user_money < use_money) {
  //     use_money = 0;
  //   }


  //   var use_point = this.data.use_point;
  //   use_point = parseInt(use_point)

  //   if (use_point < 0) {
  //     use_point = 0;
  //   }
  //   if (isNaN(use_point)) {
  //     use_point = 0;
  //   }

  //   use_point = use_point - use_point % parseInt(points_rate);
  //   var user_point = pay_points;
  //   if (parseInt(user_point) < use_point) {
  //     use_point = 0;
  //   }
  //   use_point = use_point - use_point % parseInt(points_rate);



  //   var money = this.data.couponList[this.data.cpos].money;
  //   var totalObj = this.data.totalPrice;
  //   //totalObj.total_fee = totalObj.total_fee - money

  //   var m = tp - use_money;
  //   m = m - use_point / parseInt(points_rate);
  //   m = m - money;
  //   totalObj.total_fee = m

  //   if (totalObj.total_fee < 0)
  //     totalObj.total_fee = 0;
  //   this.setData({
  //     totalPrice: totalObj
  //   });
  // },
// 使用不知道什么
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
  // 使用积分
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
  onLoad: function (options){
    console.log(options)
    this.setData({
      goodsID: options.goodsID,
      orginPage: options.origin,
      goodsNum: options.goods_num||0
    })
  },
  onShow: function () {
    
    if (!this.data.goodsID){
      wx.showToast({
        title: '订单已关闭',
        image: '../../../images/about.png',
        duration: 2000,
        complete: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '../../cart/cart'
            });
          }, 2000)
         
        }
      })
      return;
    }
    this.getCarts();
    // 页面初始化 options为页面跳转所带来的参数
  },
  // 初始化数据
  initData: function() {
    pay_points = app.globalData.userInfo.pay_points;  //
    var user_money = app.globalData.userInfo.user_money;   //余额
    this.setData({
      freemoney: user_money,
      pay_points: pay_points
    });
  },
  paymentBtn:function(e){
    var user_id = wx.getStorageSync("user_id");
    var open_id = app.globalData.openid;
    var order_id = this.data.orderId
    var that=this;
    if (order_id == "" || !order_id || order_id==null){
      wx.hideLoading()
      wx.showToast({
        title: '订单有误',
        image: '../../../images/about.png',
        duration: 2000,
        complete: function () {
       
          setTimeout(function () {
            wx.switchTab({
              url: '../../index/index'
            });
          }, 2000);
        }
      })
    }
    if (open_id == "" || !open_id || open_id == null) {
      wx.hideLoading()
      wx.showModal({
        title: "消息提示",
        content: "获取个人信息有误,请后台关闭小程序再使用",
        showCancel: false,
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
    var payway = e.currentTarget.dataset.way
    var port=""
    var winrecord={}
    if (payway =="wxPreparePay"){
      port ="/Dopay/wxPreparePay"
      winrecord={
        user_id: user_id,
        open_id: open_id,
        order_id: order_id
      }
      that.sendpayment(postUrl, port, winrecord, payway)
    }else{
      port = "/Dopay/walletPay"
      winrecord = {
        user_id: user_id,
        order_id: order_id
      }
      var total=0;
      if (that.data.distributionIndex==1){
        total = that.data.totalPrice + that.data.expressFee
      }else{
        total = that.data.totalPrice
      }
    
      wx.showModal({
        title:"交易提示",
        content: "此次付款金额为" + total+"元",
        success:function(res){
          if (res.confirm) {
            that.sendpayment(postUrl, port, winrecord, payway)
          } else if (res.cancel) {
           return;
          }
        },
        fail:function(){
          wx.hideLoading()
          return;
        }

      })
    
    }
    // console.log(winrecord)
    // console.log(postUrl + port)
    // console.log(user_id)
    // console.log(open_id)
    // console.log(order_id)
    // console.log(winrecord)

  },
  // 发送支付
  sendpayment: function (postUrl, port, winrecord, payway){
    console.log(postUrl)
    console.log(port)
    console.log(payway)
    console.log(winrecord)
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 请求提交订单
    wx.request({
      url: postUrl + port,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: winrecord,
      method: 'POST',
      success: function (res) {

        wx.hideLoading()
        console.log(res)
        // 微信支付

        if (payway == "wxPreparePay") {
          var result = res.data.data
          wx.requestPayment({
            "timeStamp": result.timeStamp,
            "nonceStr": result.nonceStr,
            "package": result.package,
            "signType": result.signType,
            'paySign': result.paySign,
            'success': function (res) {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2000,
                complete: function () {
                  that.setData({
                    goodsID: ""
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../../order/list/list'
                    });
                  }, 2000)

                }
              })
            },
            'fail': function (res) {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: "支付失败",
                image: '../../../images/about.png',
                duration: 2000,
                complete: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../index/index'
                    });
                  }, 2000)
                }

              })
            }
          })
        } else {
          // 余额支付
          if (res.data.status) {
            that.setData({
              goodsID: ""
            })
            wx.showToast({
              title: "支付成功",
              icon: "success",
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../../order/list/list'
                  });
                }, 2000)

              }
            })
          } else {
            wx.showToast({
              title: "余额不足",
              image: '../../../images/about.png',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../../index/index'
                  });
                }, 2000)



              }
            })
          }
        }

        // return;
      },
      fail: function (res) {
        wx.showToast({
          title: '下单失败',
          image: '../../../images/about.png',
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '../../index/index'
              });
            }, 2000)

          }
        })
      }, complete: function () {
        that.setData({
          orderState: false
        })
      }
    })
  },
  // 提交订单
  formSubmit: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    // user 
    // var selected_distribution = this.data.selected_distribution
    // 地址ID
    // var address_id = this.data.address.address_id
    // 获取到用户余额
    // var use_money = this.data.use_money
    // 不明
    // var pay_points = this.data.use_point
  
    // 优惠券判断
    // var couponTypeSelect = this.data.check[0] == "true" ? 1 : 2;
    // var coupon_id = 0;
    // if (this.data.cpos != -1) {
    //   coupon_id = this.data.couponList[this.data.cpos].id;
    // }
    // var couponCode = this.data.couponCode;
    var that = this;
    // 获取需要买的商品 
    var goodsID = this.data.goodsID
    // console.log(.shopList)
    // 获取到user_id
    var user_id = wx.getStorageSync("user_id")
    // store_id 获取到storeID
    var store_id = app.globalData.store_id;
    var addressIndex = that.data.addressIndex;
    var addressID = that.data.addressList[addressIndex].address_id
    var winrecord={
      user_id: user_id,
      store_id: store_id,
      goods_ids: goodsID,
      address_id: addressID,
      is_express: that.data.distributionIndex
    }
    console.log(winrecord)
    // console.log(user_id)
    // console.log(store_id)
    // console.log(goodsID)
    // console.log(addressID)
    // console.log(that.data.distributionIndex)
    if (that.data.goodsNum > 0) {
      winrecord["goods_num"] = that.data.goodsNum
    }
    console.log(winrecord)
    wx.request({
      url: postUrl +"/Dopay/createOrder",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: winrecord,
      method: 'POST',
      success:function(res){
        console.log(res)
        wx.hideLoading();
        var result = res.data
        if (result.status){
          that.setData({
            orderId: result.order_id,
            orderState:true
          })
        }else{
          wx.showToast({
            title: '下单失败',
            image: '../../../images/about.png',
            duration: 2000,
            complete: function () {
            
               setTimeout(function () {
                 wx.switchTab({
                   url: '../../index/index'
                 });
        }, 2000);
            }
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '下单失败',
          image: '../../../images/about.png',
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '../../index/index'
              });
            }, 2000);
          }
        })
      }
    })
    // server.getJSON('/Dopay/createOrder', {
    //   user_id: user_id,
    //   store_id: stroe_id,
    //   cart_ids: cart_id,
    //   address_id: addressID,
    //   is_express: that.data.distributionIndex
    // }, function(res) {
    //   console.log(res)
    //   return;
    //   // if (res.data.status != 1 && res.data.status != 2) {
    //   //   wx.showToast({
    //   //     title: res.data.msg,
    //   //     duration: 2000,
    //   //     icon: 'none'
    //   //   });
    //   //   return;
    //   // }

    //   // if (res.data.status == 2) {
    //   //   wx.showModal({
    //   //     title: '支付成功',
    //   //     content: '跳转到订单详情？',
    //   //     success: function(res) {
    //   //       if (res.confirm) {
    //   //         console.log('用户点击确定')
    //   //         wx.redirectTo({
    //   //           url: '/pages/order/list/list',
    //   //         })
    //   //       } else if (res.cancel) {
    //   //         console.log('用户点击取消')
    //   //         wx.navigateBack({
    //   //           delta: 999
    //   //         })
    //   //       }
    //   //     }
    //   //   });
    //   //   return;
    //   // }

    //   // var result = res.data.result
    //   // app.globalData.wxdata = res.data.data
    //   // app.globalData.order = res.data.order
    //   // if (res.data.status == 1) {
    //   //   wx.showToast({
    //   //     title: '提交成功',
    //   //     duration: 2000
    //   //   });
    //   //   setTimeout(function() {
    //   //     if (res.data.order.pay_status == 1) {
    //   //       wx.switchTab({
    //   //         url: "../../member/index/index"
    //   //       });
    //   //       return;
    //   //     }
    //   //     wx.navigateTo({
    //   //       url: '../payment/payment?order_id=' + result
    //   //     });
    //   //   }, 2000);
    //   // }
    // });
  },
//  获取订单所有信息
  getCarts: function() {
   
    // console.log("123")
    console.log("++++123123")
    var user_id = wx.getStorageSync("user_id")
    // cosnole.log(user_id)
    var that = this
    var stroe_id = app.globalData.store_id;
    // console.log(cartIds)
    // console.log(stroe_id)
    if (!stroe_id || !user_id){
      wx.switchTab({
        url: '../../index/index'
      });
    }
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
           address_id: res.data.address[0].address_id
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
     console.log(user_id)
     console.log(that.data.goodsID)
     console.log(that.data.goodsNum)
     var winrecord = {
       user_id: user_id,
       goods_ids: that.data.goodsID
       };
     if (that.data.orginPage =="detail"){
       winrecord["goods_num"] = parseInt(that.data.goodsNum)
     }
    // 获取商品 库存 交易金额
     server.getJSON('/Dopay/confirmOrder', winrecord, function(res) {
      var result=res.data
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
        if (shopList.length==0){
          wx.showToast({
            title: '获取商品失败',
            image:'../../../images/about.png',
            duration: 2000,
            complete:function(){
              setTimeout(function () {
                wx.switchTab({
                  url: '../../cart/cart'
                });
              }, 2000);
            }
          })
        }
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
  // 获取地址信息
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
  // 获取用户余额现在弃用
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
  // 不知道什么选择
  // check1: function() {
  //   this.setData({
  //     check: ['true', '']
  //   });
  // },
  // check2: function() {
  //   this.setData({
  //     check: ['', 'true']
  //   });
  // },
  onReady: function() {
    // 页面渲染完成
  },

  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    this.setData({
      orderState: false
    })
    // 页面关闭
  },
  distribution: function() {
    this.setData({
      dtb_show: true
    })
  },
  // 选择地区
  slectDistribution: function(e) {
    var that = this
    let selected_distribution = e.target.dataset.distribution_status;
    this.setData({
      dtb_show: false,
      selected_distribution: selected_distribution
    });

    if (selected_distribution == 1) {
      var user_id = getApp().globalData.userInfo.user_id
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
  //  切换地址  弃用
  // gotoAddAddr: function() {
  //   wx.navigateTo({
  //     url: '/pages/address/add/add?order=1',
  //   })
  // },
  // 是否数值判断 
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