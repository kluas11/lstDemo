var server = require('../../../utils/server');
var address_id;
const App = getApp();
Page({
  isDefault: false,
  formSubmit: function(e) {
    // user 
    var mobile = this.data.mobile;
    // detail
    var zipcode = this.data.zipcode;
    // realname
    var consignee = this.data.consignee;
    // mobile
    var address = this.data.address;
    var is_default = this.data.is_default;
    var user_id = this.data.user_id;
    var province;
    var city;
    var district;
    if (this.data.regionObjects.length == 0) {
      province = this.data.provincev
      city = this.data.cityvalue
      district = this.data.district
    } else {
      province = this.data.provinceObjects[this.data.provinceIndex].id;
      city = this.data.cityObjects[this.data.cityIndex].id;
      district = this.data.regionObjects[this.data.regionIndex].id;
    }
    var that = this;
    server.newpostJSON('/User/editAddress', {
      user_id,
      mobile,
      zipcode,
      consignee,
      address,
      is_default,
      province,
      city,
      district,
      address_id
    }, function(res) {
      if (res.data == 1) {
        wx.showToast({
          title: '保存成功',
          duration: 1000
        });
        if (that.data.returnTo == 1)
          setTimeout(function() {
            wx.navigateTo({
              url: '/pages/order/ordersubmit/index'
            });
          }, 1000);
        else {
          wx.navigateBack();
        }
      }
    });
  },
  nameChange: function(e) {
    var value = e.detail.value;
    this.setData({
      consignee: value
    });
  },
  addressChange: function(e) {
    var value = e.detail.value;
    this.setData({
      address: value
    });
  },
  phoneChange: function(e) {
    var value = e.detail.value;
    this.setData({
      mobile: value
    });
  },
  yzChange: function(e) {
    var value = e.detail.value;
    this.setData({
      zipcode: value
    });
  },
  data: {
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '请选择省市区',
    maskVisual: 'hidden',
    provinceName: '请选择'
  },
  getArea: function(pid, cb) {
    var that = this;
    server.getJSON('/User/getArea',{
      parent_id:pid
    }
    , function(res) {
      cb(res.data.result);
    });

  },
  onLoad: function(options) {
    var returnTo = options.returnTo ? options.returnTo : '';
    this.setData({
      returnTo: returnTo
    });
    var that = this;
    // load province
    this.getArea(0, function(area) {
      var array = [];
      for (var i = 0; i < area.length; i++) {
        array[i] = area[i].name;
      }
      that.setData({
        province: array,
        provinceObjects: area
      });
    });
    this.loadAddress(options);
  },
  loadAddress: function(options) {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    if (options.objectId != undefined) {
      address_id = options.objectId;
      server.getJSON('/User/getOneAddress', {
        user_id,
        address_id
      }, function(res) {
        console.log(res.data);
        var address = res.data;
        that.setData({
          areaSelectedStr: address.province + address.city + address.district,
          mobile: address.mobile,
          zipcode: address.zipcode,
          address: address.address,
          consignee: address.consignee,
          district: address.district_id,
          cityvalue: address.city_id,
          provincev: address.province_id,
          user_id: user_id,
          is_default: address.is_default
        });
      });
    }
  },
  cascadePopup: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.translateY(-285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    });
  },
  cascadeDismiss: function() {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  provinceTapped: function(e) {
    // 标识当前点击省份，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // provinceIndex是市区数据的标识
    this.setData({
      provinceName: this.data.province[index],
      regionName: '',
      townName: '',
      provinceIndex: index,
      cityIndex: -1,
      regionIndex: -1,
      townIndex: -1,
      region: [],
      town: []
    });
    var that = this;
    //provinceObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    // getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
    this.getArea(this.data.provinceObjects[index].id, function(area) {
      var array = [];
      for (var i = 0; i < area.length; i++) {
        array[i] = area[i].name;
      }
      // city就是wxml中渲染要用到的城市数据，cityObjects是LeanCloud对象，用于县级标识取值
      that.setData({
        cityName: '请选择',
        city: array,
        cityObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 1
      });
    });
  },
  cityTapped: function(e) {
    // 标识当前点击县级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // cityIndex是市区数据的标识
    this.setData({
      cityIndex: index,
      regionIndex: -1,
      townIndex: -1,
      cityName: this.data.city[index],
      regionName: '',
      townName: '',
      town: []
    });
    var that = this;
    //cityObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    // getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
    this.getArea(this.data.cityObjects[index].id, function(area) {
      var array = [];
      for (var i = 0; i < area.length; i++) {
        array[i] = area[i].name;
      }
      // region就是wxml中渲染要用到的城市数据，regionObjects是LeanCloud对象，用于县级标识取值
      that.setData({
        regionName: '请选择',
        region: array,
        regionObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 2
      });
    });
  },
  regionTapped: function(e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // regionIndex是县级数据的标识
    this.setData({
      regionIndex: index,
      townIndex: -1,
      regionName: this.data.region[index],
      townName: ''
    });
    var that = this;
    //townObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
    // getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
    var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
    that.setData({
      areaSelectedStr: areaSelectedStr
    });
    that.cascadeDismiss();

    // 7/24  暂时只做三级省市区

    // this.getArea(this.data.regionObjects[index].id, function(area) {
    //   // 假如没有镇一级了，关闭悬浮框，并显示地址
    //   if (area.length == 0) {
    //     var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
    //     that.setData({
    //       areaSelectedStr: areaSelectedStr
    //     });
    //     that.cascadeDismiss();
    //     return;
    //   }
    //   var array = [];
    //   for (var i = 0; i < area.length; i++) {
    //     array[i] = area[i].name;
    //   }
    //   // region就是wxml中渲染要用到的县级数据，regionObjects是LeanCloud对象，用于县级标识取值
    //   that.setData({
    //     townName: '请选择',
    //     town: array,
    //     townObjects: area
    //   });
    //   // 确保生成了数组数据再移动swiper
    //   that.setData({
    //     current: 3
    //   });
    // });
  },
  townTapped: function(e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // townIndex是镇级数据的标识
    this.setData({
      townIndex: index,
      townName: this.data.town[index]
    });
    var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
    this.setData({
      areaSelectedStr: areaSelectedStr
    });
    this.cascadeDismiss();
  },
  currentChanged: function(e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    var current = e.detail.current;
    this.setData({
      current: current
    });
  },
  changeCurrent: function(e) {
    // 记录点击的标题所在的区级级别
    var current = e.currentTarget.dataset.current;
    this.setData({
      current: current
    });
  }
})