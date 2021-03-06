//index.js
//获取应用实例
const app = getApp()
var tunnelClass = require('../../tunnel');
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showTicker:false,
    invitationTitle:'等待对方加入',
    tunnel:null,
    timeTick:0,
    timeTickStr:'00',
    timer:null,
    timer1:null,
    timeOut:60,
    categoryID:-1,
    roomID:-1,
    showMatch:false,
    enterPKPage:false,
    countDownImages: ["/images/3.png", "/images/2.png", "/images/1.png", "/images/go.png"],
    countDownIndex:0,
    player2Name: 'MKING',    player2:"https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/home/avatar_default.jpg"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    console.log('onLoad option.id' + option.id+' roomID:' + option.roomID)
    console.log(this.data.countDownImages)
    this.data.categoryID = option.id;
    this.data.roomID = option.roomID;
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bb6cd5',
    });
    this.initData();  
    if (option.roomID != undefined && option.roomID > 0){
      this.beginMatch()
    } else if (option.roomID == 0){
      this.bindRandomMatch();
    }
  },

  initData:function(){
    this.setData({
      timeTick:0,
      timeTickStr: '00',
      showTicker: !this.data.showTicker,
      invitationTitle: this.data.showTicker == false ? '比赛即将开始...' : '等待对方加入'
    });
    tunnelClass.closeTunnel();
    var tunnel = tunnelClass.createTunnel();
    this.data.tunnel = tunnel;
    tunnelClass.setMatchSuccessCb(this.onHandleMatchSuccess);
    tunnelClass.listenMatchSuccess(null);
    tunnelClass.setListenQuestion(this.onHandleQuestion)
    tunnelClass.listenQuestion(null);
    tunnel.open();
  },

  onClickSelf:function(){
    wx.navigateTo({
      url: '../select/select' + '?lockLevel=' + (5) + '&maxLevel=' + 5
    })
  },
  onClickInvitation: function () {
    this.setData({
      showTicker: !this.data.showTicker,
      invitationTitle: this.data.showTicker==false? '即将开始...' : '等待对方加入'
    });
  },
  bindRandomMatch: function () {
    tunnelClass.beginMatch(this.data.categoryID, null);
    this.startTimeTick(1000)
  },
  startTimeTick: function (duration){
    var that = this;
    that.data.timer = setTimeout(function () {
      that.data.timer = null;
      if (that.data.timeTick + 1 < 10){
        that.setData({
          timeTickStr: '0'+(that.data.timeTick+1),
          timeTick:that.data.timeTick+1
        })
      }else{
        that.setData({
          timeTickStr: that.data.timeTick + 1,
          timeTick: that.data.timeTick + 1
        })
      }
      if (that.data.timeTick >= that.data.timeOut){
        tunnelClass.closeTunnel();
        that.setData({
          showTicker: !that.data.showTicker,
          invitationTitle: '匹配超时,请重试!',
          timeTick:0
        });
        that.showRetry();
      }else{
        that.startTimeTick(duration);
      }
    }, duration);
  },
  cancelTimer: function () {
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
    if (this.data.timer1 != null) {
      console.log(' clearTimeout1 at first !!!');
      clearTimeout(this.data.timer1);
      this.data.timer1 = null;
    }
  },
  showRetry: function () {
    var that = this;
    wx.showModal({
      title: '随机匹配',
      content: '是否再次匹配',
      success: function (res) {
        if (res.confirm) {
          console.log('confirm')
          that.initData();
        } else {
          console.log('confirm cancel')
          wx.navigateBack({
            delta: -1
          });
        }
      }
    })
  },

  beginMatch:function(){
    console.log('roomID:' + this.data.roomID + ',ID:' + this.data.categoryID)
    console.log('app.globalData.openId:' + app.globalData.openId)
    if (app.globalData.openId != undefined && app.globalData.openId != null){
      tunnelClass.beginMatch(this.data.categoryID, this.data.roomID);
    }else{
      var that = this
      this.data.timer1 = setTimeout(function () {
        that.data.timer1 = null
        that.beginMatch();
      },200);  
    }
  },

  onShareAppMessage: function (ops) {
    if (ops.from == 'button') {
      this.data.roomID = new Date().getTime().toString() + parseInt(Math.random() * 10000000)
      this.beginMatch();
      return {
        title: '[有人@我]赶快和我PK一次吧',
        path: 'pages/home/home?roomID=' + this.data.roomID+'&id='+this.data.categoryID,
        imageUrl: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/share/share_invite_logo.png',
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
        imageUrl: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/share/share_invite_logo.png',
        success: function (res) {
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },  
  onUnload:function(){
    this.cancelTimer();
  },

  onHandleMatchSuccess:function(res){
    var that = this;
    tunnelClass.setMatchSuccessCb(null);
    if (res.player2.openId == app.globalData.openId){
      app.globalData.userInfo1 = res.player1;
    }else{
      app.globalData.userInfo1 = res.player2;
    }
    console.log('app.globalData.userInfo1:');
    console.log(app.globalData.userInfo1);
    //console.log(app.globalData.player2Info);
    that.cancelTimer();
    that.setData({
      showTicker: !that.data.showTicker,
      invitationTitle: '匹配成功!',
      timeTick: 0,
      player2: app.globalData.userInfo1.avatarUrl,
      player2Name: app.globalData.userInfo1.nickName
    });
  },

  showCountDown:function(index){
    var that = this;
    console.log('showCountDown index:' + index);
    if (index < this.data.countDownImages.length){
      that.setData({
        showMatch:true,
        countDownIndex:index
      });
      console.log('index:'+index);
      this.data.timer = setTimeout(function () {
        that.showCountDown(++index);
      }, 1000);
    }else{
      this.setData({
        showMatch: false,
        countDownIndex: 0
      });
      this.data.timer = setTimeout(function () {
        wx.redirectTo({
          url: '../competition/competition?id=' + that.data.categoryID + '&roomID=' + that.data.roomID,
        })
        that.data.enterPKPage = true;
      }, 10);
    }
  },

  onHandleQuestion:function(res){
    console.log('enter onHandleQuestion!')
    console.log(res)
    app.globalData.question = res.question;
    this.showCountDown(0);
  },
  onUnload: function () {
    console.log("==onUnload== , enterPkPage:" + this.data.enterPKPage);
    if(!this.data.enterPKPage){
      this.cancelTimer();
      tunnelClass.closeTunnel();
    }
  },
})
