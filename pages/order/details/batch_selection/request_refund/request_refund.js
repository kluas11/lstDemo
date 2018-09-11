// pages/order/details/batch_selection/request_refund/request_refund.js
let server = require('../../../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeArr: [],
    goodsList: [],
    statusStyle: 'display:none',
    reasonStyle: 'display:none',
    order_id: '',
    refund_way: '',
    //退货数量，默认是1
    // refundNum: 1,
    //货物状态
    goodStatus: 1,
    goodStatusImg: ['/images/hook-active.png', '/images/hook.png'],
    //退款原因
    reason: '多拍/拍错/不想要',
    reasonImg: ['/images/hook-active.png', '/images/hook.png', '/images/hook.png', '/images/hook.png'],
    //退款金额
    money: 0,
    //退款说明
    description: '',
    //凭证
    certificate: []
  },

  back: function() {
    wx.navigateBack()
  },

  //货物状态
  statusClick: function() {
    this.changeData('statusStyle', 'display:none', 'display:block')
  },
  //退款原因
  reasonClick: function() {
    this.changeData('reasonStyle', 'display:none', 'display:block')
  },
  //关闭货物状态选项
  selectTopWrapper: function() {
    this.changeData('statusStyle', 'display:block', 'display:none')
  },
  //关闭退款原因选项
  reasonTopWrapper: function() {
    this.changeData('reasonStyle', 'display:block', 'display:none')
  },

  //货物状态
  goodStatus: function(e) {
    if (e.currentTarget.dataset.status === '0') {
      this.setData({
        goodStatus: 1,
        goodStatusImg: ['/images/hook-active.png', '/images/hook.png']
      })
    } else if (e.currentTarget.dataset.status === '1') {
      this.setData({
        goodStatus: 0,
        goodStatusImg: ['/images/hook.png', '/images/hook-active.png']
      })
    }
  },

  //退款原因
  reasonItem: function(e) {
    if (e.currentTarget.dataset.status === '0') {
      this.setData({
        reason: '多拍/拍错/不想要',
        reasonImg: ['/images/hook-active.png', '/images/hook.png', '/images/hook.png', '/images/hook.png']
      })
    } else if (e.currentTarget.dataset.status === '1') {
      this.setData({
        reason: '卖家发错货',
        reasonImg: ['/images/hook.png', '/images/hook-active.png', '/images/hook.png', '/images/hook.png']
      })
    } else if (e.currentTarget.dataset.status === '2') {
      this.setData({
        reason: '卖家发错货',
        reasonImg: ['/images/hook.png', '/images/hook.png', '/images/hook-active.png', '/images/hook.png']
      })
    } else if (e.currentTarget.dataset.status === '3') {
      this.setData({
        reason: '卖家发错货',
        reasonImg: ['/images/hook.png', '/images/hook.png', '/images/hook.png', '/images/hook-active.png']
      })
    }
  },

  //退款说明
  inputDescription: function(e) {
    this.setData({
      description: e.detail.value
    })
  },

  //改变data
  changeData: function(dataName, data, change) {
    if (this.data[dataName] === data) {
      this.setData({
        [dataName]: change
      })
    }
  },

  //打开大图
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.certificate // 需要预览的图片http链接列表
    })
  },

  //删除所选图片
  deleteImg: function (e) {
    let arr = []
    let _arr = this.data.certificate
    _arr.forEach((item, index) => {
      if (e.currentTarget.dataset.index !== index) {
        arr.push(_arr[index])
      }
    })
    this.setData({
      certificate: arr
    })
  },

  //从本地相册选择图片或使用相机拍照
  chooseImage: function() {
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.uploadFile(res.tempFilePaths['0'])
      }
    })
  },
  //上传图片
  uploadFile: function(data) {
    let _this = this
    wx.uploadFile({
      url: 'https://tlst.paycore.cc/index.php/WXAPI/UploadFiles/uploadRefundImg',
      filePath: data,
      formData: {
        'refundImg': data
      },
      name: 'refundImg',
      header: {
        "Content-Type": "multipart/form-data",
        "cookie": `${wx.getStorageSync("sessionName")}=${wx.getStorageSync("sessionId")}`
      },
      success: function(res) {
        let arr = _this.data.certificate
        arr.push(JSON.parse(res.data).url)
        _this.setData({
          certificate: arr
        })
      }
    })
  },

  //退款金额
  money: function(obj) {
    let money = 0
    let price = parseFloat(obj.price)
    let goods_num = parseInt(obj.goods_num)
    let total_discount_money = parseFloat(obj.total_discount_money)
    money = (price * goods_num - total_discount_money) * goods_num / goods_num
    return money
  },

  //批量退款时获取商品详情列
  getData: function(order_id) {
    let _this = this;
    server.getJSON('/OrderRefund/getBeRefundedGoodsList', {
        order_id
      },
      function(res) {
        if (res.statusCode === 200) {
          console.log(res.data)
          //筛选被选商品
          let arr = []
          let activeArr = _this.data.activeArr
          activeArr.forEach((item, index) => {
            if (item === "true") arr.push(res.data[index])
          })
          //计算退款金额
          let money = 0
          arr.forEach((item) => {
            money += _this.money(item)
          })
          _this.setData({
            goodsList: arr,
            money: money.toFixed(2)
          })
        }
      })
  },

  //提交
  submit: function() {
    let _this = this
    //iamges
    let img = ''
    this.data.certificate.forEach((item, index) => {
      if ((index + 1) === this.data.certificate.length) {
        img += '"' + item + '"'
      } else {
        img += '"' + item + '",'
      }
    })
    let images = '[' + img + ']'
    console.log(images)
    //goods_list
    let goods_list = {}
    let goodsList = this.data.goodsList
    goodsList.forEach((item) => {
      goods_list[item.goods_id] = item.goods_num
    })
    console.log(JSON.stringify(goods_list))
    server.newpostJSON('/OrderRefund/addRefund', {
        order_id: this.data.order_id,
        user_remark: this.data.description,
        refund_way: this.data.refund_way,
        is_receive_goods: this.data.goodStatus,
        reason: this.data.reason,
        iamges: images,
        goods_list: JSON.stringify(goods_list)
      },
      function(res) {
        console.log(res)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.activeArr.split(','))
    this.setData({
      activeArr: options.activeArr.split(','),
      order_id: options.order_id
    })
    this.getData(options.order_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})