var api = require("../../utils/util.js");
var app = getApp()
var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
var pswReg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{8,16}/;
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      getmsg: "获取验证码"
    })
    countdown = 60;
    that.setData({
      flag: false
    })
    return;
  } else {
    that.setData({
      getmsg: countdown + 's重新获取',
      flag: true
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}

Page({
  data:{
    getmsg: "获取验证码",
    userbind: {},
    phone: '',
    identify: '',
    password: '',
    openid: null,
    flag: false
  },
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          userbind: res.data
        })
      },
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  getusers: function (e) {
    let that = this
    let phone = e.detail.value
    if (!phoneReg.test(phone)) {
      api.alertView("提示", "请输入正确的手机号", function () {
      }, "true");
      return;
    }
    that.setData({
      phone: phone
    })
  },
  getpsw: function (e) {
    let psw = e.detail.value
    if (!pswReg.test(psw)) {
      api.alertView("提示", "密码格式为8~16位，不含特殊字符", function () {
      }, "true");
      return;
    }
  },
  formSubmit: function (e) {
    let that = this
    var phone = e.detail.value.phone;
    var identify = e.detail.value.identify;
    var password = e.detail.value.password;
    if (phone.length < 1) {
      api.alertView("提示", "请输入手机号", function () {
      }, "true");
      return;
    }
    if (identify.length < 1) {
      api.alertView("提示", "请输入验证码", function () {
      });
      return;
    }
    if (identify.length < 1) {
      api.alertView("提示", "请输入密码", function () {
      });
      return;
    }
    var user = { "user": { "phone": phone, "code": identify, "password": password } }
    var data = {}
    api.post(api.BaseURL + 'v1/users.json?user[phone]=' + phone + '&user[code]=' + identify + '&user[password]=' + password, data).then(res => {
      if (res.code === 1) {
        wx.setStorageSync('loginInfo', res.data)
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }, 500)
      } else {
        api.alertView("提示", res.msg, function () {
        });
      }
    })
  },
  //注册
  register:function(e){
    console.log("注册");
  },
  //忘记密码
  forgetpwd:function(){
    console.log("忘记密码");
  },
  getCode(e) {
    let that = this
    var phone = that.data.phone;
    if (phone.length < 1) {
      api.alertView("提示", "请输入手机号", function () {
      }, "true");
      return;
    }
    if (that.data.flag) { return; }
    var data = {
      phone: phone
    }
    api.post(api.BaseURL + 'v1/utilities/sendsms.json', data).then(res => {
      settime(that)
    })
  }
})