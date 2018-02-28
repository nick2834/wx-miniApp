//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
const api = require('utils/util.js')
function loginInfo(data) {
  api.get(api.BaseURL + 'v1/utilities/weixintoken.json?code=' + data).then(res => {
    wx.setStorageSync('openId', res.data.open_id)
    var data = { open_id: res.data.open_id, source: 'wechat' }
    api.post(api.BaseURL + 'v1/sessions/thirdparty.json', data).then(res => {
      wx.setStorageSync('loginInfo', res.data)
      wx.setStorageSync('isbind', true)
    })
  })
}
App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getOpenId:function(cb){
    var that = this
    if (this.globalData.openId) {
      typeof cb == "function" && cb(this.globalData.openId)
    } else {
      wx.login({
        success: function (res) {
          let _this = res
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              if (_this.code) {
                api.get(api.BaseURL+'v1/utilities/weixintoken.json?code=' + (_this.code)).then(res =>{
                  wx.setStorageSync('openId', res.data.open_id)
                })
              }
              that.globalData.openId = res.openId
              typeof cb == "function" && cb(that.globalData.openId)
            }
          })
        }
      })
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: function (res) {
          let _this = res
          wx.getUserInfo({
            success: function (res) {
              if (_this.code) {
                let data = _this.code
                loginInfo(data)
              }
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            },fail:(res) =>{
              wx.setStorageSync('isbind', false)
            }
          })
        }
      })
    }
  },
  getSystemInfo: function (cb) {
    var that = this
    if (that.globalData.systemInfo) {
      typeof cb == "function" && cb(that.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    systemInfo:null,
    openId:null
  }
})