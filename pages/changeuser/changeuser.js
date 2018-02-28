const api = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    loginInfo: null,
    user_id: null,
    token:null,
    userInfo:{},
    imageUrl: api.BaseURLID,
  },
  onLoad: function (options) {
    let that = this
    let id = options.id
    var loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo == null || loginInfo === '') {
      that.setData({
        loginInfo: null,
        user_id: '',
        token: ''
      })
    } else {
      that.setData({
        loginInfo: loginInfo,
        user_id: loginInfo.user.id,
        token: 'Token token=' + loginInfo.user.authentication_token + ',phone=' + loginInfo.user.phone
      })
    }
    wx.request({
      url: api.BaseURL + 'v1/users/' + id + '.json',
      method:'get',
      header: { 'Authorization': that.data.token },
      success:(res) =>{
        that.setData({
          userInfo:res.data.data.user,
        })
      }
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  },
  formSubmit: function (e) {
    let that = this
    api.showLoading()
    let nickname = e.detail.value.nickname
    let desc = e.detail.value.desc
    wx.request({
      url: api.BaseURL + 'v1/users/' + that.data.user_id + '.json?user[nickname]=' + nickname +'&user[introduction]='+desc,
      method:'PATCH',
      header: { 'Authorization': that.data.token },
      success:(res) =>{
        if(res.data.code === 1){
          that.setData({
            userInfo: res.data.data.user
          })
          setTimeout(() => {
            api.hideToast()
          }, 1000)
        }
      }
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})