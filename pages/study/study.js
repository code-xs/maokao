//index.js
//获取应用实例
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var DEBUG = false;

var touchDown = 0;//触摸时的原点  
var touchUp = 0;
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var intervalId = "";// 记录/清理时间记录  

var datatreeDebug = [{
  'id': 11,
  'title': '11111前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
  'answers': [{
    'answer': '回到网页开发去了前段时间小程序上线后就弃坑了,回到网页开了前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
    'id': 0,
  }, {
    'answer': '最近又有新项目,再次入坑,难免需要一些dem重新dsdsassddasdsa前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
    'id': 1,
  }, {
    'answer': '回到网页开发去了在这个过,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
    'id': 2,
  }, {
    'answer': '发现demo少有人使用flex布局123323223,回到网页开发去了前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
    'id': 3,
  }],
  'answer': 3,
  'score': 10,
  'timer': 10,
  'type': 1,
  'index': 999,
}, {
  'id': 13,
  'title': '22222222前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
  'title2': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
  'answers': [{
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
  'timer': 10,
  'answer': 2,
  'type': 2,
  'index': 1001,
}, {
  'id': 14,
  'title': '33333333前段时间小程序上线后就弃坑了,回到网页开发去了,最近又有新项目,再次入坑,难免需要一些demo来重新熟悉,在这个过程中,发现demo中很少有人使用flex布局',
  'title2': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
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
  'answers_img': [{
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
  'timer': 1000,
  'type': 3,
  'index': 1002,
}, {
  'id': 15,
  'title': '44444接天莲叶无穷尽下一句是',
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
  'timer': 10,
  'type': 4,
  'index': 1003,
}, {
  'id': 16,
  'title': '5555555银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运动银河系的恒星大约四分之一是双星,某双星由质量不等的S2和S1构成,两星由两者万有引力下构成,某一圆点做运转运',
  'title2': 'http://img6.bdstatic.com/img/image/smallpic/PPT1215.jpg',
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
  'answers_img': [{
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
  'timer': 10,
  'type': 5,
  'index': 1004,
}];

Page({
  data: {
    ID: -1,
    PAGE: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical: 999,
    ranking: 0,
    progress: 99,
    showAnalytics:false,
    Height: 150,
    empiricalV: 0,
    levelV: 0,
    windowW: 0,
    windowH: 0,
    score: 13242,
    score1: 0,
    typeScore: 0,
    answer: [],
    question: [],
    answerid: [],
    character: [],
    type3imagesW: 300,
    type3imagesH: 200,
    levelNum: 9999,
    showFragment: 1,
    curIndex: 0,
    oldLevel: 0,
    showModal: false,
    pendEvent: false,
    gameOver: false,
    timer: null,
    pendindDuration: 1000,
    answerIndex: -1,
    characterBgColor: [],
    hearts: [],
    continueRight: 0,
    continueMaxRight: 0,
    errorCateoryList: [],
    questionTotal: 30,
    questionIndex: 0,
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
    tree: "",
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (option) {
    this.data.ID = option.id;
    console.log(' get select id:' + this.data.ID)
    console.log(' get app.globalData.userInfo:' + app.globalData.userInfo)
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
      title: "个人练习"
    })
    this.requestQuestionList(this.data.PAGE, this.data.ID);
  },
  getUserInfo: function (e) {
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

        if(DEBUG) {
          that.data.tree = datatreeDebug;
        } else {
          that.data.tree = response.data.data;
        }

        if (that.data.tree == null || that.data.tree.length == 0) {
          this.setData({
            gameOver: true,
            showFragment: 0,
          });
          this.cancelTimer();
          this.saveCacheData();
          this.showUpgradeDialog();   
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
  initData: function () {
    this.initQuestionAndAnswer(this.data.curIndex);
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
      showAnalytics:false,
      empiricalV: "第" + section.index + "题",
      characterBgColor: this.data.characterBgColor,
      character: this.data.character,
      questionIndex: this.data.questionIndex,
    })
    this.data.questionIndex++;
    app.addChallengeCnt(1);
  },

  showModal: function () {
    var that = this;
    this.cancelTimer();
    this.saveCacheData();
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

  checkAnswer: function (id) {
    var question = this.data.tree[this.data.curIndex];
    if (question.answer == id)
      return true;
    else
      return false;
  },

  showAnswer: function (id) {
    var section = this.data.tree[this.data.curIndex];
    var ret = this.checkAnswer(id);
    console.log('onClickAnswer:' + id + ' ret is:' + ret);
    if (ret) {
      this.data.characterBgColor[id] = '#9be665';
      this.data.continueRight++;
      this.data.character[id] = '/images/ic_aws_right.png';
    } else {
      app.updateWinningStreak(this.data.continueRight);
      if (this.data.continueRight > this.data.continueMaxRight) {
        this.setData({
          continueMaxRight: this.data.continueRight,
        })
      }
      this.data.errorCateoryList.push(section);
      console.log('errorCateoryList:')
      console.log(this.data.errorCateoryList)
      this.data.continueRight = 0;
      this.data.characterBgColor[section.answer] = '#9be665';
      this.data.character[section.answer] = '/images/ic_aws_right.png';
      if (id >= 0) {
        this.data.characterBgColor[id] = '#F76F40';
        this.data.character[id] = '/images/ic_aws_error.png';
      }
    } 

    this.data.showAnalytics = true;
    var index = parseInt(section.answer) + 1;
    this.setData({
      characterBgColor: this.data.characterBgColor,
      character: this.data.character,
      answerIndex: index,
      showAnalytics: this.data.showAnalytics,
    }); 
  },

  onClickAnswer: function (e) {
    if (this.data.pendEvent) {
      console.log(' pendEvent !!!');
      return;
    }
    console.log(' call cancelTimer');
    this.cancelTimer();
    console.log(' call showAnswer');
    this.showAnswer(e.target.id);
    console.log(' showAnalytics:' + this.data.showAnalytics);
    console.log(' this.data.tree.length:');
    this.data.pendEvent = true;
    this.loadNext(this.data.pendindDuration);
  },

  loadNext: function (delay) {
    if (this.showChallengeResult(false))
      return;

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


  onClickCloseModal: function () {
    console.log(' onClickCloseModal !');
    this.showChallengeResult(true);
  },

  showChallengeResult: function (force) {
    if (force || this.data.questionIndex >= this.data.questionTotal) {
      this.data.pendEvent = true;
      var that = this;
      this.cancelTimer();
      var delay = force ? 100 : this.data.pendindDuration;
      setTimeout(function () {
        that.setData({
          showModal: false,
          gameOver: true,
          showFragment: 0,
        })
        that.saveCacheData();
      }, delay);
      return true;
    } else {
      return false;
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
  onClickSelf: function () {
    wx.navigateTo({
      url: '../select/select' + '?lockLevel=' + (5) + '&maxLevel=' + 5
    })
  },

  onClickAgain: function () {
    console.log(' onClickAgain !!!');
    this.reLoadData();
  },

  cancelTimer: function () {
    if (this.data.timer != null) {
      console.log(' clearTimeout at first !!!');
      clearTimeout(this.data.timer);
      this.data.timer = null;
    }
  },

  saveCacheData: function () {
    if (this.data.continueRight > 0) {
      app.updateWinningStreak(this.data.continueRight);
      if (this.data.continueRight > this.data.continueMaxRight) {
        this.setData({
          continueMaxRight: this.data.continueRight,
        })
      }
      this.data.continueRight = 0;
    }
    app.saveDataToStorage();
  },

  onHide: function () {
    console.log(' onHide!!!');
    this.cancelTimer();
    this.saveCacheData();
  },
  onUnload: function () {
    console.log("==onUnload==");
    this.cancelTimer();
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
          that.reLoadData();
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
  reLoadData: function () {
    if (this.data.gameOver) {
      this.setData({
        gameOver: false,
        questionIndex: 0,
        continueMaxRight: 0,
      })
      this.data.PAGE = 0;
      this.data.curIndex = 0;
      this.requestQuestionList(this.data.PAGE, this.data.ID);
    } else if (this.data.showModal) {
      this.retryAgain();
    }
  },

  retryAgain: function () {
    this.setData({
      showModal: false,
    });
    this.data.pendEvent = false;
    this.loadNext(200);
  },


  /*

var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录

  */

  // 触摸开始事件  
  touchStart: function (e) {
    console.log("touchStart----:");
    touchDown = e.touches[0].pageX; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    intervalId = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件  
  touchMove: function (e) {
    touchUp = e.touches[0].pageX;
  }, 
  // 触摸结束事件      
  touchEnd: function (e) {
    console.log("touchEnd----:" );
    var touchDelta = touchDown - touchUp;
    console.log("touchDown:" + touchDown + " touchUp:" + touchUp + " time:" + time + " touchDelta:" + touchDelta);

    if (touchUp - touchDown > 0 && touchUp - touchDown <= 250 && time < 5) {
      console.log('向右滑动');
      this.loadNext(10);
    } else if (touchDown - touchUp > 0 && touchDown - touchUp <= 250 && time < 5) {
      console.log('向左滑动');
      this.loadNext(10);
    } else {
      console.log('ignore slide');
    }

    clearInterval(intervalId); // 清除setInterval  
    time = 0;
  },  

})
