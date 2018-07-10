//app.js

var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //*
    qcloud.setLoginUrl(config.service.loginUrl);
    //*/
    //qcloud.setLoginUrl(config.service.loginUrl);
    //this.doLogin();
    //this.requestQuestionList(0, 10);
    this.getUserInfo();
    this.getCategory();
  },
  doLogin() { //登录
    let that = this
    //util.showBusy('正在登录');
    qcloud.login({
      success(result) {//此处的result竟然不包含openid,所以res取缓存中的数据
        console.log('登录成功-----')
        let res = wx.getStorageSync('user_info_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A');
        console.log('res:'+res)
      },
      fail(error) {
        console.log('登录失败', error);
      }
    });
  },

  globalData: {
    userInfo: null,
    categoryTree:[]
  },
  setUserInfo: function (res) {
    this.globalData.userInfo = res.userInfo;
  },

  getUserInfo:function(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getCategory: function () {
    var that = this;
    qcloud.request({
      url: config.service.requestUrl,
      login:false,
      header: {
        'Content-Type': 'application/json'
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          that.globalData.categoryTree = JSON.stringify(response.data.data);
          that.globalData.categoryTree = JSON.parse(that.globalData.categoryTree);
        }
        console.log(that.globalData.categoryTree);
      },
      fail: function (err) {
        console.log('请求失败', err);
      }
    });
  },
  
  requestQuestionList: function (page, id) {
    var that = this;
    console.log('enter  requestQuestionList');
    qcloud.request({
      url: config.service.requestQuestionList,
      header: {
        'content-type': 'application/json'
      },
      data: {//这里写你要请求的参数
        category_id: 10,
        page_index: 0
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        console.log(response.data.data);
      },
      fail: function (err) {
        console.log('请求失败23', err);
      }
    });
  },
})