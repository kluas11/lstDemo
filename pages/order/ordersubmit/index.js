// pages/order/ordersubmit/index.js
var server = require('../../../utils/server');
var tp;
var pay_points;
var points_rate;
const app = getApp();
const postUrl = app.postUrl;
Page({
  data: {
    image_oss: app.image_oss + "130_150",
    goodsID: "",
    goodsNum: "",
    orginPage: "",
    orderId: "",
    orderState: false,
    addressToggle: false,
    addressIndex: 0,
    distributionIndex: 1,
    distributionArray: [{
      id: 0,
      name: "门店自取"
    }, {
      id: 1,
      name: "邮寄"
    }],
    paymentIndex: 0,
    paymentArray: [{
      id: 0,
      name: "微信支付",
      way: 'wxPreparePay',
      class: "payByBalance"
    }, {
      class: "payByWXPay button-hover",
      id: 1,
      name: "余额支付",
      way: 'walletPay'
    }],
    // 用户余额
    use_money: 0,
    // 总价格
    totalPrice: 0,
    // 商品列表清单
    shopList: [],
    // 地址列表
    addressList: [],
    // 邮费
    expressFee: 0,
    use_point: 0,
    ordersubmit: true, //优惠券按钮判断
    cuoponhidden: false,
    coupontext: "暂无可用优惠券"
  },
  // 页面开始加载
  onLoad: function(options) {
    // console.log(options)
    this.setData({
      goodsID: options.goodsID,
      orginPage: options.origin,
      goodsNum: options.goods_num || 0
    })
  },
  // 页面显示
  onShow: function() {
    if (!this.data.goodsID) {
      //   wx.showToast({
      //     title: '订单已关闭',
      //     image: '../../../images/about.png',
      //     duration: 1000,
      //     complete: function() {
      //       setTimeout(function() {
      //         wx.switchTab({
      //           url: '../../cart/cart'
      //         });
      //       }, 1000)
      //     }
      //   })
      return;
    }
    this.getCarts();
  },
  onUnload: function() {
    this.setData({
      orderState: false
    })
    // 页面关闭
  },
  // 切换地址
  switchaddress: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var Index = e.currentTarget.dataset.index;
    var address_id = that.data.addressList[Index].address_id;
    var store_id = app.globalData.store_id;
    server.getJSON('/Dopay/queryShippingPrice', {
      store_id: store_id,
      address_id: address_id
    }, function(res) {
      if (res.data.status) {
        let expressFee = that.data.distributionIndex == 1 ? res.data.fee : 0
        that.setData({
          expressFee,
          addressIndex: Index,
          addressToggle: false
        })
        that.sum();
        wx.hideLoading()
      }
    })
  },
  // 切换配送方式
  distributionChange: function(e) {
    // console.log(e.detail.value)
    var that = this
    var addressIndex = that.data.addressIndex
    var address_id = that.data.addressList[addressIndex].address_id
    var store_id = getApp().globalData.store_id;
    new Promise((resolve, reject) => {
      if (e.detail.value == 1) {
        // 选择物流配送  获取运费
        server.getJSON('/Dopay/queryShippingPrice', {
          store_id: store_id,
          address_id: address_id
        }, function(res) {
          if (res.data.status) {
            that.setData({
              expressFee: res.data.fee
            })
            resolve()
          }
        })
      } else {
        this.setData({
          expressFee: 0
        })
        resolve()
      }
    }).then(() => {
      this.setData({
        distributionIndex: e.detail.value
      })
      this.sum()
    })

  },
  // 获取优惠券列表
  getcuoponlist() {
    if (this.data.cuoponlist.length > 0) {
      this.setData({
        cuoponhidden: true
      })
    } else {
      return;
    }
  },
  // 关闭领券
  hidetap(e) {
    if (e.target.id === 'cuopon_info') {
      this.setData({
        cuoponhidden: false
      })
    } else {
      return;
    }
  },
  // 点击使用优惠券
  receivetap(e) {
    let index = e.currentTarget.dataset.index;
    let coupon = this.data.cuoponlist[index];
    this.setData({
      cuoponhidden: false,
      coupon_id: coupon.id,
      card_id: coupon.coupon_id,
      discount_coupon_money: coupon.discount_coupon_money,
      select_index: index
    })
    this.sum()
  },
  //  支付方式启用
  paymentChange: function(e) {
    this.setData({
      paymentIndex: e.detail.value
    })
  },
  // 显示地址列表
  addressSelect: function() {
    this.setData({
      addressToggle: true
    })
  },
  paymentBtn: function(e) {
    var user_id = wx.getStorageSync("user_id");
    var open_id = app.globalData.openid;
    var order_id = this.data.orderId
    var that = this;
    if (order_id == "" || !order_id || order_id == null) {
      wx.hideLoading()
      wx.showToast({
        title: '订单有误',
        image: '../../../images/about.png',
        duration: 2000,
        complete: function() {
          setTimeout(function() {
            wx.switchTab({
              url: '../../index/index'
            });
          }, 2000);
        }
      })
    }
    console.log(open_id)
    if (open_id == "" || !open_id || open_id == null) {
      wx.hideLoading()
      wx.showModal({
        title: "消息提示",
        content: "获取个人信息有误,请后台关闭小程序再使用",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../index/index'
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '../../index/index'
            });
          }
        }
      })
      return false;
    }
    var payway = e.currentTarget.dataset.way
    var port = ""
    var winrecord = {}
    if (payway == "wxPreparePay") {
      port = "/Dopay/wxPreparePay"
      winrecord = {
        user_id: user_id,
        open_id: open_id,
        order_id: order_id
      }
      that.sendpayment(postUrl, port, winrecord, payway)
    } else {
      port = "/Dopay/walletPay"
      winrecord = {
        user_id: user_id,
        order_id: order_id
      }
      that.sendpayment(postUrl, port, winrecord, payway)
    }
  },
  // 发送支付
  sendpayment: function(postUrl, port, winrecord, payway) {
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
      success: function(res) {
        wx.hideLoading()
        // console.log(res)
        // 微信支付
        if (payway == "wxPreparePay") {
          var result = res.data.data
          wx.requestPayment({
            "timeStamp": result.timeStamp,
            "nonceStr": result.nonceStr,
            "package": result.package,
            "signType": result.signType,
            'paySign': result.paySign,
            'success': function(res) {
              wx.hideLoading()
              // console.log(res)
              wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2000,
                complete: function() {
                  that.setData({
                    goodsID: ""
                  })
                  setTimeout(function() {
                    wx.navigateTo({
                      url: '../../order/list/list'
                    });
                  }, 2000)

                }
              })
            },
            'fail': function(res) {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: "支付失败",
                image: '../../../images/about.png',
                duration: 2000,
                complete: function() {
                  setTimeout(function() {
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
              complete: function() {
                setTimeout(function() {
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
              complete: function() {
                setTimeout(function() {
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
      fail: function(res) {
        wx.showToast({
          title: '下单失败',
          image: '../../../images/about.png',
          duration: 2000,
          complete: function() {
            setTimeout(function() {
              wx.switchTab({
                url: '../../index/index'
              });
            }, 2000)

          }
        })
      },
      complete: function() {
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
    var that = this;
    // 获取需要买的商品 
    var goodsID = this.data.goodsID
    // console.log(.shopList)
    // 获取到user_id
    var user_id = wx.getStorageSync("user_id")
    // store_id 获取到storeID
    var store_id = app.globalData.store_id;
    var addressIndex = that.data.addressIndex;
    var addressID = that.data.addressList[addressIndex].address_id;
    var coupong_id = that.data.coupon_id || '';
    var winrecord = {
      user_id: user_id,
      store_id: store_id,
      goods_ids: goodsID,
      address_id: addressID,
      is_express: that.data.distributionIndex,
      user_coupon_id: coupong_id
    }
    if (that.data.goodsNum > 0) {
      winrecord["goods_num"] = that.data.goodsNum
    }
    // console.log(winrecord)
    wx.request({
      url: postUrl + "/Dopay/createOrder",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: winrecord,
      method: 'POST',
      success: function(res) {
        // console.log(res)
        wx.hideLoading();
        var result = res.data
        if (result.status) {
          that.setData({
            orderId: result.order_id,
            orderState: true
          })
          that.confirmPayMoney(result.order_id);
        } else {
          wx.showToast({
            title: '下单失败',
            image: '../../../images/about.png',
            duration: 2000,
            complete: function() {

              setTimeout(function() {
                wx.switchTab({
                  url: '../../index/index'
                });
              }, 2000);
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '下单失败',
          image: '../../../images/about.png',
          duration: 2000,
          complete: function() {
            setTimeout(function() {
              wx.switchTab({
                url: '../../index/index'
              });
            }, 2000);
          }
        })
      }
    })
  },
  //关闭支付窗口
  hidden_paybox(e) {
    if (e.target.id === 'paybox') {
      this.setData({
        orderState: false
      })
    }
  },
  //获取需要付款的金额
  confirmPayMoney(order_id) {
    let that = this;
    // 获取到user_id
    var user_id = wx.getStorageSync("user_id");
    server.getJSON('/Dopay/confirmPayMoney', {
      order_id,
      user_id
    }, function(res) {
      console.log(res)
      if (res.data.status) {
        that.setData({
          total_amount: res.data.total_amount
        })
      }
    })
  },
  //  获取订单所有信息
  getCarts: function() {
    var user_id = wx.getStorageSync("user_id");
    var that = this
    var store_id = app.globalData.store_id;
    that.getAddress(user_id).then(res => {
      if (res.data.length != 0) {
        that.setData({
          //  默认地址
          addressList: res.data
        })
        server.getJSON('/Dopay/queryShippingPrice', {
          store_id: store_id,
          address_id: res.data[0].address_id
        }, function(res) {
          if (res.data.status) {
            that.setData({
              expressFee: res.data.fee
            })
            that.sum();
          }
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: "消息提示",
          content: "目前没有默认地址,跳转至地址管理页面",
          showCancel: false,
          success: function(res) {
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
    }).catch((err) => {})
    that.getUserMonder(user_id).then(res => {
      var money = res.data
      if (that.isRealNum(money)) {
        that.setData({
          use_money: money
        })
      } else {
        wx.hideLoading();
        //  console.log("数值youwu")
      }
    }).catch(e => {
      console.log(e)
    })
    var winrecord = {
      user_id: user_id,
      goods_ids: that.data.goodsID
    };
    if (that.data.orginPage == "detail") {
      winrecord["goods_num"] = parseInt(that.data.goodsNum)
    }
    // 获取商品 库存 交易金额
    // console.log(winrecord)
    server.getJSON('/Dopay/confirmOrder', winrecord, function(res) {
      var result = res.data
      console.log(res)
      if (result.status == false) {
        wx.hideLoading()
        app.globalData.cart_ids = ""
        wx.showModal({
          title: "消息提示",
          content: "商品库存不足,请检查商品",
          success: function(res) {
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
      } else {
        wx.hideLoading();
        // 总价格
        // totalPrice
        var shopList = result.goodsList;
        var goodsAmount = result.goodsAmount;
        var cuoponlist = result.couponList;
        var discount_activity_money = result.discount_activity_money;
        var discount_coupon_details = result.discount_coupon_details;

        if (shopList.length == 0) {
          wx.showToast({
            title: '获取商品失败',
            image: '../../../images/about.png',
            duration: 2000,
            complete: function() {
              setTimeout(function() {
                wx.switchTab({
                  url: '../../cart/cart'
                });
              }, 2000);
            }
          })
        }
        if (cuoponlist.length > 0) {
          var coupon = cuoponlist[0];
          that.setData({
            coupon_id: coupon.id,
            card_id: coupon.coupon_id,
            discount_coupon_money: coupon.discount_coupon_money,
            coupontext: "可用优惠券",
            select_index: 0
          })
        }
        that.setData({
          shopList,
          cuoponlist,
          goodsAmount,
          discount_activity_money,
          discount_coupon_details
        })
        that.sum();
      }
    })
  },
  parse(num){
    return parseInt(num * 100)
  },
  // 计算应付的总金额
  sum() {
    var parse = this.parse;
    // discount_activity_money 活动优惠价格  discount_coupon_money 优惠券价格  
    //  goodsAmount 商品总价      expressFee  运费 totalPrice 应付金额
    let data = this.data;
    let isnum = this.isNumber;
    let discount_activity_money = isnum(data.discount_activity_money) || 0;
    let discount_coupon_money = isnum(data.discount_coupon_money) || 0;
    let goodsAmount = isnum(data.goodsAmount);
    let expressFee = isnum(data.expressFee) || 0;
    let totalPrice = 0;
    if (discount_coupon_money) {
      this.coupon_spread();
    } else {
      this.setData({
        active_total: discount_activity_money
      })
    }
    // console.log("活动金额", discount_activity_money)
    // console.log("优惠金额", discount_coupon_money)
    // console.log("商品金额", goodsAmount)
    // console.log("邮费金额", expressFee)
    // console.log("应付金额", totalPrice)

    let total = (parse(goodsAmount) - parse(this.data.active_total));
    total = total < 0 ? 0 : total;
    totalPrice = (total + parse(expressFee)) / 100;
    
    this.setData({
      totalPrice
    })
  },
  //优惠券优惠价格平摊
  coupon_spread() {
    var parse = this.parse;    
    let data = this.data;
    let discount_coupon_details = data.discount_coupon_details;
    let card_id = data.card_id;
    let shopList = data.shopList;
    let active_total = 0;
    shopList.forEach((val, index) => {
      let differ = discount_coupon_details[val.goods_id][card_id]; //单个商品平摊优惠券的金额
      let goods_sum = val.shop_price * val.goods_num; //单个商品的总价
      let cou = val.activityInfo.discount_money||0; //活动优惠价
      if ((parse(differ) + parse(cou)) / 100 > goods_sum) {
        var coupon_price = goods_sum;
      } else {
        var coupon_price = (parse(differ) + parse(cou)) / 100;
      }
      active_total = (parse(active_total) + parse(coupon_price)) / 100
    })
    this.setData({
      active_total
    })
  },
  isNumber(num) {
    if (!isNaN(parseFloat(num))) {
      return num;
    }
  },
  // 获取地址信息
  getAddress: function(user_id) {
    return new Promise(function(resolve, reject) {
      try {
        server.getJSON('/User/getAddressList', {
          user_id: user_id,
        }, function(res) {
          resolve(res)
        })
      } catch (e) {
        reject(e)
      }
    })
  },
  // 获取用户余额
  getUserMonder: function(user_id) {
    // console.log(user_id)
    return new Promise(function(resolve, reject) {
      try {
        server.getJSON('/Dopay/getUserMoney', {
          user_id: user_id,
        }, function(res) {
          resolve(res)
        })
      } catch (e) {
        reject(e)
      }
    })
  },
  // 是否数值判断 
  isRealNum: function(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === "" || val == null) {
      return false;
    }
    if (!isNaN(val)) {
      return true;
    } else {
      return false;
    }
  }
})