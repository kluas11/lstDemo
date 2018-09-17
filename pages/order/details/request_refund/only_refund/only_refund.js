// pages/member/refund/request_refund/only_refund/only_refund.js
let server = require('../../../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusStyle: false,
    reasonStyle: false,
    deleteImgTips: false,
    deleteImgIndex: 0,
    obj: {},
    order_id: '',
    refund_way: '仅退款',
    //退货数量，默认是1
    refundNum: 1,
    //货物状态
    goodStatus: 1,
    goodStatusImg: ['/images/hook-active.png', '/images/hook.png'],
    goodStatusList: [true, false],
    //退款原因
    reason: '多拍/拍错/不想要',
    reasonImg: ['/images/hook-active.png', '/images/hook.png'],
    reasonList: [true, false, false, false],
    //退款金额
    money: 0,
    //退款说明
    description: '',
    //凭证
    certificate: []
  },

  //货物状态
  statusClick: function() {
    this.setData({
      statusStyle: true
    })
  },
  //退款原因
  reasonClick: function() {
    this.setData({
      reasonStyle: true
    })
  },
  //关闭货物状态选项
  selectTopWrapper: function() {
    this.setData({
      statusStyle: false
    })
  },
  //关闭退款原因选项
  reasonTopWrapper: function() {
    this.setData({
      reasonStyle: false
    })
  },

  //退货数量 减
  subtract: function() {
    let refundNum = this.data.refundNum
    if (refundNum > 1) refundNum--
      this.setData({
        refundNum: refundNum
      })
    this.money(this.data.obj, refundNum)
  },
  //退货数量 加
  add: function() {
    let refundNum = this.data.refundNum
    if (refundNum < parseInt(this.data.obj.goods_num)) refundNum++
      this.setData({
        refundNum: refundNum
      })
    this.money(this.data.obj, refundNum)
  },

  //输入退款商品数量
  inputClick: function(e) {
    if (parseInt(e.detail.value) < 1 || !parseInt(e.detail.value)) {
      this.setData({
        refundNum: 1
      })
      this.money(this.data.obj, 1)
    } else if (parseInt(e.detail.value) > parseInt(this.data.obj.goods_num)) {
      this.setData({
        refundNum: parseInt(this.data.obj.goods_num)
      })
      this.money(this.data.obj, parseInt(this.data.obj.goods_num))
    } else {
      this.money(this.data.obj, parseInt(e.detail.value))
    }
  },

  //货物状态
  goodStatus: function(e) {
    let arr = []
    let _arr = this.data.goodStatusList
    _arr.forEach((item, index) => {
      arr[index] = false
    })
    arr[parseInt(e.currentTarget.dataset.index)] = true
    this.setData({
      goodStatus: parseInt(e.currentTarget.dataset.status),
      goodStatusList: arr
    })
  },

  //退款原因
  reasonItem: function(e) {
    let arr = []
    let _arr = this.data.reasonList
    _arr.forEach((item, index) => {
      arr[index] = false
    })
    arr[parseInt(e.currentTarget.dataset.status)] = true
    let reason = ''
    if (parseInt(e.currentTarget.dataset.status) === 0) {
      reason = '多拍/拍错/不想要'
    } else if (parseInt(e.currentTarget.dataset.status) === 1) {
      reason = '卖家发错货'
    } else if (parseInt(e.currentTarget.dataset.status) === 2) {
      reason = '生产日期/保质期描叙不符'
    } else if (parseInt(e.currentTarget.dataset.status) === 3) {
      reason = '其他'
    }
    this.setData({
      reason: reason,
      reasonList: arr
    })
  },
  //退款说明
  inputDescription: function(e) {
    this.setData({
      description: e.detail.value
    })
  },

  //打开大图
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.certificate // 需要预览的图片http链接列表
    })
  },

  //删除所选图片
  deleteImg: function(e) {
    this.setData({
      deleteImgTips: true,
      deleteImgIndex: e.currentTarget.dataset.index
    })
  },
  //确认删除所选图片
  deleteDetermine: function() {
    let arr = []
    let _arr = this.data.certificate
    _arr.forEach((item, index) => {
      if (this.data.deleteImgIndex !== index) {
        arr.push(_arr[index])
      }
    })
    this.setData({
      deleteImgTips: false,
      certificate: arr
    })
  },
  //取消删除所选图片
  deleteCancel: function() {
    this.setData({
      deleteImgTips: false
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
      url: server.getHttp('/UploadFiles/uploadRefundImg'),
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
  money: function(obj, refundNum) {
    let money = 0
    let price = parseFloat(obj.price)
    let goods_num = parseInt(obj.goods_num)
    let total_discount_money = parseFloat(obj.total_discount_money)
    money = (price * goods_num - total_discount_money) * refundNum / goods_num
    this.setData({
      money: money.toFixed(2)
    })
  },

  //提交
  submit: function() {
    let _this = this
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
    server.newpostJSON('/OrderRefund/addRefund', {
        order_id: this.data.order_id,
        user_remark: this.data.description,
        refund_way: this.data.refund_way,
        is_receive_goods: this.data.goodStatus,
        reason: this.data.reason,
        iamges: images,
        goods_list: JSON.stringify({
          [this.data.obj.id]: this.data.refundNum
        })
      },
      function(res) {
        console.log(res)
        //提交成功
        if (res.data.status) {
          wx.redirectTo({
            url: '/pages/member/refund/details/details?refund_id=' + res.data.refund_id,
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.parse(options.obj))
    this.money(JSON.parse(options.obj), this.data.refundNum)
    this.setData({
      order_id: options.order_id,
      obj: JSON.parse(options.obj),
    })
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

  }
})