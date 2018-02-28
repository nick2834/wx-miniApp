const api = require('../../utils/util.js')
Page({
  data: {
    detailList: {},
    comments: [],
    hot_comments:[],
    page:1,
    imageUrl: api.BaseURLID,
    windowWidth: 0,
    windowHeight:0,
    show:false,
    sendMessage:'',
    thumbs:false,
    topicID:null,
    userReply:'',
    replyId:null,
    focus:false,
    placeholder:'说点什么吧...!',
    loginInfo:null,
    user_id:'',
    token:'',
    bindStatus:[],
    author:{}
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
      success: function(res) {
        that.setData({
          windowWidth: res.data.windowWidth,
          windowHeight: res.data.windowHeight,
          topicID:options
        })
      },
    })
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  getDetails(options){
    let that = this
    api.showLoading()
    api.get(api.BaseURL + 'v1/topics/' + options.id + '.json?viewer_id=' + options.viewer_id).then(res =>{
      let author = res.data.topics.author
      if (author.avatar.indexOf('res/ugc') >= 0) {
        author.avatar = that.data.imageUrl + author.avatar
        author['hasAvatar'] = 'true'
      } else if (author.avatar.indexOf('default.png') >= 0) {
        author.avatar = that.data.imageUrl + author.avatar
        author['hasAvatar'] = 'default'
      } else {
        author['hasAvatar'] = 'false'
      }
      res.data.comments.map(res =>{
        res.created_at = api.formatTime(res.created_at, 'M/D h:m')
        if (res.author.avatar.indexOf('res/ugc') >= 0) {
          res.author.avatar = that.data.imageUrl + res.author.avatar
          res.author['hasAvatar'] = 'true'
        } else if (res.author.avatar.indexOf('default.png') >= 0){
          res.author.avatar = that.data.imageUrl + res.author.avatar
          res.author['hasAvatar'] = 'default'
        }else{
          res.author['hasAvatar'] = 'false'
        }
      })
      res.data.topics.created_at = api.formatTime(res.data.topics.created_at, 'Y/M/D h:m:s')
      that.setData({
        detailList:res.data.topics,
        author: res.data.topics.author,
        comments: res.data.comments,
        hot_comments: res.data.hot_comments,
        show:true
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
  getReply(e){
    this.setData({
      placeholder: '@' + e.currentTarget.dataset.name,
      replyId: e.currentTarget.dataset.id,
      focus:true
    })
  },
  bindinput(e){},
  bindblur(e){
    this.setData({
      placeholder: '说点什么吧...!',
      focus: false
    })
  },
  bindfocus(e){},
  formSubmitReply(e){ //@别人
    if (wx.getStorageSync('loginInfo') === '') {
      wx.showModal({
        title: '提示',
        content: '您还未登录哦!',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
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
    }
  },
  formSubmit(e){ //普通回复
    if (wx.getStorageSync('loginInfo') === ''){
      wx.showModal({
        title: '提示',
        content: '您还未登录哦!',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
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
      if (that.data.sendMessage === ''){
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
    }
  },
  bindThumb(e){  //点赞
    let that = this
    let id = that.data.topicID.id
    wx.request({
      url: api.BaseURL + 'v1/topics/' + id + '/like.json',
      method:'POST',
      data: { user_id: that.data.user_id},
      header: { 'Authorization': that.data.token},
      success:(res) =>{
        if(res.data.msg === '已点赞'){
          return
        }else{
          that.data.detailList['viewer_liked'] = 'true'
          that.data.detailList['likes'] = res.data.data.likes
          that.setData({
            detailList: that.data.detailList
          })
        }
      }
    })
  },
  binduserThumb(e){ //评论点赞
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.key
    wx.request({
      url: api.BaseURL + 'v1/topics/' + id + '/like.json',
      method: 'POST',
      data: { user_id: that.data.user_id },
      header: { 'Authorization': that.data.token },
      success: (res) => {
        if (res.data.msg === '已点赞') {
          return
        } else {
          that.data.comments.map((item,index) => {
            if (item.id === e.currentTarget.dataset.id) {
              console.log(index)
              item['likes'] = res.data.data.likes
              item['viewer_liked'] = 'true'
            }
          })
        }
      }
    })
  },
  gototags(e){ //跳标签页
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/tagdetail/tagdetail?id='+id
    })
  }
})