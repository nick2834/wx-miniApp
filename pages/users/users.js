const api = require('../../utils/util.js')
Page({
  data: {
    pageShow:false,
    auth_token:'',
    loginInfo:{},
    userId:'',
    usersTopics:[],
    erroCode:false,
    users:{},
    imageUrl: api.BaseURLID
  },
  onLoad: function (options) {
    let that = this
    api.showLoading()
    let id = options.id
    if (!wx.getStorageSync('isbind')) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      var isBind = wx.getStorageSync('loginInfo')
      if (isBind === null || isBind === '') {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
        let token = 'Token token=' + isBind.user.authentication_token + ',phone=' + isBind.user.phone
        that.getUser(id, token)
        that.setData({
          loginInfo: isBind.user,
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
  getUser(id,token){
    let that = this
    wx.request({
      url: api.BaseURL + 'v1/users/' + id + '/topics.json',
      header:{
        'Authorization': token
      },
      success:function(res){
        console.log(res.data.data.user.avatar.indexOf('http'))
        if (res.data.data.user.avatar.indexOf('http') >= 0){
          res.data.data.user['hasHttp'] = 'true'
        }else{
          res.data.data.user['hasHttp'] = 'false'
          res.data.data.user.avatar = that.data.imageUrl + res.data.data.user.avatar
        }
        that.setData({
          users:res.data.data.user,
          usersTopics:res.data.data.topics
        })
        wx.setNavigationBarTitle({
          title: res.data.data.user.nickname
        })
      }
    })
  }
})