//index.js
//获取应用实例
const app = getApp()
var tunnel = require('../../tunnel');
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
    timer:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    console.log('onLoad option.id' + option.id+' frompageid:' + option.frompageid)
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.initData();  
  },

  initData:function(){
    this.createTunnel();
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
    this.setData({
      showTicker: !this.data.showTicker,
      invitationTitle: this.data.showTicker == false ? '已邀请,等待对方加入...' : '等待对方加入'
    });
    this.startTimeTick(1000)
    this.connectTunnel();
    this.listenMatchSuccess();
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
      that.startTimeTick(duration);
    }, duration);
  },
  cancelTimer: function () {
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
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
    this.closeTunnel();
    this.cancelTimer();
  },

  createTunnel:function(){
    var tunnel = new qcloud.Tunnel(config.service.tunnelUrl);
    tunnel.open();
    this.data.tunnel = tunnel;
    console.log('tunnel:')
    console.log(tunnel)
    tunnel.on('PING', () => {//PING-PONG机制:监听服务器PING
      console.info("接收到PING")
      tunnel.emit('PONG', {//给出回应
        openId: app.globalData.openId
      })
      console.info("发出了PONG")
    })
  },
  closeTunnel:function(){
    if (this.data.tunnel) {
      console.log('close tunnel !')
      this.data.tunnel.close();
      this.data.tunnel = null;
    }
  },
  connectTunnel:function(){
    this.data.tunnel.on('connect', () => {//监听信道连接
      console.info("tunnelStatus = 'connect'")
      app.globalData.tunnelStatus = 'connect' //改变信道状态为已连接
      // if (that.tunnelConnectCallback) {//设置回调
      //   that.tunnelConnectCallback()
      // }
      if (1) {//设置回调
        this.data.tunnel.emit(' beginMatch ', {//发起匹配
          openId: app.globalData.openId,
          sortId: 2,
          friendsFightingRoom: ""//匹配者含friendsFightingRoom则说明是好友之间的匹配
        })
      }
    })
  },
  listenMatchSuccess:function(){
    var that = this;
    this.data.tunnel.on('matchSuccess', () => {//PING-PONG机制:监听服务器PING
      console.info("接收到matchSucess")
      this.cancelTimer();
    })
  }
})
