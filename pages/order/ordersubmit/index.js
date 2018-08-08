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
    outRange: false,
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
      wx.showToast({
        title: '订单已关闭',
        image: '../../../images/about.png',
        duration: 2000,
        complete: function() {
          setTimeout(function() {
            wx.switchTab({
              url: '../../cart/cart'
            });
          }, 2000)
        }
      })
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
    var stroe_id = app.globalData.store_id;
    server.getJSON('/Dopay/queryShippingPrice', {
      store_id: stroe_id,
      address_id: address_id
    }, function(res) {
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
  distributionChange: function(e) {
    console.log(e.detail.value)
    var that = this
    var addressIndex = that.data.addressIndex
    var address_id = that.data.addressList[addressIndex].address_id
    var stroe_id = getApp().globalData.stroe_id;
    if (e.detail.value == 1) {
      // 选择物流配送  获取运费
      server.getJSON('/Dopay/queryShippingPrice', {
        store_id: stroe_id,
        address_id: address_id
      }, function(res) {
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
  // 获取优惠券
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
    let goodsAmount = (this.data.totalPrice * 100 - coupon.discount_coupon_money * 100) / 100;
    this.setData({
      cuoponhidden: false,
      coupon_id: coupon.id,
      discount_coupon_money: coupon.discount_coupon_money,
      goodsAmount,
      select_index:index
    })
  },
  //  支付方式启用
  paymentChange: function(e) {
    this.setData({
      paymentIndex: e.detail.value
    })
  },
  // 切换地址
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
      var total = 0;
      if (that.data.distributionIndex == 1) {
        total = that.data.goodsAmount + that.data.expressFee
      } else {
        total = that.data.goodsAmount
      }

      wx.showModal({
        title: "交易提示",
        content: "此次付款金额为" + total + "元",
        success: function(res) {
          if (res.confirm) {
            that.sendpayment(postUrl, port, winrecord, payway)
          } else if (res.cancel) {
            return;
          }
        },
        fail: function() {
          wx.hideLoading()
          return;
        }
      })
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
            'success': function(res) {
              wx.hideLoading()
              console.log(res)
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
    console.log(winrecord)
    wx.request({
      url: postUrl + "/Dopay/createOrder",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: winrecord,
      method: 'POST',
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        var result = res.data
        if (result.status) {
          that.setData({
            orderId: result.order_id,
            orderState: true
          })
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
  //  获取订单所有信息
  getCarts: function() {
    var user_id = wx.getStorageSync("user_id");
    var that = this
    var stroe_id = app.globalData.store_id;
    that.getAddress(user_id).then(res => {
      if (res.data.length != 0) {
        that.setData({
          //  默认地址
          addressList: res.data
        })
        server.getJSON('/Dopay/queryShippingPrice', {
          store_id: stroe_id,
          address_id: res.data[0].address_id
        }, function(res) {
          if (res.data.status) {
            that.setData({
              expressFee: res.data.fee
            })
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
        var totalPrice = result.goodsAmount;
        var cuoponlist = result.couponList;
        var goodsAmount = '';
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
          goodsAmount = (totalPrice * 100 - coupon.discount_coupon_money * 100) / 100
          that.setData({
            coupon_id: coupon.id,
            discount_coupon_money: coupon.discount_coupon_money,
            coupontext: "可用优惠券",
            select_index:0
          })
        }
        that.setData({
          shopList,
          totalPrice,
          cuoponlist,
          goodsAmount: goodsAmount ? goodsAmount : totalPrice
        })
      }
    })
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