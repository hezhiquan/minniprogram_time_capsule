// 这里是写信的界面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaData: "",
    createTime: ""//这些数据是记录用户写信的时间以及信件的内容，textareaData是用户在textarea中写的信
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '信件编辑'
    })

  },
  //getTextareaData函数会获取textarea中的信件的内容
  getTextareaData: function (event) {
    this.setData({
      textareaData: event.detail.value
    })
  },
//点击右上角的信件按钮触发finish函数，即完成信件的编辑

  finished: function (event) {
    var that = this;
    console.log(that.data.textareaData);
    if (that.data.textareaData == "") {
      wx.showModal({
        title: '信件不能为空哦~',
        showCancel:false
      })//判断信件内容是否为空，如果为空则出现提示框
    } else {
      var mydate = new Date();
      var myyear = mydate.getFullYear();
      var myday = mydate.getDate();
      var mymonth = mydate.getMonth() + 1;
      var mycreateTime = myyear + '-' + mymonth + '-' + myday
      //这里是创建时间对象，然后将当前的时间表示为类似2020-5-20的形式
      console.log(mycreateTime);
      that.setData({
        createTime: mycreateTime//将createTime的值设定为今天的日期
      })
      console.log(that.data.createTime)
      // wx.showModal({
      //   title: '完成编辑！',
      //   showCancel: false,
      //   confirmText: '去发送~',
      //   success: function (res) {
          wx.redirectTo({
            url: '../capsule?finished=' + "true" + '&textareaData=' + that.data.textareaData + '&createTime=' + that.data.createTime,//点击返回，回到上一个界面，然后将finished的值true和textarea里面的文字，以及信件写作的时间createTime传递到上一个界面。
          })
      //   }
      // })


    }

  }
})