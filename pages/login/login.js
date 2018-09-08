// pages/login/login.js
var url;
var id;
var type;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    url =  options.url;
    id = options.id;
    type = options.type ? options.type:"";
  },
  //获取授权
  getuserTap(e){
    // console.log(e.detail.errMsg)
    if (e.detail.errMsg === 'getUserInfo:ok'){
      if (url === 'pages/index/index'){
        url = "/"+url;
        wx.switchTab({
          url
        })
      }else{
        // console.log(isNaN(+id))
        if (!isNaN(+id)){
          if (type){
            url = url + "?objectId=" + id+"&type="+tyep
          }else{
            url = url + "?objectId=" + id
          }
        } else{
          url = url + "?q=" + id
        }
        url = "/" + url;
        wx.navigateTo({
          url
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  }
})