const api = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    systemInfo:{},
    pageShow:false,
    auth_token:'',
    loginInfo:{},
    userId:'',
    usersTopics:[],
    erroCode:false,
    imageUrl: api.BaseURLID,
    checkes:false
  },
  onLoad: function (options) {
    let that = this
    app.getSystemInfo(function (res) {
      that.setData({
        systemInfo: res
      })
      wx.setStorageSync('systemInfo', that.data.systemInfo)
    })
    api.showLoading()
    if (!wx.getStorageSync('isbind')){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      var loginInfo = wx.getStorageSync('loginInfo')
      if (loginInfo === null || loginInfo === '') {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
        let id = loginInfo.user.id
        let token = 'Token token=' + loginInfo.user.authentication_token + ',phone=' + loginInfo.user.phone
        that.users(id,token)
        that.getUser(id,token)
        that.setData({
          erroCode: true,
          pageShow: true,
          userId: id
        })
        setTimeout(() => {
          api.hideToast()
        }, 800)
      }
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    var loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo == null || loginInfo === '') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    } else {
      let id = loginInfo.user.id
      let token = 'Token token=' + loginInfo.user.authentication_token + ',phone=' + loginInfo.user.phone
      this.users(id, token)
    }
  },
  onHide: function () {
    
  },
  onUnload() {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  },
  login(){
    wx.navigateTo({
      url: '/pages/main/login',
    })
  },
  users(id,token){
    let that = this
    wx.request({
      url: api.BaseURL + 'v1/users/'+id+'.json',
      header:{'Authorization':token},
      success:(res) =>{
        if(res.data.code === 1){
          that.setData({
            loginInfo: res.data.data.user,
          })
        }
      }
    })
  },
  getUser(id,token){
    let that = this
    wx.request({
      url: api.BaseURL + 'v1/users/' + id + '/topics.json',
      header:{
        'Authorization': token
      },
      success:function(res){
        that.setData({
          usersTopics:res.data.data.topics
        })
      }
    })
  },
  loginOut(){
    wx.clearStorage()
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          app.getUserInfo()
          wx.setStorageSync('isbind', true)
        }else{
          wx.setStorageSync('isbind', false)
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  },
  checkIn(e){
    let item = e.currentTarget.dataset.item
    this.setData({
      checkes: !(this.data.checkes)
    })
  }
})