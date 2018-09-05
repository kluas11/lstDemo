// component/mymodal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalshow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnTap(){
      // console.log(this.data)
      this.triggerEvent('hindeEvent', { modalshow:false})
    }
  }
})
