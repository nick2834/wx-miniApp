const api = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    hot_topics:[],
    topics:[],
    tag:'',
    page:1,
    id:'',
    imageUrl: api.BaseURLID,
    total_pages: 0,
    current_page: 0
  },
  onLoad: function (options) {
    let that = this
    app.getSystemInfo(function (res) {
      that.setData({
        systemInfo: res
      })
      wx.setStorage({
        key: 'systemInfo',
        data: that.data.systemInfo,
      })
    })
    let id = options.id
    that.setData({
      id: options.id
    })
    that.dataRefresh(id)
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
  dataRefresh(id){
    let that = this
    api.showLoading()
    api.get(api.BaseURL + 'v1/tags/' + id + '.json').then(res =>{
      that.setData({
        hot_topics: res.data.hot_topics,
        topics: res.data.topics,
        tag: res.data.tag,
        page:1,
        total_pages: res.data.paging.total_pages,
        current_page: res.data.paging.current_page
      })
      wx.setNavigationBarTitle({
        title: res.data.tag.name
      })  
      setTimeout(() =>{
        api.hideToast()
      },1000)
    })
  },
  loadMore(e){
    let that = this
    if (that.data.current_page === that.data.total_pages) {
      return
    }
    wx.showNavigationBarLoading()
    api.get(api.BaseURL + 'v1/tags/' + (that.data.id) + '.json?page=' + (++that.data.page)).then(res => {
      that.setData({
        hot_topics: res.data.hot_topics,
        tag: res.data.tag,
        topics: that.data.topics.concat(res.data.topics),
        total_pages: res.data.paging.total_pages,
        current_page: res.data.paging.current_page
      })
      wx.hideNavigationBarLoading()
    })
  },
  refesh(e){
    let that = this
    that.dataRefresh(that.data.id)
  }
})