//index.js
//获取应用实例  
const app = getApp()
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/wafer2-client-sdk/index');

// 引入配置
var config = require('../../config');
var isGoShipping = false;

Page({
  data: {
    motto: 'MKWZ',
    userInfo: {},
    userInfo1: {
avatarUrl:"https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/home/avatar_default.jpg",
      nickName:"MKING"
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical:0,
    level:1,
    ranking:0, 
    progress:0,
    Height:150,
    empiricalV:0,
    levelV:1,
    challenge:-1,
    userRanking:100,
    scoreGap:900,
    remoteID:-1,
    remoteRoomID:-1,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    app.setUpdateRankingCallBack(this.updateScoreInfo);
    app.setListenUserAuthorizeStatusCallBack(this.listenUserAuthorizeStatus);
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
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
      console.log(' userInfo1:' + this.data.userInfo1);
      console.log(this.data.userInfo1);
      console.log(' userInfo:' + this.data.userInfo);
      console.log(this.data.userInfo);
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
      console.log(' userInfo1:' + this.data.userInfo1);
      console.log(' userInfo:' + this.data.userInfo);
      if (!this.data.hasUserInfo){
        this.setData({
          userInfo: this.data.userInfo1,
        })
      }
    }
    //option.id = 24
    //option.roomID = 123244234234
    this.data.remoteID = option.id
    this.data.remoteRoomID = option.roomID
    console.log('userAuthorizeStatus:' + app.globalData.userAuthorizeStatus);
    console.log('user openId:' + app.globalData.openId);
    console.log('onLoad option.id' + option.id + ' roomID:' + option.roomID)
    this.initData();
    this.gotoInvitation();
  },
  gotoInvitation:function(){
    console.log('onLoad this id' + this.data.remoteID + ' roomID:' + this.data.remoteRoomID)
    if (app.globalData.userAuthorizeStatus == 1
      && this.data.remoteID != undefined && this.data.remoteRoomID != undefined) {
      console.log(' come from Friend PK!!!')
      wx.navigateTo({
        url: '../invitation/invitation?id=' + this.data.remoteID + '&roomID=' + this.data.remoteRoomID,
      })
    }
  },
  listenUserAuthorizeStatus:function(status){
    console.log('UserAuthorizeStatus:'+status)
    if (status == 0
      && this.data.remoteID != undefined
      && this.data.remoteRoomID != undefined) {
        console.log('come from Friend PK!!!')
        wx.showToast({
          title: '用户未授权，请先授权！',
        })
    } else if (status == 1
      && this.data.remoteID != undefined
      && this.data.remoteRoomID != undefined){
      this.gotoInvitation();
    }
  },
  updateScoreInfo:function(data){
    console.log('app.globalData.userInfo:')
    console.log(app.globalData.userInfo)
    var level = app.scoreConvertLevel(app.globalData.totalScore);
    var pscoreGap = app.getNextLevelScoreGap(app.globalData.totalScore, level);
    var pprogress = 100 * (app.globalData.totalScore - app.getLevelMaxScore(level)) /
      (app.getLevelMaxScore(level + 1));

    var fenzi = app.globalData.totalScore - app.getLevelMaxScore(level);
    var fenmu = app.getLevelMaxScore(level + 1);
    pprogress = 100 * fenzi / fenmu;
    console.log('--->  updateScoreInfo totalScore:' + app.globalData.totalScore + 'fenzi:'+ fenzi + ' fenmu:'+fenmu+ ' pprogress:' + pprogress);

    this.setData({
      empirical: 0, 
      level: 1,
      ranking: 0, 
      levelV: level,
      scoreGap: pscoreGap,
      userRanking: app.globalData.userRanking,
      empiricalV: app.globalData.totalScore,
      progress: pprogress,
    });    
  },

  initData:function(){
    console.log('initData:')
    console.log(app.globalData)
    var level = app.scoreConvertLevel(app.globalData.totalScore);
    var pprogress = 100 * (app.globalData.totalScore - app.getLevelMaxScore(level)) / 
    app.getLevelMaxScore(level + 1);
    console.log('------------->  initData totalScore:' + app.globalData.totalScore + ' pprogress:' + pprogress);

    this.setData({
      empirical: 0,
      level: 1,
      ranking: 0,
      levelV: level,
      userRanking: app.globalData.userRanking,
      empiricalV: app.globalData.totalScore,
      progress: pprogress,
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#502488',
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
      url: '../select/select' + '?frompageid=1&lockLevel=' + (5) + '&maxLevel=' + 5
    })
  },
  onClickFriend: function () {
    wx.navigateTo({
      url: '../invitation/invitation'
    })
  },
  onClickPK: function() {
    console.log('onClickPK this.isGoShipping'+this.isGoShipping);
    if(isGoShipping) {
      this.showNotOK();
    } else {
        wx.navigateTo({
          url: '../select/select?frompageid=2',
       })
    }
   
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

  onClickStudy:function() {
    wx.navigateTo({
      url: '../select/select?frompageid=4',
    })
  },
/*
  onShareAppMessage: function (ops) {
    if (ops.from == 'button') {
      return {
        title: '[有人@我]免费全面的考题等你挑战',
        imageUrl:'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/home_rank.png',
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
  },*/
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
    // if (app.globalData.userInfo == null || app.globalData.openId == null){
    //   this.showToast('用户信息异常,请稍后再试');
    //   return ;
    // }
    
    if(id==0){
      this.onClickMain();
    }else if(id==1){
      // if (app.globalData.categoryTree == null){
      //   this.showToast('正在加载数据,请稍后再试');
      // }else{
        this.onClickSelf();
      // }
    }else if(id == 2) {
      // if (app.globalData.categoryPKTree == null) {
      //   this.showToast('正在加载数据,请稍后再试');
      // } else {
        this.onClickPK();  
      // }
    }else if(id == 3) {
      this.onClickRanking();
    } else if (id == 4) { 
      // if (app.globalData.categoryStudyTree == null) {
      //   this.showToast('正在加载数据,请稍后再试');
      // } else {
        this.onClickStudy();
      // }
    }
  },
  onShow: function (options) {
    //this.getUserInfoFun()
  },

  showToast:function(str){
    wx.showToast({
      title: str,
      icon: 'none',
    })
  },
  //分享
  onShareAppMessage: function (res) {
    let that = this
    return {
      title: '[有人@我]免费全面的考题等你挑战',
      imageUrl: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/share/share_invite_logo.png',
      path: 'pages/home/home',
      success: function (res) {
        //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
        //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
        //获取用户设备信息
        console.log(res)
        app.getShareTicket(res)
      }
    }
  },
  showNotOK: function () {
    wx.showModal({
      title: '啊噢',
      showCancel: false,
      content: '此功能尚未开通,敬请期待！',
      success: function (res) {
      }
    })
  },
})
