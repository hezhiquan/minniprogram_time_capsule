// miniprogram/pages/time_capsule/capsule.js
const app = getApp()
const db = wx.cloud.database()
const info = db.collection('capsules')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    backgroundSrc: "https://s1.ax1x.com/2020/04/23/JwH3a6.th.jpg",
    finishWriting: false,//初始时，设定
    finishSendding: false,//以下的几个
    finishemail: false,//值都为false。。。。。。
    finishSetTime: false,//当分别完成写信，完成发送，写好收件邮箱，设定好收信时间后，上面的值才会变成true
    createTime: "",//以下是需要写入数据库的数据，包括写信的时间，信件的内容，收信日期，和收信邮箱
    date:"",//
    textRecorded: "",//
    email: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ finishWriting: options.finished }),//这几个值都是writing页面传过来的
      this.setData({ textRecorded: options.textareaData }),//如果已经在writing界面完成了信件的书写。
      this.setData({ createTime: options.createTime }),//则在初始化界面时，将这几个值都设定为ture
      console.log(this.data.finishWriting),
      console.log(this.data.textRecorded);
    console.log(this.data.createTime),
    wx.setNavigationBarTitle({
      title: '时间胶囊' 
    })
    // 手动开启发信
    // wx.cloud.callFunction({
    //   name : 'sendLetter',
    //   data : {}
    // }).then((res)=>{
    //   console.log(res)
    // })
    // .catch((err)=>{
    //   console.log(err)
    // })

  },

  // 函数getEmail获取input内输入的值
  getEmail: function (event) {
    //  this.setData({email:event.detail.value})
    let email = event.detail.value
    let checkedNum = this.checkEmail(email)//这里判断Email格式输入是否正确，如果正确则checkedNum的值为true
    console.log(this.data.email)
    if(checkedNum == true)
    {
      this.setData({email:event.detail.value})
      this.setData({ finishemail:true})
    }//如果邮箱输入正确，则将data中的finishemail变为ture，只有当finishemail和finishSetTime都为true时后面点击发信的时候才能将数据写入数据库
  },
  //这里判断输入的邮箱格式是否正确
  checkEmail: function (email) {

    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true
    } else {
      wx.showToast({
        title: '邮箱格式错误！',
       image: '../../images/timeCapsule/错误.png'
      })
      return false
    }
  },

  bindDateChange: function (event)
  //设定好收到信的时间后，将 finishSendding和finishSetTime都变为true，这里修改的时候好像finishSendding已经没用了，不过我懒得改了。。。
  {
    this.setData({
      date: event.detail.value,
      finishSendding: true,
      finishSetTime:true
    })
    console.log(this.data.finishWriting)
    console.log(this.data.date)
  },
  settingAndSend: function (event)//寄信按钮的事件响应函数
  {
//只有当finishemail和finishSetTime都为true时后面点击发信的时候才能将数据写入数据库
    if (this.data.finishSetTime&&this.data.finishemail) {
      info.add
        ({
          data:
          {
            recordedText: this.data.textRecorded,//用户记录的文本
            recordedTime: this.data.date,//用户收到信的时间
            createTime: this.data.createTime,//用户写信的时间
            email: this.data.email,//用户的收信邮箱
            received: false
          }
        })//以上是将数据写入数据库
        .then(res => {
         
            wx.showToast({
              title: '您的信已寄出',
            })
          this.setData({
                finishSetTime: false,
                finishWriting: false,
                finishSendding: false,
                finishemail:false
              })//将数据写入数据库后，相当于用户已经把信寄出去了，这时候重置以上的几个值为fasle

        })
        .catch(err => {
          wx.showModal({
            title: '数据保存失败',
            showCancel:false
          })
          console.log('数据保存失败')
        })
    }
    else {
      wx.showModal({
        title: "请输入完整信息",
        showCancel:false
      })
    }//如果finishemail和finishSetTime有一个不是true，说明用户的邮箱和收信时间至少有一项没有写好，这时候要提示用户输入完整信息
  }

})