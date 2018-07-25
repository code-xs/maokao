//index.js
//获取应用实例
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
Page({
  data: {
    userInfo: {},
    userInfo1:{
      nickName:'Rose',
      avatarUrl:'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/challenge/ic_crown.png',
      score:100,
      selectAnswer:1,
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical:999,
    ranking:0,
    progress:99,
    Height:150,
    empiricalV:0,
    selfScore:0,
    friendScore: 0,
    levelV:0,
    windowW:0,
    windowH:0,
    score:13242,
    PAGE:0,
    ID:24,
    scoreStr:null,
    score1: 0,
    typeScore: 0,
    answer: [],
    question: [],
    answerid: [],
    character: [],    
    type3imagesW:300,
    type3imagesH:200,
    showFragment:3,
    showModal:false,
    showFailed:false,
    levelNum: 9999,
    showFragment: 1,
    curIndex: 0,
    oldLevel: 0,
    upgradeDialog: false,
    showModal: false,
    pendEvent: false,
    redCnt: 5,
    gameOver: false,
    timer: null,
    pendindDuration: 1000,
    answerIndex: -1,
    allowShareMax: 2,
    curShareTick: 0,
    characterBgColor: [],
    hearts: [],
    continueRight: 0,
    continueMaxRight: 0,
    errorCateoryList: [],
    questionTotal: 30,
    questionIndex: 0,
    showLoading: false,    
    type1: [{
      'id': 11,
      'title': '前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
      'answer1': ',回到网页开发去了前段时间小程序上线后就弃坑了,回到网页开发去了',
      'answer2': '最近又有新项目,再次入坑,难免需要一些demo来重新dsdsassddasdsa',
      'answer3': '回到网页开发去了在这个过程中,发现demo中很少有人使用flex布局',
      'answer4': '回到网页开发去了在这个过程中,发现demo中很少有人使用flex布局123323223',
      'answer':3
    }],
    type2: [{
      'id': 12,
      'title': '接天莲叶无穷尽下一句是?',
      'answer1': '毕竟西湖六月中',
      'answer2': '风光不与四十同',
      'answer3': '映日荷花别样红',
      'answer4': '故人西辞黄鹤楼',
      'answer':1,
    }],
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a753d6',
    });
    wx.setNavigationBarTitle({
      title: "对战"
    })
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
    //this.initData();
    this.requestQuestionList(this.data.PAGE, this.data.ID);
    //this.startCountDown(2000);
  },
  getUserInfo: function(e) {
    console.log(' getUserInfo')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  cancelTimer: function () {
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
  },
  initData:function(){    
    this.setData({
      empirical: 999,
      ranking: 0,
      empiricalV: "第" + this.data.empirical +"题",
      levelV:this.data.level+"级",
      scoreStr: this.data.score+'分',
      answer: this.data.answer,
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#735cd9',
    });
    wx.setNavigationBarTitle({
      title: "对战"
    })
    //this.requestQuestionList(this.data.PAGE, this.data.ID);
    this.initQuestionAndAnswer(this.data.showFragment);
  },
  requestQuestionList: function (page, id) {
    var that = this;
    qcloud.request({
      url: config.service.requestQuestionList,
      header: {
        'Content-Type': 'application/json'
      },
      data: {//这里写你要请求的参数
        category_id: id,
        page_index: page
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        console.log(response.data.data);
        that.data.tree = response.data.data;

        if (that.data.tree == null || that.data.tree.length == 0) {
          this.setData({
            gameOver: true,
            showFragment: 0,
          });
          this.cancelTimer();
          //this.saveCacheData();
          //this.showUpgradeDialog();
        } else {
          if (that.data.PAGE == 0) {
            that.initData();
          } else {
            that.initQuestionAndAnswer(that.data.curIndex);
          }
        }
        console.log(that.data.tree);
      },
      fail: function (err) {
        console.log('请求失败', err);
      }
    });
  },

  initQuestionAndAnswer(index) {
    this.data.pendEvent = false;

    this.data.answer = [];
    this.data.question = [];
    this.data.answerid = [];
    this.data.characterBgColor = [];
    this.data.character = [];
    var section = this.data.tree[index];
    var type = section.type;

    this.data.character.push('../../images/ic_a.png');
    this.data.character.push('../../images/ic_b.png');
    this.data.character.push('../../images/ic_c.png');
    this.data.character.push('../../images/ic_d.png');
    console.log(' section ' + index + ' data.type:' + section.type);
    this.setData({
      answer: this.data.answer,
      question: section,
      answerid: this.data.answerid,
      showFragment: type,
      answerIndex: -1,
      progress: 100,
      empiricalV: "第" + section.index + "题",
      characterBgColor: this.data.characterBgColor,
      character: this.data.character,
      questionIndex: this.data.questionIndex,
    })
    this.data.questionIndex++;
    this.startCountDown(section.timer * 10);
    app.addChallengeCnt(1);
  },

  onClickContext:function(){
    this.setData({
      showModal: !this.data.showModal
    })
  },

  onCancel: function () {
    this.setData({
      showModal: !this.data.showModal
    })
  },

  onConfirm: function () {
    this.setData({
      showModal: !this.data.showModal
    })
  },
  preventTouchMove: function () {
    console.log(' preventTouchMove !');
  },
  onClickAnswer:function(e){
    console.log(' onClickAnswer:' + e.target.id);
    this.data.showFragment++;
    if (this.data.showFragment > 5) {
      this.data.showFragment = 0;
      this.setData({
        showFailed: !this.data.showFailed
      })
      
    }
    this.setData({
      showFragment: this.data.showFragment
    })
    this.initQuestionAndAnswer(this.data.showFragment);    
  },
  onClickCloseModal:function(){
    console.log(' onClickCloseModal !');
    this.setData({
      showModal: !this.data.showModal
    })    
  },
  startCountDown:function(duration){
    var that = this;
    if (that.data.progress > 0){
      setTimeout(function () {
        that.setData({
          progress : that.data.progress - 1
        })
        that.startCountDown(duration);
      }, duration);
    }
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

  },
  onClickRanking: function () {

  },
})
