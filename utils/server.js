function __args() {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
      setting.success = arguments[2];
    } else {
      setting.success = arguments[1];
    }
  }
  if (setting.url.indexOf('http://') !== 0) {
    //http://120.27.18.4/index.php/
    //http://shops.wudhl.com/index.php/WXAPIhttps://www.505coder.com
    // setting.url = 'http://172.16.27.247:88/index.php/WXAPI' + setting.url;
    setting.url = 'https://tlst.paycore.cc/index.php/WXAPI' + setting.url; // 测试
    //  setting.url = 'https://lstmall.paycore.cc/index.php/WXAPI' + setting.url;  // 正式
  }
  return setting;
}

function __json(method, setting) {
  setting.method = method;
  setting.header = {
    'content-type': 'application/json',
    "cookie": `${wx.getStorageSync("sessionName")}=${wx.getStorageSync("sessionId")}`
  };
  setting.complete =function(res){
    if (res.statusCode === 401){
      getApp().getlogin();
    }
  }
  return wx.request(setting);
}

function __newjson(method, setting) {
  setting.method = method;
  setting.header = {
    "Content-Type": "application/x-www-form-urlencoded",
    "cookie": `${wx.getStorageSync("sessionName")}=${wx.getStorageSync("sessionId")}`
  };
  setting.complete = function (res) {
    if (res.statusCode === 401) {
      getApp().getlogin();
    }
  }
  return wx.request(setting);
}

module.exports = {
  getJSON: function() {
    return __json('GET', __args.apply(this, arguments));
  },
  postJSON: function() {
    return __json('POST', __args.apply(this, arguments));
  },
  newpostJSON:function(){
    return __newjson('POST', __args.apply(this, arguments));
  },
  sendTemplate: function(formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success, // errorcode==0时发送成功
      fail
    });
  }
}