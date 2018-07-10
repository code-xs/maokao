//index.js
//获取应用实例
const app = getApp()
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/wafer2-client-sdk/index');

// 引入配置
var config = require('../../config');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userInfo1: {
      avatarUrl:"http://static3-cdn.scloud.lfengmobile.com/800000026-mokao/education.png",
      nickName:"知识人"
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical:0,
    level:0,
    ranking:0,
    progress:50,
    Height:150,
    empiricalV:0,
    levelV:0,
    windowW:0,
    windowH:0,
    challenge:-1,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况    
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      console.log(' hasUserInfo:' + this.data.hasUserInfo);  
      this.setData({
        userInfo: this.data.userInfo1,
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      console.log(' userInfo:' + this.data.userInfo1);
      if (!this.data.hasUserInfo){
        this.setData({
          userInfo: this.data.userInfo1,
        })
      }
    }
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          screenWidth: res.windowWidth,
        })
      }
    });
    this.initData();
  },

  getUserInfo: function(e) {
    console.log(' getUserInfo')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  initData:function(){
    var _empirical = wx.getStorageSync('empirical');
    if (_empirical == null || _empirical < 0)
      _empirical = 0;
    var _level = wx.getStorageSync('level');
    if(_level == null || _level < 0)
      _level = 0;
    var _ranking = wx.getStorageSync('ranking');
    if (_ranking == null || _ranking < 0)
      _ranking = 0;
    console.log(' _empirical:' + _empirical + ',_level: ' + _level + ', _ranking:' + _ranking)
    this.setData({
      empirical: 0,
      level: 0,
      ranking: 0,
      empiricalV: this.data.empirical,
      levelV:this.data.level+"级",
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bf70d6',
    });
  },

  drawRuleText: function (ctx, x, y, cnt) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.setFontSize(20);
    ctx.setFillStyle('#e853b8');
    ctx.setTextAlign('center');
    ctx.fillText(cnt, x, y);
  },
  
  drawCirque: function (ctx, x, y) {
    ctx.beginPath();
    ctx.setStrokeStyle('#eec700');
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.stroke()
  },
  drawCircle: function (ctx, x, y) {
    ctx.beginPath();
    ctx.setFillStyle('#eec700');
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill()
  },
  onClickSelf:function(){
    wx.navigateTo({
      url: '../select/select' + '?lockLevel=' + (5) + '&maxLevel=' + 5
    })
  },
  onClickFriend: function () {
    wx.navigateTo({
      url: '../invitation/invitation'
    })
  },
  onClickMain:function(){
    wx.navigateTo({
      url: '../main/main'
    })
  },
  onClickRanking: function () {
    wx.navigateTo({
      url: '../ranking/ranking'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from == 'button') {
      return {
        title: '[有人@我]免费全面的考题等你挑战',
        path: 'pages/home/home',
        success: function (res) {
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    } else {
      return {
        title: '[有人@我]免费全面的考题等你挑战',
        path: 'pages/home/home',
        success: function (res) {
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },
  getUserInfoFun: function (e) {
    var S = this;
    console.log("home page onClick id:" + e.target.id);
    if (app.globalData.userInfo == null){
      wx.getUserInfo({
        success: function (res) {
          console.log("home page get userInfo:" + res)
          app.setUserInfo(res);
          S.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          S.onClickButton(e.target.id);
        },
        fail: function (res) {
          console.log("home page get userInfo failed!!!")
          //do anything
        },
      })
    }else{
      this.onClickButton(e.target.id);
    }
  },

  onClickButton:function(id){
    if(id==0){
      this.onClickMain();
    }else if(id==1){
      this.onClickSelf();
    }else if(id == 2) {
      this.onClickFriend();
    }else if(id == 3) {
      this.onClickRanking();
    }
  },
  onShow: function (options) {
    //this.getUserInfoFun()
  },
})
