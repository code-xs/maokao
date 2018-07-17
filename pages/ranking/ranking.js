//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    empirical:0,
    level:0,
    ranking:0,
    progress:50,
    Height:150,
    empiricalV:0,
    levelV:0,
    windowW:0,
    windowH:0,
    challenge:-1,
    rankingType:1,
    datalist:[],
    list: [{ title: "题目1", content: "内容1" },
    { title: "题目2", content: "内容2" },
    { title: "题目3", content: "内容3" },
    { title: "题目4", content: "内容4" }],
    friendlist: [{
      ranking: 1,
      name: '张三',
      src: '/images/8.png',
      level:'等级:2',
      rate:'50%',
    }, {
      ranking: 2,
      name: '李四',
      src: '/images/5.png',
      level: '等级:4',
      rate: '50%',
    }, {
      ranking: 3,
      name: '王五',
      src: '/images/1.png',
      level: '等级:7',
      rate: '50%',
    }, {
      ranking: 4,
      name: '马六',
      src: '/images/10.png',
      level: '等级:1',
      rate: '50%',
    }, {
      ranking: 10,
      name: '张三',
      src: '/images/8.png',
      level: '等级:2',
      rate: '50%',
    }, {
      ranking: 12,
      name: '李四',
      src: '/images/5.png',
      level: '等级:4',
      rate: '50%',
    }, {
      ranking: 31,
      name: '王五',
      src: '/images/1.png',
      level: '等级:7',
      rate: '50%',
    }, {
      ranking: 14,
      name: '马六',
      src: '/images/10.png',
      level: '等级:1',
      rate: '50%',
    }],
    worlddata: [{
      ranking: 2,
      name: '李四1',
      src: '/images/5.png',
      level: '等级:4',
      rate: '50%',
    }, {
      ranking: 3,
      name: '王五1',
      src: '/images/1.png',
      level: '等级:7',
      rate: '50%',
    }, {
      ranking: 4,
      name: '马六1',
      src: '/images/10.png',
      level: '等级:1',
      rate: '50%',
    }, {
      ranking: 10,
      name: '张三1',
      src: '/images/8.png',
      level: '等级:2',
      rate: '50%',
    }, {
      ranking: 12,
      name: '李四2',
      src: '/images/5.png',
      level: '等级:4',
      rate: '50%',
    }, {
      ranking: 31,
      name: '王五3',
      src: '/images/1.png',
      level: '等级:7',
      rate: '50%',
    }, {
      ranking: 14,
      name: '马六4',
      src: '/images/10.png',
      level: '等级:1',
      rate: '50%',
    }],    
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
      backgroundColor: '#bb6ed5',
    });    
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
    this.setData({
      rankingType: 1,
      datalist: this.data.friendlist
    });    
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
    ctx.setStrokeStyle('');
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.stroke()
  },
  drawCircle: function (ctx, x, y) {
    ctx.beginPath();
    ctx.setFillStyle('#eec700');
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill()
  },
  onClickFriendRanking:function(){
    this.setData({
      rankingType:1,
      datalist: this.data.friendlist
    });
  },
  onClickWorldRanking: function () {
    this.setData({
      rankingType: 2,
      datalist: this.data.worlddata,
    });
  },
  onClickTypeRanking: function () {
    this.setData({
      rankingType: 3
    });
  },
  onScrolltolower:function(e){
    for(var i=0; i< this.data.worlddata.length; i++){
      this.data.datalist.push(this.data.worlddata[i]);
    }
    console.log(e);
    //this.data.datalist.concat(this.data.worlddata);
    this.setData({
      datalist: this.data.datalist,
    });
    console.log(this.data.datalist);
  },
  onScrolltoupper: function (e) {
    console.log(e);
  }
})
