//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    windowW:0,
    windowH:0,
    level:0,
    worldRanking:0,
    friendRanking:0,
    rate:20,
    // local data
    totalChallenge:0,
    winningStreak:0,
    maxScore:0,
    totalInvitation:0,
    invitationWin:0,
    invitationWinRate:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bf70d6',
    });
    this.initUserInfo();
    this.initData();
  },

  initUserInfo:function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
    console.log('initData total:' + app.globalData.total + ' rate:' + app.globalData.rate);
    this.setData({
      worldRanking: app.globalData.userRanking,
      level: app.scoreConvertLevel(app.globalData.totalScore),
      friendRanking: app.globalData.totalScore,
      rate: Math.round(app.globalData.userRanking * 100 / app.globalData.total),
      totalChallenge: app.globalData.achievementDetail.totalChallenge,
      winningStreak: app.globalData.achievementDetail.winningStreak,
      maxScore: app.globalData.achievementDetail.maxScore,
      totalInvitation: app.globalData.achievementDetail.totalInvitation,
      invitationWin: app.globalData.achievementDetail.invitationWin,
      invitationWinRate: app.globalData.achievementDetail.totalInvitation==0 ? 0: parseInt(app.globalData.achievementDetail.invitationWin * 100 / app.globalData.achievementDetail.totalInvitation),
    });
  },

  onShareAppMessage: function (ops) {
    if (ops.from == 'button') {
      return {
        title: '[有人@我]看看你的智商群里排第几',
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
        title: '[有人@我]看看你的智商群里排第几',
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
