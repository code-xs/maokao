//index.js
//获取应用实例
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
Page({
  data: {
    ID:-1,
    PAGE:0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical:999,
    ranking:0,
    progress:99,
    Height:150,
    empiricalV:0,
    levelV:0,
    windowW:0,
    windowH:0,
    score:13242,
    score1:0,
    typeScore:0,
    answer:[],
    question:[],
    answerid:[],
    character:[],
    type3imagesW:300,
    type3imagesH:200,
    showFragment:1,
    curIndex:0,
    showModal:false,
    showFailed:false,
    showSuccess:false,
    pendEvent:false,
    redCnt:5,
    gameOver:false,
    timer:null,
    answerIndex:-1,
    correct:'√',
    incorrect: 'X',
    characterBgColor:[],
    hearts:[],
    continueRight:0,
    levelRules: [{
      'title': '新手',
      'levels': [{
        'level': 1,
        'score': 0,
      }, {
        'level': 2,
        'score': 900,
      }, {
          'level': 3,
          'score': 150,
      }, {
        'level': 4,
        'score': 1900,
      }, {
        'level': 5,
        'score': 2300,
      }],
    }, {
      'title': '熟手',
      'levels': [{
        'level': 6,
        'score': 3900,
      }, {
        'level': 7,
        'score': 4800,
      }, {
        'level': 8,
        'score': 5700,
      }, {
        'level': 9,
        'score': 6600,
      }, {
        'level': 10,
        'score': 7500,
      }],
      }, {
        'title': '黑铁',
        'levels': [{
          'level': 11,
          'score': 830,
        }, {
          'level': 12,
          'score': 9300,
        }, {
          'level': 13,
          'score': 11400,
        }, {
          'level': 14,
          'score': 13800,
        }, {
          'level': 15,
          'score': 16500,
        }],
    }, {
      'title': '青铜',
      'levels': [{
        'level': 16,
        'score': 19500,
      }, {
        'level': 17,
        'score': 22800,
      }, {
        'level': 18,
        'score': 26400,
      }, {
        'level': 19,
        'score': 30300,
      }, {
        'level': 20,
        'score': 34500,
      }]
      }],
    tree:[{
        'id': 11,
        'title': '前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
        'answers': [{
          'answer': '回到网页开发去了前段时间小程序上线后就弃坑了,回到网页开了',
          'id': 0,
        }, {
          'answer': '最近又有新项目,再次入坑,难免需要一些dem重新dsdsassddasdsa',
          'id': 1,
        }, {
          'answer': '回到网页开发去了在这个过,发现demo中很少有人使用flex布局',
          'id': 2,
        }, {
          'answer': '发现demo少有人使用flex布局123323223,回到网页开发去了',
          'id': 3,
        }],        
        'answer': 3,
        'score':10,
        'timer':60,
        'type':1,
        'index':999,
    }, {
        'id': 13,
        'title': '前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
        'title1': '/images/angrybirds.png',
        'answers':[{
          'answer': '回到网页开发去了前段时上线后就弃坑了,回到网页开发去了',
          'id': 0,
        }, {
          'answer': '最近又有新项目,再次入坑,要一些demo来重新dsdsassddasdsa',
          'id': 1,
          }, {
            'answer': '回到网页开发去了在中,发现demo中很少有人使用flex布局',
            'id': 2,
        }, {
          'answer': '回到网页开发时间小程序上线后就弃坑了,回到网页开发去了',
          'id': 3,
        }],
        'score': 10,
        'timer': 120,
        'answer':2,
        'type': 2,
        'index': 1001,
      }, {
      'id': 14,
      'title': '前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
      'title1': '/images/angrybirds.png',
      'answers': [{
        'answer': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
        'id': 0,
      }, {
          'answer': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
        'id': 1,
      }, {
          'answer': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
        'id': 2,
      }, {
          'answer': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
        'id': 3,
      }],
      'answer': 1,
      'score': 10,
      'timer': 160,
      'type': 3,
      'index': 1002,
      }, {
        'id': 15,
        'title': '接天莲叶无穷尽下一句是', 
        'answers': [{
          'answer': '毕竟西湖六月中',
          'id': 0,
        }, {
          'answer': '风光不与四十同',
          'id': 1,
        }, {
            'answer': '映日荷花别样红',
          'id': 2,
        }, {
            'answer': '故人西辞黄鹤楼',
          'id': 3,
        }],
        'answer': 2,
        'score': 10,
        'timer': 200,
        'type': 4,
        'index': 1003,
      }, {
        'id': 16,
        'title': '银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运',
        'title1': '/images/angrybirds.png',
        'answers': [{
          'answer': '毕竟西湖六月中',
          'id': 0,
        }, {
          'answer': '风光不与四十同',
          'id': 1,
        }, {
          'answer': '映日荷花别样红',
          'id': 2,
        }, {
          'answer': '故人西辞黄鹤楼',
          'id': 3,
        }],
        'answer': 1,
        'score': 10,
        'timer': 110,
        'type': 5,
        'index': 1004,
      }]
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    this.data.ID = option.id;
    console.log(' get select id:'+this.data.ID)
    console.log(' get app.globalData.userInfo:' + app.globalData.userInfo)
    var score = wx.getStorageSync('totalScore');
    if(score == null || score == 0)
      score = 1;
    var typeScore = wx.getStorageSync('typeScore-'+this.data.ID);
    if (typeScore == null)
      typeScore = 0;
    typeScore = parseInt(typeScore);
    console.log(' get typeScore:' + typeScore)
    this.setData({
      score: score,
      typeScore: typeScore,
    })    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#735cd9',
    });
    wx.setNavigationBarTitle({
      title: "个人挑战"
    })
    this.requestQuestionList(this.data.PAGE, this.data.ID);
    //this.initData();
  },
  getUserInfo: function(e) {
    console.log(' getUserInfo')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
        if (that.data.tree == null || that.data.tree.length == 0){
          this.setData({
            gameOver: true,            
            showFailed:true,
            showFragment:0,
          });
          this.saveCacheData();
        }else{
          if(that.data.PAGE == 0){
            that.initData();
          }else{
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
  initData:function(){
    this.initHearts(this.data.redCnt);
    this.setData({
      ranking: 0,
      levelV:this.data.level+"级",
      score: this.data.score,
    });

    this.initQuestionAndAnswer(this.data.curIndex);
  },

  initHearts:function(redCnt){
    this.data.hearts = [];
    for(var i=0; i< 5; i++){
      if(i <redCnt){
        this.data.hearts.push('/images/heart-l.png');
      }else{
        this.data.hearts.push('/images/heartfail-l.png');
      }
    }
    this.setData({
      hearts: this.data.hearts,
    });
  },
  initQuestionAndAnswer(index){
    this.data.pendEvent = false;

    this.data.answer = [];
    this.data.question = [];
    this.data.answerid =[];
    this.data.characterBgColor = [];
    this.data.character=[];
    var section = this.data.tree[index];
    var type = section.type;

    this.data.character.push('A.');
    this.data.character.push('B.');
    this.data.character.push('C.');
    this.data.character.push('D.');      
    console.log(' section ' + index + ' data.type:' + section.type);
    this.setData({
      answer: this.data.answer,
      question: section,
      answerid: this.data.answerid,
      showFragment: type,
      answerIndex:-1,
      progress:100,
      empiricalV: "第" + section.index + "题",
      characterBgColor: this.data.characterBgColor,
      character: this.data.character,
    })
    this.startCountDown(section.timer*10);
    app.addChallengeCnt(1);
  },
  showModal:function(){
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

  checkAnswer:function(id){
    var question = this.data.tree[this.data.curIndex];
    if (question.answer == id)
      return true;
    else
      return false;
  },

  showAnswer:function(id){
    var section = this.data.tree[this.data.curIndex];
    var ret = this.checkAnswer(id);
    console.log(' onClickAnswer:' + id + ' ret is:' + ret);    
    if (ret) {
      this.data.characterBgColor[id] = '#2fff00';
      this.data.character[id] = this.data.correct;
      this.data.continueRight ++;
      this.data.score += section.score;
      this.data.typeScore += section.score;
      this.data.score1 += section.score;
    } else {
      app.updateWinningStreak(this.data.continueRight);
      this.data.continueRight = 0;
      this.data.characterBgColor[section.answer] = '#2fff00';
      this.data.character[section.answer] = this.data.correct;
      if(id > 0){
        this.data.characterBgColor[id] = '#ff3429';
        this.data.character[id] = this.data.incorrect;
      }
    }

    this.setData({
      score: this.data.score,
      characterBgColor: this.data.characterBgColor,
      character: this.data.character,
    });
    wx.setStorage({
      key: 'totalScore',
      data: this.data.score,
    });
    wx.setStorage({
      key: 'typeScore-'+this.data.ID,
      data: this.data.typeScore,
    })
  },
  onClickAnswer:function(e){
    if (this.data.pendEvent){
      console.log(' pendEvent !!!');
      return;
    }
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
    this.showAnswer(e.target.id);
    console.log(' this.data.tree.length:' + this.data.tree.length);
    this.loadNext(1000);
  },
  loadNext:function(delay){
    if (this.data.curIndex >= this.data.tree.length - 1) {
      this.data.curIndex = 0;
      this.requestQuestionList(++this.data.PAGE, this.data.ID);
    } else {
      var that = this;
      setTimeout(function () {
        that.initQuestionAndAnswer(++that.data.curIndex);
      }, delay);
    }
  },
  onClickCloseModal:function(){
    console.log(' onClickCloseModal !');
    this.setData({
      showModal: !this.data.showModal
    })    
  },
  startCountDown:function(duration){
    var that = this;
    if (that.data.timer != null){
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      that.data.timer = null;
    }
    if (that.data.progress > 0){
      that.data.timer = setTimeout(function () {
        that.data.timer = null;
        that.setData({
          progress : that.data.progress - 1
        })
        that.startCountDown(duration);
      }, duration);
    }else{
      this.initHearts(--this.data.redCnt);
      this.showAnswer(-1);
      this.data.pendEvent = true;
      if (this.data.redCnt > 0){
        this.loadNext(2000);
      }else{
        this.showModal();
      }
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

  onClickAgain: function () {
    this.data.PAGE = 0;
    this.requestQuestionList(this.data.PAGE, this.data.ID);
  },

  saveCacheData:function(){
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
    if (this.data.score1 > 0){
      app.updateMaxScore(this.data.score1);   
      app.uploadScoreInfo(this.data.ID, this.data.score1);
      this.data.score1 = 0;
    }
    if (this.data.continueRight >0){
      app.updateWinningStreak(this.data.continueRight);
      this.data.continueRight = 0;
    }
    app.saveDataToStorage();
  },

  onHide: function () {
    console.log(' onHide!!!');
    this.saveCacheData();
  },
  onUnload: function () {
    console.log("==onUnload==");
    this.saveCacheData();    
  },
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from == 'button') {
      return {
        title: '[有人@我]免费全面的考题等你挑战',
        path: 'pages/home/home',
        success: function (res) {
          console.log("转发成功:" + JSON.stringify(res));
          that.retryAgain();
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

  retryAgain:function(){
    this.data.redCnt = 5;
    this.initHearts(this.data.redCnt);
    this.setData({
      showModal: false,
    });
    this.data.pendEvent = false;
    this.loadNext(1000);
  }
})
