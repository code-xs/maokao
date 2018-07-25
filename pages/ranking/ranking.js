const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
Page({
  data: {
    motto: 'MKWZ',
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
    crownlist:[],
    idxbgcolorlist:[],
    page_index:0,
    cateoryID:0,
    myRanking:100,
    showCateoryList:false,
    cateoryTitle:'暂无科目',
    cateoryList:[],
    loading:false,
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
    console.log(app.globalData.commonList);
    this.setData({
      rankingType: 2,
      //datalist: this.data.friendlist,
      myRanking: app.globalData.userRanking,
      cateoryList: app.globalData.commonList,
    });
    if (app.globalData.commonList.length > 0){
      this.setData({
        cateoryTitle: app.globalData.commonList[0].subtitle1,
        cateoryID: app.globalData.commonList[0].subId
      });
    }
    this.getWorldRankingList(0);
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
    if (this.data.rankingType == 2) {
      return;
    }
    this.setData({
      rankingType: 2,
      page_index: 0,
    });
    this.getWorldRankingList(0);
  },
  onClickCateoryRanking: function () {
    if (this.data.rankingType == 3){
      return ;
    }
    this.setData({
      rankingType: 3,
      page_index:0,
    });
    console.log('cateoryID:' + this.data.cateoryID);
    if (this.data.cateoryID > 0){
      this.getCateoryRankingList(0, this.data.cateoryID);
    }else{
      this.setData({
        datalist: [],
      });
    }
  },
  onScrolltolower:function(e){
    if (this.data.rankingType == 2){
      this.setData({
        loading: true,
      });
      this.getWorldRankingList(++this.data.page_index);
    } else if (this.data.rankingType == 3){
      this.setData({
        loading: true,
      });
      this.getCateoryRankingList(++this.data.page_index, this.data.cateoryID);
    }
    /*
    for(var i=0; i< this.data.worlddata.length; i++){
      this.data.datalist.push(this.data.worlddata[i]);
    }
    console.log(e);
    //this.data.datalist.concat(this.data.worlddata);
    this.setData({
      datalist: this.data.datalist,
    });
    console.log(this.data.datalist);
    */
  },
  onScrolltoupper: function (e) {
    console.log(e);
  },

  onClickSelectCateory:function(e){
    this.setData({
      showCateoryList: !this.data.showCateoryList,
    });
  },

  getWorldRankingList: function (index) {
    var that = this;
    qcloud.request({
      url: config.service.getWorldRankingList,
      header: {
        'Content-Type': 'application/json'
      },
      data: {//这里写你要请求的参数
        openId: app.globalData.openId,
        page_index: index,
      },
      success: (response) => {
        console.log('请求成功  getWorldRankingList statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          console.log(response.data);

          if (that.data.page_index ==0){
            this.setData({
              datalist: response.data.data,
            });
          }else{
            for (var i = 0; i < response.data.data.length; i++) {
              this.data.datalist.push(response.data.data[i]);
            }
            this.setData({
              datalist: this.data.datalist,
                loading: false,
            });
          }
          this.data.crownlist = new Array();
          this.data.crownlist[0] = "/images/ic_rank_1.png";
          this.data.crownlist[1] = "/images/ic_rank_2.png";
          this.data.crownlist[2] = "/images/ic_rank_3.png";
        
          this.data.idxbgcolorlist = new Array();
          this.data.idxbgcolorlist[0] = "#FDAF01";
          this.data.idxbgcolorlist[1] = "#DD4E43";
          this.data.idxbgcolorlist[2] = "#00A2FF";

          this.setData({
            crownlist: this.data.crownlist,
            idxbgcolorlist: this.data.idxbgcolorlist,
          });
        }
      },
      fail: function (err) {
        console.log('请求 LevelRule 失败', err);
      }
    });
  },
  getCateoryRankingList: function (index, id) {
    var that = this;
    qcloud.request({
      url: config.service.getRankingList,
      header: {
        'Content-Type': 'application/json'
      },
      data: {//这里写你要请求的参数
        openId: app.globalData.openId,
        page_index: index,
        category_id:id,
      },
      success: (response) => {
        console.log('请求成功  getCateoryRankingList statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          console.log(response.data);
          for (var i = 0; i < response.data.data.length; i++) {
            response.data.data[i].total_score = response.data.data[i].score;
          }
          if (that.data.page_index == 0) {
            this.setData({
              datalist: response.data.data,
            });
          } else {
            for (var i = 0; i < response.data.data.length; i++) {
              this.data.datalist.push(response.data.data[i]);
            }
            this.setData({
              datalist: this.data.datalist,
            });
          }

        }
      },
      fail: function (err) {
        console.log('请求 LevelRule 失败', err);
      }
    });
  },  
  onSelectCateory:function(e){
    console.log('onSelectCateory');
    console.log(e.target.id);
    this.setData({
      showCateoryList: !this.data.showCateoryList,
      page_index: 0,
      cateoryID :e.target.id,
      cateoryTitle: this.data.cateoryList[e.target.dataset.idx].subtitle1,
    });
    this.getCateoryRankingList(0, this.data.cateoryID);
  },

  onSelectDialogClose: function (e) {
    console.log('onSelectDialogClose');
    console.log(e.target.id);
    this.setData({
      showCateoryList: false,
    });
    this.getCateoryRankingList(0, this.data.cateoryID);
  },
})
