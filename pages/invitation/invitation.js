//index.js
//获取应用实例
const app = getApp()
var tunnel = require('../../tunnel');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showTicker:false,
    invitationTitle:'等待对方加入'
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
    tunnel.createTunnel();
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
  onClickInvitation: function () {
    this.setData({
      showTicker: !this.data.showTicker,
      invitationTitle: this.data.showTicker==false? '已邀请,等待对方加入...' : '等待对方加入'
    });
  },
  onClickRandom: function () {
    wx.navigateTo({
      url: '../competition/competition'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from == 'button') {
      return {
        title: '[有人@我]就问你多久没赢过我',
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
        title: '[有人@我]就问你多久没赢过我',
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
})
