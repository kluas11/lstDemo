var server = require('../../../../utils/server');
var cPage = 0;
var ctype = 1;
Page({
  data: {
    orders: [],
    tabClasss: ["text-select", "text-normal", "text-normal"],
  },

  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var types = ["1", "2", "3"]
    var classs = ["text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
    cPage = 0;
    ctype = types[index];
    this.data.orders = [];
    console.log(types[index]);
    this.getOrderLists(types[index], cPage);
  },

  onReachBottom: function () {
    // 2018年6月24日 取消下拉到底部获取下一页团队名单的设置，现在是一次过读取所有的团队人员

    // this.getOrderLists(ctype, ++cPage);
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading'
    // })
  },

  onPullDownRefresh: function () {
    cPage = 0;
    this.data.orders = [];
    this.getOrderLists(ctype, 0);
  },

  getOrderLists: function (ctype, page) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id

    server.getJSON('/User/getShareList/user_id/' + user_id + "/type/" + ctype + "/page/" + page, function (res) {
      var datas = res.data.result;

      var ms = that.data.orders
      for (var i in datas) {
        ms.push(datas[i]);
      }
      wx.stopPullDownRefresh();
      that.setData({
        orders: ms
      });
      wx.setNavigationBarTitle({
        title: '我的团队' + '(' + ms.length + '人)',
      })
    });
  },

  onShow: function () {
    cPage = 0;
    ctype = 1;
    this.data.orders = [];
    this.getOrderLists(ctype, cPage);
  },

  onLoad: function (option) {
    // 页面显示
    if (option.cid == "2") {
      var tabClasss = ["text-normal", "text-select", "text-normal"];
      this.setData({ tabClasss: tabClasss });
    }
    if (option.cid == "3") {
      var tabClasss = ["text-normal", "text-normal", "text-select"];
      this.setData({ tabClasss: tabClasss });
    }

    cPage = 0;
    ctype = option.cid;
    this.data.orders = [];
  }
});