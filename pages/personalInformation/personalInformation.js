var server = require('../../utils/server');
// 个人信息页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday: '',
    mobile: '',
    real_name: '',
    sex: '保密',
    storeName:"",
    storeID:"",
    storeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function () {
    var that = this;
    this.getUserInfo()
  },
  getUserInfo: function () {
    var that = this;
    var user_id = wx.getStorageSync("user_id");
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
    }, function (res) {
      var data = res.data;
      var winRecord = {
        birthday: data.birthday == "0" ? "" : data.birthday,
        mobile: data.mobile,
        real_name: data.real_name,
        sex: data.sex == 0 ? "保密" : data.sex=="1"?"男":"女",
      };
      if (data.store_id != "" && data.store_id) {
        server.getJSON("/User/getUserDetailsStores", function (result) {
          let results = result.data;
          let indexs = results.filter(function (item, index) {
            return item.store_id == data.store_id
          })
          winRecord["storeName"] = indexs[0].store_name ||"暂时未绑定"
          winRecord['storeID'] = indexs[0].store_id
          that.setData(winRecord)
        })
      }else{
        winRecord["storeName"] = "暂时未绑定"
        that.setData(winRecord)
      }
     
    });
  },
  skipEdit:function(){
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
    wx.navigateTo({
      url: '/pages/register/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var that = this;
    // this.getUserInfo()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})