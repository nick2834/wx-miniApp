const api = require('../../utils/util.js')
var app = getApp()
var loginInfo = wx.getStorageSync('loginInfo')
const tagBarBg = ['../../images/tagBar/1.jpg',
  '../../images/tagBar/2.jpg',
  '../../images/tagBar/3.jpg',
  '../../images/tagBar/4.jpg',
  '../../images/tagBar/5.jpg',
  '../../images/tagBar/6.jpg',
  '../../images/tagBar/7.jpg',]
Page({
  data: {
    systemInfo: {},
    hotTags:[],
    page:1,
    topicList:[],
    imageUrl: api.BaseURLID,
    isLast:false,
    total_pages:0,
    current_page:0,
    viewer_id:null
  },
  onLoad: function (options) {
    var that = this
    var loginInfo = wx.getStorageSync('loginInfo')
    app.getUserInfo(function(res){
      setTimeout(() =>{
        that.getTokenUserId(that)
      },500)
      that.refesh()
    })
    app.getSystemInfo(function (res) {
      that.setData({
        systemInfo: res
      })
      wx.setStorageSync('systemInfo', that.data.systemInfo)
    })
    this.refreshNewData()
  },
  refreshNewData(){
    let that = this
    api.showLoading()
    api.get(api.BaseURL + 'v1/topics.json?page=' + that.data.page).then(res => {
      res.data.hot_tags.map((res,index) =>{
        res['tagBarBg'] = tagBarBg[Math.floor(Math.random() * tagBarBg.length)]
      })
      res.data.topics.map(res =>{
        res['created_at'] = api.formatTime(res.created_at, 'Y/M/D h:m:s')
        if (res.author.avatar.indexOf('res/ugc') >= 0) {
          res.author.avatar = that.data.imageUrl + res.author.avatar
          res.author['hasAvatar'] = 'true'
        } else if (res.author.avatar.indexOf('default.png') >= 0) {
          res.author.avatar = that.data.imageUrl + res.author.avatar
          res.author['hasAvatar'] = 'default'
        } else {
          res.author['hasAvatar'] = 'false'
        }
      })
      that.setData({
        hotTags: res.data.hot_tags,
        topicList:res.data.topics,
        page:1,
        total_pages:res.data.paging.total_pages,
        current_page: 0
      })
      api.hideToast();
      wx.hideNavigationBarLoading()
    })
  },
  swichNav(e){
    wx.navigateTo({
      url: '/pages/tagdetail/tagdetail?id=' + e.currentTarget.dataset.idx,
    })
  },
  onReady: function () {},
  onShow: function () {
    this.refreshNewData()
  },
  loadMore: function (e) {
    let that = this
    if ((that.data.current_page === that.data.total_pages)){
      return
    }else{
      wx.showNavigationBarLoading()
      api.get(api.BaseURL + 'v1/topics.json?page=' + (++that.data.page)).then(res => {
        res.data.hot_tags.map((res, index) => {
          res['tagBarBg'] = tagBarBg[Math.floor(Math.random() * tagBarBg.length)]
        })
        res.data.topics.map(res => {
          res['created_at'] = api.formatTime(res.created_at, 'Y/M/D h:m:s')
          if (res.author.avatar.indexOf('res/ugc') >= 0) {
            res.author.avatar = that.data.imageUrl + res.author.avatar
            res.author['hasAvatar'] = 'true'
          } else if (res.author.avatar.indexOf('default.png') >= 0) {
            res.author.avatar = that.data.imageUrl + res.author.avatar
            res.author['hasAvatar'] = 'default'
          } else {
            res.author['hasAvatar'] = 'false'
          }
        })
        that.setData({
          topicList: that.data.topicList.concat(res.data.topics),
          total_pages: res.data.paging.total_pages,
          current_page: res.data.paging.current_page
        });
        wx.hideNavigationBarLoading()
      })
    }
  },
  refesh: function (e) {
    var that = this;
    wx.showNavigationBarLoading()
    that.refreshNewData()
  },
  backToUser(){
    var loginInfo = wx.getStorageSync('loginInfo')
    var isbind = wx.getStorageSync('isbind')
    if(loginInfo == null || loginInfo === '' && isbind){
      wx.navigateTo({
        url: '/pages/bindcode/bindcode',
      })
    } else if (!isbind){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      wx.navigateTo({
        url: '/pages/mine/mine',
      })
    }
  },
  getTokenUserId(that){
    var loginInfo = wx.getStorageSync('loginInfo')
    var user_id = null
    var token = null
    if (loginInfo == null || loginInfo === '') {
      user_id = '';
      token = ''
    } else {
      user_id = loginInfo.user.id
      token = 'Token token=' + loginInfo.user.authentication_token + ',phone=' + loginInfo.user.phone
    }
    that.setData({
      viewer_id: user_id
    })
  },
  onShareAppMessage: function () {
    return {
      title: '老司机正义联盟',
      desc: '老司机正义联盟!',
      path: '/page/index'
    }
  }
})