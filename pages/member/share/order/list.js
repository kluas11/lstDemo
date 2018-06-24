var server = require('../../../../utils/server');
var cPage = 0;
var ctype = "NO";
Page({
	tabClick:function(e){
        var index = e.currentTarget.dataset.index
        var types= ["NO","WAITPAY","WAITSEND","WAITRECEIVE","FINISH"]
         
         
		var classs= ["text-normal","text-normal","text-normal","text-normal","text-normal","text-normal"]
		classs[index] = "text-select"
		this.setData({tabClasss:classs,tab:index})
        cPage = 0;
		ctype = types[index];
		this.data.orders = [];
		this.getOrderLists(types[index],cPage);
	},

	onReachBottom: function () {
		this.getOrderLists(ctype,++cPage);
		wx.showToast({
		  title: '加载中',
		  icon: 'loading'
		})
	},
	onPullDownRefresh: function () {
    cPage = 0;
    this.data.orders = [];
		this.getOrderLists(ctype,0);
	},
	data: {
		orders: [],
        tabClasss:["text-select","text-normal","text-normal","text-normal","text-normal"],
	},
	getOrderLists:function(ctype,page){
        var that = this;
		var user_id = getApp().globalData.userInfo.user_id
	
	    server.getJSON('/User/getShareOrderList/user_id/' + user_id + "/type/" + ctype + "/page/" + page,function(res){
var datas = res.data.result;
            
			var ms = that.data.orders
      for(var i in datas){
   ms.push(datas[i]);
}
wx.stopPullDownRefresh();
			that.setData({
						orders: ms
					});
		});
	},
	onShow:function(){
   	cPage = 0;

	this.data.orders = [];
        this.getOrderLists(ctype,cPage);
		
  },
	onLoad: function (option) {
		 // 页面显示
if(option.cid == "WAITSEND"){
	var  tabClasss = ["text-normal","text-normal","text-select","text-normal","text-normal"];
	this.setData({tabClasss:tabClasss});
}
if(option.cid == "FINISH"){
	var  tabClasss = ["text-normal","text-normal","text-normal","text-normal","text-select"];
	this.setData({tabClasss:tabClasss});
}

	cPage = 0;
	ctype = option.cid;
	this.data.orders = [];
	}
});