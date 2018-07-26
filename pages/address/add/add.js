    var server = require('../../../utils/server');
    var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min');
    const App = getApp();
    Page({
      data: {
        outRange: true,
        order: false,
        current: 0,
        provinceObjects: [],
        cityObjects: [],
        regionObjects: [],
        townObjects: [],
        areaSelectedStr: '请选择省市区',
        maskVisual: 'hidden',
        provinceName: '请选择'
      },
      addrDetail: '',
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

        var is_default = 1;
        var user_id = wx.getStorageSync("user_id");
        var twon = 0;
        var province_id = this.data.province_id;
        var city_id = this.data.city_id;
        var district_id = this.data.district_id;
        console.log('省市区地址ID', province_id, city_id, district_id)
        var that = this;
        server.newpostJSON('/User/addAddress', {
          user_id: user_id,
          mobile: mobile,
          zipcode: zipcode,
          consignee: consignee,
          address: address,
          is_default: is_default,
          province: province_id,
          city: city_id,
          district: district_id
        }, function(res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '保存成功',
              duration: 1000
            });
            if (that.data.returnTo == 1)
              setTimeout(function() {
                wx.navigateTo({
                  url: '../../order/ordersubmit/index'
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
        this.formdis();
      },
      addressChange: function(e) {
        let context = this;
        var value = e.detail.value;
        this.setData({
          address: value
        });
        this.formdis();
      },
      phoneChange: function(e) {
        var value = e.detail.value;
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(value)) {
          this.setData({
            mobile: value
          });
          this.formdis();
        } else {
          wx.showToast({
            title: '手机格式有误',
          })
        }

      },
      yzChange: function(e) {
        var value = e.detail.value;
        this.setData({
          zipcode: value
        });
        this.formdis();
      },
      formdis: function() {
        var data = this.data
        if (data.consignee && data.address && data.mobile && data.zipcode) {
          this.setData({
            outRange: false
          })
        }
      },
      getArea: function(pid, cb) {
        var that = this;
        server.getJSON('/User/getArea', {
          parent_id:pid,
          store_id: App.globalData.store_id
        }, function(res) {
          cb(res.data.result);
        })
      },
      onLoad: function(options) {
        wx.showToast({
          title: '正在加载...',
          icon: 'loading',
          duration: 99999
        })
        if (options.order != undefined) {
          this.setData({
            order: true
          })
        }
        var returnTo = options.returnTo ? options.returnTo:"";
        this.setData({
          returnTo: returnTo
        });
        var that = this;
        //获取用户的位置信息
        wx.getLocation({
          type: 'gcj02',
          success: function(res) {
            // console.log(res)
            var latitude = res.latitude;
            var longitude = res.longitude;
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            // 调用腾讯地图API，通过坐标转换用户的确实地址
            var map = new QQMapWX({
              key: '2NTBZ-BK3W5-NGVIZ-Q5ZZP-L7G5K-GVBFQ' // 必填
            });
            // address: res.result.address_component.city
            // 调用接口
            map.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              success: function(res) {
                let data = res.result.address_component;
                console.log(res.result.ad_info);
                if (res.result.ad_info.city != undefined) {
                  that.setData({
                    province: data.province,
                    city: data.city,
                    district: data.district,
                    areaSelectedStr: data.province + data.city + data.district,
                    address: data.street_number
                  })
                }
                // load province
                that.getArea(0, function(area) {
                  wx.hideToast();
                  that.getid("province", area); //设置省ID
                  that.getArea(that.data.province_id, function(area) {
                    that.getid("city", area); //市id
                    that.getArea(that.data.city_id, function(area) {
                      that.getid("district", area); //区id
                    })
                  })
                  that.setData({
                    provinceObjects: area
                  });
                });
              },
              fail: function(res) {
                console.log(res)
              },
              complete: function(res) {}
            });
          }
        })
      },
      getid: function(str, area) {
        var that = this;
        var id = str + '_id';
        var obj = {};
        area.forEach(function(val, index) {
          if (val.name == that.data[str]) {
            obj[id] = val.id;
            that.setData(obj)
            return;
          }
        })
      },
      loadAddress: function(options) {
        //功能未知
        var that = this;
        if (options.objectId != undefined) {
          // 第一个参数是 className，第二个参数是 objectId
          var address = AV.Object.createWithoutData('Address', options.objectId);
          address.fetch().then(function() {
            that.setData({
              address: address,
              areaSelectedStr: address.get('province') + address.get('city') + address.get('region')
            });
            // console.log(address.get('province'))
            // console.log(address.get('city'))
            // console.log(address.get('region'))
          }, function(error) {
            // 异常处理
          });
        }
      },
      setDefault: function() {
        //功能未知
        var that = this;
        var user = AV.User.current();
        // if user has no address, set the address for default
        var query = new AV.Query('Address');
        query.equalTo('user', user);
        query.count().then(function(count) {
          if (count <= 0) {
            that.isDefault = true;
          }
        });
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
      // 点击省
      provinceTapped: function(e) {
        // 标识当前点击省份，记录其名称与主键id都依赖它
        var index = e.currentTarget.dataset.index;
        // current为1，使得页面向左滑动一页至市级列表
        // provinceIndex是市区数据的标识
        var province_data = this.data.provinceObjects[index];
        this.setData({
          provinceName: province_data.name,
          province_id: province_data.id,
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
        this.getArea(province_data.id, function(area) {
          // city就是wxml中渲染要用到的城市数据，cityObjects是LeanCloud对象，用于县级标识取值
          that.setData({
            cityName: '请选择',
            cityObjects: area
          });
          // 确保生成了数组数据再移动swiper
          that.setData({
            current: 1
          });
        });
      },
      // 点击市
      cityTapped: function(e) {
        // 标识当前点击县级，记录其名称与主键id都依赖它
        var index = e.currentTarget.dataset.index;
        // current为1，使得页面向左滑动一页至市级列表
        // cityIndex是市区数据的标识
        var city_data = this.data.cityObjects[index]
        console.log(city_data)
        this.setData({
          cityIndex: index,
          regionIndex: -1,
          townIndex: -1,
          cityName: city_data.name,
          city_id: city_data.id,
          regionName: '',
          townName: '',
          town: []
        });
        var that = this;
        //cityObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
        // getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
        this.getArea(city_data.id, function(area) {
          // region就是wxml中渲染要用到的城市数据，regionObjects是LeanCloud对象，用于县级标识取值
          that.setData({
            regionName: '请选择',
            regionObjects: area
          });
          // 确保生成了数组数据再移动swiper
          that.setData({
            current: 2
          });
        });
      },
      // 点击区
      regionTapped: function(e) {
        // 标识当前点击镇级，记录其名称与主键id都依赖它
        var index = e.currentTarget.dataset.index;
        // current为1，使得页面向左滑动一页至市级列表
        // regionIndex是县级数据的标识
        var region_data = this.data.regionObjects[index];
        this.setData({
          regionIndex: index,
          townIndex: -1,
          regionName: region_data.name,
          district_id: region_data.id,
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

        // this.getArea(region_data.id, function(area) {
        //   // 假如没有镇一级了，关闭悬浮框，并显示地址
        //   console.log(area)
        //   if (area.length == 0) {
        //     var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
        //     that.setData({
        //       areaSelectedStr: areaSelectedStr
        //     });
        //     that.cascadeDismiss();
        //     return;
        //   }
        //   // region就是wxml中渲染要用到的县级数据，regionObjects是LeanCloud对象，用于县级标识取值
        //   that.setData({
        //     townName: '请选择',
        //     town: area
        //   });
        //   // 确保生成了数组数据再移动swiper
        //   that.setData({
        //     current: 3
        //   });
        // });
      },
      // 点击街道
      townTapped: function(e) {
        // 标识当前点击镇级，记录其名称与主键id都依赖它
        var index = e.currentTarget.dataset.index;
        // townIndex是镇级数据的标识
        var town_data = this.data.town[index];
        console.log(this.data.town)
        this.setData({
          townIndex: index,
          townName: town_data.name,
          town_id: town_data.id
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
      },
    })