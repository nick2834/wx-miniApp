'use strict';
const Promise = require('es6-promise.min'); 
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
} 
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//成功提示
function showSuccess(title = "成功啦", duration = 2500){
  wx.showToast({
      title: title ,
      icon: 'success',
      duration:(duration <= 0) ? 2500 : duration
  });
}
//loading提示
function showLoading(title = "请稍后", duration = 5000) {
  wx.showToast({
      title: title ,
      icon: 'loading',
      duration:(duration <= 0) ? 5000 : duration
  });
}
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}
//隐藏提示框
function hideToast(){
  wx.hideToast();
}
//显示带取消按钮的消息提示框
function alertViewWithCancel(title="提示",content="消息提示",confirm,showCancel="true"){
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    success: function(res) {
      if (res.confirm) {
        confirm();
      }
    }
  });
}
//不显示取消按钮的消息提示框
function alertView(title="提示",content="消息提示",confirm){
  alertViewWithCancel(title,content,confirm,false);
}
module.exports = {
  BaseURL: "域名地址",
  BaseURLID: "图片地址",
  get(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res.data)
        }
      })
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencode;charset=UTF-8;'
        },
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res.data)
        }
      })
    })
  },
  formatTime: formatTime,
  showSuccess: showSuccess,
  showLoading: showLoading,
  hideToast: hideToast,
  alertViewWithCancel: alertViewWithCancel,
  alertView: alertView,
  buttonClicked: buttonClicked
}
