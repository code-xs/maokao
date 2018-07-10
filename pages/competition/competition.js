//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
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
    scoreStr:null,
    answer:[],
    question:[],
    answerid:[],
    type3imagesW:300,
    type3imagesH:200,
    showFragment:3,
    showModal:false,
    showFailed:false,
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
      backgroundColor: '#6d6d6d',
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
    this.initData();
    this.startCountDown(2000);
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
    if (_empirical == null || _empirical <= 0)
      _empirical = 999;
    var _level = wx.getStorageSync('level');
    if(_level == null || _level < 0)
      _level = 0;
    var _ranking = wx.getStorageSync('ranking');
    if (_ranking == null || _ranking < 0)
      _ranking = 0;
    console.log(' _empirical:' + _empirical + ',_level: ' + _level + ', _ranking:' + _ranking);
    
    this.setData({
      empirical: 999,
      ranking: 0,
      empiricalV: "第" + this.data.empirical +"题",
      levelV:this.data.level+"级",
      scoreStr: this.data.score+'分',
      answer: this.data.answer,
    });
    this.initQuestionAndAnswer(this.data.showFragment);
  },

  initQuestionAndAnswer(type){
    this.data.answer = [];
    this.data.question = [];
    this.data.answerid =[];
    if(type == 1){
      this.data.question.push('前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局')
      this.data.answer.push('前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目');
      this.data.answer.push('前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目');
      this.data.answer.push('难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局');
      this.data.answer.push('难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局');
      this.data.answerid.push([11]);
      this.data.answerid.push([12]);
      this.data.answerid.push([13]);
      this.data.answerid.push([14])
    }else if (type == 2) {
      this.data.question.push('前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局');
      this.data.question.push('/images/angrybirds.png');
      this.data.answer.push('毕竟西湖六月中');
      this.data.answer.push('风光不与四十同');
      this.data.answer.push('映日荷花别样红');
      this.data.answer.push('故人西辞黄鹤楼');
      this.data.answerid.push([21]);
      this.data.answerid.push([22]);
      this.data.answerid.push([23]);
      this.data.answerid.push([24])
    }else if (type == 3) {
      this.data.question.push('前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局');
      this.data.answer.push('/images/airdroid.png');
      this.data.answer.push('/images/angrybirds.png');
      this.data.answer.push('/images/calendar.png');
      this.data.answer.push('/images/chrome.png');
      this.data.answerid.push(31);
      this.data.answerid.push(32);
      this.data.answerid.push(33);
      this.data.answerid.push(34)
    } else if (type == 4) {
      this.data.question.push('接天莲叶无穷尽下一句是')
      this.data.answer.push('毕竟西湖六月中');
      this.data.answer.push('风光不与四十同');
      this.data.answer.push('映日荷花别样红');
      this.data.answer.push('故人西辞黄鹤楼');
      this.data.answerid.push([41]);
      this.data.answerid.push([42]);
      this.data.answerid.push([43]);
      this.data.answerid.push([44])
    } else if (type == 5) {
      this.data.question.push('银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运');
      this.data.question.push('/images/angrybirds.png');
      this.data.answer.push('毕竟西湖六月中');
      this.data.answer.push('风光不与四十同');
      this.data.answer.push('映日荷花别样红');
      this.data.answer.push('故人西辞黄鹤楼');
      this.data.answerid.push([51]);
      this.data.answerid.push([52]);
      this.data.answerid.push([53]);
      this.data.answerid.push([54])
    }
    this.data.empirical += 1;
    this.setData({
      answer: this.data.answer,
      question: this.data.question,
      answerid: this.data.answerid,
      progress:100,
      empiricalV: "第" + this.data.empirical + "题",
    })
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
