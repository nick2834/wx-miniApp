const api = require('../../utils/util.js')
Page({
  data: {
    detailList: {},
    comments: [],
    hot_comments: [],
    page: 1,
    imageUrl: api.BaseURLID,
    windowWidth: 0,
    windowHeight: 0,
    show: false,
    sendMessage: '',
    thumbs: false,
    ImageLinkArray:[],
    topicID: null,
    userReply: '',
    replyId: null,
    focus: false,
    placeholder: '说点什么吧...!',
    loginInfo: null,
    user_id: '',
    token: ''
  },
  onLoad: function (options) {
    let that = this
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
    that.getDetails(options)
    wx.getStorage({
      key: 'systemInfo',
      success: function (res) {
        that.setData({
          windowWidth: res.data.windowWidth,
          windowHeight: res.data.windowHeight,
          topicID: options
        })
      },
    })
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  getDetails(options) {
    let that = this
    api.showLoading()
    api.get(api.BaseURL + 'v1/topics/' + options.id + '.json?viewer_id=' + options.viewer_id).then(res => {
      res.data.topics.created_at = api.formatTime(res.data.topics.created_at, 'Y/M/D h:m:s')
      
      let author = res.data.topics.author
      if (author['avatar'].indexOf('res/ugc') >=0){
        author.avatar = that.data.imageUrl + author.avatar
        author['hasAvatar'] = 'true'
      } else if (author['avatar'].indexOf('default.png') >= 0){
        author.avatar = that.data.imageUrl + author.avatar
        author['hasAvatar'] = 'default'
      }else{
        author['hasAvatar'] = 'false'
      }
      that.setData({
        detailList: res.data.topics,
        comments: res.data.comments,
        hot_comments: res.data.hot_comments,
        show: true
      })
      res.data.topics.image_urls.map(res =>{
        that.data.ImageLinkArray.push(that.data.imageUrl + res)
      })
      wx.setNavigationBarTitle({
        title: res.data.topics.title
      })
      setTimeout(function () {
        api.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    })
  },
  getReply(e) {
    this.setData({
      placeholder: '@' + e.currentTarget.dataset.name,
      replyId: e.currentTarget.dataset.id,
      focus: true
    })
  },
  bindinput(e) { },
  bindblur(e) {
    this.setData({
      placeholder: '说点什么吧...!',
      focus: false
    })
  },
  bindfocus(e) { },
  formSubmitReply(e) { //@别人
    let that = this
    that.setData({
      sendMessage: e.detail.value
    })
    var data = {
      content: that.data.sendMessage,
      author_id: that.data.user_id,
      topic_id: that.data.topicID.id,
      comment_type: 'text'
    }
    if (that.data.sendMessage === '') {
      return
    }
    wx.request({
      url: api.BaseURL + 'v1/comments/' + that.data.replyId + '/reply.json',
      method: 'post',
      data: data,
      header: { 'Authorization': that.data.token },
      success: (res) => {
        if (res.data.code == 1) {
          let commentlist = res.data.data.comment
          commentlist['viewer_liked'] = 'false'
          commentlist['created_at'] = api.formatTime(commentlist.created_at, 'M/D h:m')
          if (commentlist.author.avatar.indexOf('res/ugc') >= 0) {
            commentlist.author.avatar = that.data.imageUrl + commentlist.author.avatar
            commentlist.author['hasAvatar'] = 'true'
          } else if (commentlist.author.avatar.indexOf('default.png') >= 0) {
            commentlist.author.avatar = that.data.imageUrl + commentlist.author.avatar
            commentlist.author['hasAvatar'] = 'default'
          } else {
            commentlist.author['hasAvatar'] = 'false'
          }
          that.data.comments.push(commentlist)
          that.setData({
            comments: that.data.comments,
            sendMessage: '',
            placeholder: '说点什么吧...!',
            focus: false
          })
        }
      }
    })
  },
  formSubmit(e) { //普通回复
    let that = this
    that.setData({
      sendMessage: e.detail.value
    })
    var data = {
      content: that.data.sendMessage,
      author_id: that.data.user_id,
      topic_id: that.data.topicID.id,
      comment_type: 'text'
    }
    if (that.data.sendMessage === '') {
      return
    }
    wx.request({
      url: api.BaseURL + 'v1/comments.json',
      method: 'post',
      data: data,
      header: { 'Authorization': that.data.token },
      success: (res) => {
        if (res.data.code == 1) {
          let commentlist = res.data.data.comment
          commentlist['viewer_liked'] = 'false'
          commentlist['created_at'] = api.formatTime(commentlist.created_at, 'M/D h:m')
          if (commentlist.author.avatar.indexOf('res/ugc') >= 0) {
            commentlist.author.avatar = that.data.imageUrl + commentlist.author.avatar
            commentlist.author['hasAvatar'] = 'true'
          } else if (commentlist.author.avatar.indexOf('default.png') >= 0) {
            commentlist.author.avatar = that.data.imageUrl + commentlist.author.avatar
            commentlist.author['hasAvatar'] = 'default'
          } else {
            commentlist.author['hasAvatar'] = 'false'
          }
          that.data.comments.push(commentlist)
          that.setData({
            comments: that.data.comments,
            sendMessage: '',
            placeholder: '说点什么吧...!',
            focus: false
          })
        }
      }
    })
  },
  bindThumb(e) {
    let that = this
    let id = that.data.topicID.id
    wx.request({
      url: api.BaseURL + 'v1/topics/' + id + '/like.json',
      method: 'POST',
      data: { user_id: that.data.user_id },
      header: { 'Authorization': that.data.token },
      success: (res) => {
        if (res.data.msg === '已点赞') {
          return
        } else {
          that.data.detailList['viewer_liked'] = 'true'
          that.data.detailList['likes'] = res.data.data.likes
          that.setData({
            detailList: that.data.detailList
          })
        }
      }
    })
  },
  clickImage(e) {
    let that = this
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: that.data.ImageLinkArray,//内部的地址为绝对路径
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.info("点击图片了");
      },
    })
  },
  gototags(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/tagdetail/tagdetail?id=' + id
    })
  }
})