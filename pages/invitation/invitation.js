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
    timeOut:30,
    categoryID:-1,
    showMatch:false,
    countDownImages: ["/images/3.png", "/images/2.png", "/images/1.png", "/images/go.png"],
    countDownIndex:0,
    player2Name: '未知',    player2:"https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/home/avatar_default.jpg"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    console.log('onLoad option.id' + option.id+' frompageid:' + option.frompageid)
    console.log(this.data.countDownImages)
    this.data.categoryID = option.id;
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#735cd9',
    });
    this.initData();  
  },

  initData:function(){
    var tunnel = tunnelClass.createTunnel();
    this.data.tunnel = tunnel;
    tunnelClass.listenMatchSuccess(this.onHandleMatchSuccess);
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
  onClickRandom: function () {
    this.setData({
      showTicker: !this.data.showTicker,
      invitationTitle: this.data.showTicker == false ? '即将开始...' : '等待对方加入'
    });
    tunnelClass.beginMatch(this.data.categoryID);
    this.startTimeTick(1000)
    /*
    wx.navigateTo({
      url: '../competition/competition'
    })*/
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
        that.setData({
          showTicker: !that.data.showTicker,
          invitationTitle: '匹配超时,请重试!',
          timeTick:0
        });
        that.showCountDown(0);
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
  },
  matchTimeout:function(){

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
  onUnload:function(){
    //tunnelClass.closeTunnel();
    this.cancelTimer();
  },

  onHandleMatchSuccess:function(res){
    var that = this;
    app.globalData.userInfo1 = res.player2;
    console.log(app.globalData.player2Info);
    that.cancelTimer();
    that.setData({
      showTicker: !that.data.showTicker,
      invitationTitle: '匹配成功!',
      timeTick: 0,
      player2: res.player2.avatarUrl
    });
  },

  showCountDown:function(index){
    if (index < this.data.countDownImages.length){
      var that = this;
      that.setData({
        showMatch:true,
        countDownIndex:index
      });
      this.data.timer = setTimeout(function () {
        that.showCountDown(++index);
      }, 1000);
    }else{
      this.setData({
        showMatch: false,
        countDownIndex: 0
      });
    }
  },

  onHandleQuestion:function(res){
    console.log('enter onHandleQuestion!')
    console.log(res)
    app.globalData.question = res.question;
    this.data.timer = setTimeout(function () {
      wx.redirectTo({
        url: '../competition/competition'
      })
    }, 1000);
  }
})
