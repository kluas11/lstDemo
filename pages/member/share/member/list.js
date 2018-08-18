var server = require('../../../../utils/server');
var cPage = 0;
var ctype = 1;
Page({
  data: {
    GroupUsers: [],
  
  },
  onLoad: function (option) {
    // 页面显示
    this.getOrderLists();
  },
  getOrderLists: function () {
    var that = this;
    server.getJSON('/User/getGroupUsers',
     function (res) {
       console.log(res.data);
       that.setData({
         GroupUsers: res.data
       })
    });
  }
});