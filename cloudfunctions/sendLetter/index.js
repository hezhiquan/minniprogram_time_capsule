// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "my-env-2nz10",
  traceUser: true,
})
const db = cloud.database()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //
  port: 465, //qq邮箱端口 
  auth: {
    user: '2047706542@qq.com', //邮箱账号
    pass: 'fnrjffkhorrvcebg' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  var date1 = new Date()
  var mon = date1.getMonth() + 1;
  var day = date1.getDate();
  var nowdate;
  if (day < 10) {
    day = '0' + day
  }
  if (mon < 10) {
    mon = '0' + mon
  }
  nowdate = date1.getFullYear() + '-' + mon + '-' + day
  console.log(nowdate)
 //注意，要用const，不能用let或var，否则会报错
  const  result= await db.collection("capsules").where({
      recordedTime: nowdate,
      received: false
    }).get()
  console.log("result is",result);


  let data=result.data;
  for (let i = 0; i < data.length; i++) {
    console.log("执行次数",i)
    var mail = {
      // 发件人
      from: '时光胶囊<2047706542@qq.com>',
      // 主题
      subject: '您的时光胶囊开启了',
      // 收件人
      to: data[i].email,
      // 邮件内容，text或者html格式
      text: data[i].recordedText //可以是链接，也可以是验证码
    }
    let res =await transporter.sendMail(mail);
    console.log('OK' + res.response)
  }
  console.log("777")
  const update=await db.collection("capsules").where({
    recordedTime: nowdate,
    received: false
  }).update({
    data:{
      received: true
    },
    success: function(res) {
      console.log("update success ",res.data)
    }
  })
  return "send sucess ";


}