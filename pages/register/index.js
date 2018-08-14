var app = getApp()
var maxTime = 60
var interval = null
var currentTime = -1 //倒计时的事件（单位：s）  
var server = require('../../utils/server');
Page({
  data: {
    login: false,
    time: '获取验证码',
    birthday: '',
    mobile: '',
    real_name: '',
    sex: '0',
    storeIndex: 0,
    storeList: [],
    gender: {
      list: ['保密', '男', '女', ],
      list_en: ['male', 'female', 'other']
    },
    storeState: false,
    store_id: "",
    color: '#f3f3f3'
  },

  onLoad: function(options) {
      currentTime = -1;
      var login = app.globalData.login;
      var that = this;
  },
  onShow: function() {
    var that = this;
    this.getUserInfo()
  },
  storeChoice: function(index) {
    this.setData({
      storeIndex: index.detail.value
    })
  },
  getPhoneNumber: function(e) {
    // console.log(e)
    var that = this;
    wx.checkSession({
      success: function() {
        that.deciphering(e)
      },
      fail: function() {
        // wx.login() //重新登录
        app.getlogin().then(res => {
          that.deciphering(e)
        }).then(null, (err) => console.log("rejected:", err));

      }
    })
  },
  deciphering: function(e) {
    let that = this;
    let userID = wx.getStorageSync("user_id");
    server.newpostJSON("/User/getDecryptData", {
      user_id: userID,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }, function(res) {
      // console.log(res)
      that.setData({
        mobile: res.data.phoneNumber
      })
      that.unfocused(res.data.phoneNumber)
    })
  },
  unfocused: function(num) {
    let that = this;
    let numbers = num.detail.value ? num.detail.value : num;
    // if()
    if (numbers.length != 11) {
      wx.showToast({
        title: "输入正确手机号"
      })
      return;
    } else {
      // 手机号更新资料信息接口
      server.getJSON("/User/checkOldUser", {
        mobile: numbers,
      }, function(res) {
        console.log(res)
        if (res.data.status) {
          let result = res.data.info;
          let winRecord = {
            birthday: result.birthday == "0" ? "" : result.birthday,
            real_name: result.real_name,
            sex: result.sex,
          };
          if (result.store_id != "" && result.store_id) {
            let list = that.data.storeList
            let indexs = list.findIndex(function(item, index) {
              return item.store_id == result.store_id
            })
            winRecord["storeState"] = true
            winRecord["store_id"] = result.store_id
            winRecord['storeIndex'] = indexs
          }
          that.setData(winRecord)

        } else {
          console.log("号码不在老用户了解一下")
        }
      })
    }
  },
  // 真实姓名
  inputPass: function(e) {
    this.setData({
      real_name: e.detail.value,
    });
  },
  // 获取生日
  bindDateChange: function(e) {
    // console.log((new Date(e.detail.value).getTime() )/ 1000)
    this.setData({
      birthday: (new Date(e.detail.value).getTime()) / 1000
    })
  },
  // 获取手机号码
  getPhoneNum: function(e) {
    this.setData({
      mobile: e.detail.value,
    });
  },
  // 性别
  bindGenderChange: function(e) {
    this.setData({
      'sex': e.detail.value,
    });
  },
  getUserInfo: function() {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    // console.log(user_id)
    if (!user_id) {
      wx.showToast({
        title: '用户信息有误',
        duration: 2000,
        icon: 'clear'
      })
      return;
    }
    server.getJSON("/User/getUserDetails", {
      user_id: user_id,
    }, function(res) {

      var data = res.data;
      // console.log(data)
      let winRecord = {
        birthday: data.birthday == "0" ? "" : data.birthday,
        mobile: data.mobile,
        real_name: data.real_name,
        sex: data.sex,
      };
      if (data.store_id != "" && data.store_id) {
        winRecord["storeState"] = true
        winRecord["store_id"] = data.store_id
      }
      that.setData(winRecord)
      server.getJSON("/User/getUserDetailsStores", function(result) {
        let storeID = app.globalData.store_id;
        let results = result.data;
        // data 上个请求的数据
        if (data.store_id != "" && data.store_id) {
          winRecord["storeState"] = true
          winRecord["store_id"] = data.store_id
          storeID = that.data.store_id
        }
        let indexs = results.findIndex(function(item, index) {
          return item.store_id == storeID

        })
        that.setData({
          storeIndex: indexs,
          storeList: results
        })
      })
    });
  },
  // 提交信息
  quick_register_phone: function(e) {
    var that = this;
    var user_Id = wx.getStorageSync("user_id");
    var real_name = that.data.real_name;
    var mobile = that.data.mobile;
    var sex = that.data.sex;
    var PhoneRegex = RegExp('^1[34578]\\d{9}$', 'g');
    let store_id = that.data.storeList[that.data.storeIndex].store_id;
    var winrecord = {
      user_id: user_Id,
      real_name: real_name == null ? "" : real_name,
      sex: sex,
      store_id: store_id
    }
    if (that.data.birthday && that.data.birthday != "0") {
      var bir = (that.data.birthday) * 1000
      var birthday = new Date(bir)
      birthday.setHours(0)
      birthday.setMinutes(0)
      birthday.setSeconds(0)
      birthday = (new Date(birthday).getTime())
      winrecord['birthday'] = birthday / 1000
    } else {
      winrecord['birthday'] = 0
    }
    if (!PhoneRegex.test(mobile)) {
      wx.showToast({
        title: '输入正确号码',
        icon: "clear",
        duration: 2000,
      })
      return
    } else {
      winrecord['mobile'] = mobile
    }
    // console.log(winrecord)
    server.newpostJSON('/User/setUserDetails', winrecord, function(res) {
      if (res.data == 1) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000,
          complete: function() {
            setTimeout(function() {
              wx.navigateBack({})
            }, 1500)
          }
        })
      } else {
        wx.showToast({
          title: '绑定失败',
          icon: 'clear',
          duration: 2000
        })
      }
    })
  }
})