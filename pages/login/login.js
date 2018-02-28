
var api = require("../../utils/util.js");
var app = getApp();
Page({
  data:{
    getmsg: "获取验证码", 
  },
  onLoad:function(options){
    console.log(getCurrentPages())
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },

  formSubmit:function(e){
    var phone = e.detail.value.phone;
    var password = e.detail.value.password;
    if (phone.length < 1) {
      api.alertViewWithCancel("提示","请输入用户名",function(){
      },"true");
      return;
    }

    if (password.length < 1) {
      api.alertView("提示","请输入密码",function(){
      });
      return;
    }
    wx.request({
      url: api.BaseURL + 'v1/sessions.json?user[phone]=' + phone + '&user[password]=' + password,
      method:'post',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        let auth_token = res.data.data.user.authentication_token
        wx.setStorage({
          key: 'loginInfo',
          data: res.data.data.user,
        })
        api.showLoading()
        setTimeout(() => {
          wx.navigateBack({
            delta:0
          })
        }, 500)
      },
      fail: function (res) {
        console.log(res.data.token)
      }
    })
  },
  onUnload(){
    // wx.redirectTo({
    //   url: '/pages/index/index',
    // })
  },
  //注册
  register:function(e){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  //忘记密码
  forgetpwd:function(){
    console.log("忘记密码");
  },
  gotowechat(){
    if (wx.getStorageSync('isbind')){
      wx.getStorage({
        key: 'loginInfo',
        success: function (res) {
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        }, fail: function (err) {
          wx.navigateTo({
            url: '/pages/bindcode/bindcode',
          })
        }
      })
    }else{
      api.alertViewWithCancel("提示", "您需要授权本小程序获取您的个人信息！！！", function () {
        wx.openSetting({
          success: (res) => {
            if (res.authSetting["scope.userInfo"]) {
              wx.setStorageSync('isbind', true)
              app.getUserInfo()
              wx.navigateTo({
                url:'/pages/index/index'
              })
            }
          }
        })
      }, "true");
    }
  }
})