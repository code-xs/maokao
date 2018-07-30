//app.js

var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

App({
  onLaunch: function() {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    qcloud.setLoginUrl(config.service.loginUrl);
    this.doLogin();
    this.getUserInfo();
    this.getLevelRule();
    this.getCategory(); 
    this.getDataFromStorage();
    this.getCommonCategory();
    this.getCommonStudyCategory();
    this.getCommonCategoryList();
    this.getCommonStudyCategoryList();
    this.getShareTargeOpenGId();
  },

  doLogin() { //登录
    let that = this
    //util.showBusy('正在登录');
    qcloud.login({
      success(result) { //此处的result竟然不包含openid,所以res取缓存中的数据
        console.log('登录成功-----')
        let res = wx.getStorageSync('user_info_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A');
        console.log('openId:' + res.openId)
        that.globalData.openId = res.openId;
        console.log(res)
        that.getScoreInfo();
      },
      fail(error) {
        console.log('登录失败', error);
      }
    });
  },

  globalData: {
    userInfo: null,
    openId: null,
    userRanking: 999999,
    totalScore: 0,
    total: 10000,
    level: 0,
    categoryTree: null,
    categoryStudyTree: null,
    rate: 0,
    rule: null,
    openGids:[],
    updateScoreInfoCallBack: null,
    scoreInfo: {
      totalScore: 0,
      experience: 0,
      worldRanking: 0,
      total: 0
    },
    achievementDetail: {
      totalChallenge: 0,
      winningStreak: 0,
      maxScore: 0, 
      totalInvitation: 0,
      invitationWin: 0,
      invitationWinRate: 0,
    },
    commonList: [],
    commonStudyList: [],

    commonCategory: {
      id: 0,
      title: "常用",
      src: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/select/category_idx_fav.png',
      color: '#f49967',
      subLevel: [],
    },
    commonStudyCategory: {
      id: 0,
      title: "常用",
      src: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/select/category_idx_fav.png',
      color: '#f49967',
      subLevel: [],
    },

    selectCategory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1: 'none'
    },
    selectStudyCategory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1: 'none'
    },

    abortExit: false,
  },
  setUserInfo: function(res) {
    console.log('setUserInfo:')
    console.log(res)
    this.globalData.userInfo = res.userInfo;
  },
  getUserInfo: function() {
    // 获取用户信息
    console.log('getUserInfo!')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  requestQuestionList: function(page, id) {
    var that = this;
    console.log('enter  requestQuestionList');
    qcloud.request({
      url: config.service.requestQuestionList,
      header: {
        'content-type': 'application/json'
      },
      data: { //这里写你要请求的参数
        category_id: 10,
        page_index: 0
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        console.log(response.data.data);
      },
      fail: function(err) {
        conssole.log('请求失败23', err);
      }
    });
  },
  getScoreInfo: function() {
    var that = this;
    qcloud.request({
      url: config.service.getScoreInfo,
      header: {
        'Content-Type': 'application/json'
      },
      data: { //这里写你要请求的参数
        openId: that.globalData.openId,
      },
      success: (response) => {
        console.log('请求 getScoreInfo 成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          that.globalData.scoreInfo = response.data.data;
          console.log(response.data.data);
          that.globalData.totalScore = that.globalData.scoreInfo.totalScore;
          that.globalData.userRanking = that.globalData.scoreInfo.worldRanking;
          that.globalData.total = that.globalData.scoreInfo.total;
          console.log('updateScoreInfoCallBack total:' + that.globalData.total);
          console.log(that.globalData.updateScoreInfoCallBack)
          if (that.globalData.updateScoreInfoCallBack != null) {
            that.globalData.updateScoreInfoCallBack(that.globalData.scoreInfo);
          }
        }
      },
      fail: function(err) {
        console.log('请求失败', err);
      }
    });
  },
  getLevelRule: function() {
    var that = this;
    qcloud.request({
      url: config.service.getLevelRule,
      header: {
        'Content-Type': 'application/json'
      },
      data: { //这里写你要请求的参数
        openId: that.globalData.openId,
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          console.log(response.data.data);
          that.globalData.rule = response.data.data;
          console.log(that.globalData.rule);
        }
      },
      fail: function(err) {
        console.log('请求 LevelRule 失败', err);
      }
    });
  },
  getWorldRankingList: function() {
    var that = this;
    qcloud.request({
      url: config.service.getWorldRankingList,
      header: {
        'Content-Type': 'application/json'
      },
      data: { //这里写你要请求的参数
        openId: that.globalData.openId,
      },
      success: (response) => {
        console.log('请求成功  getWorldRankingList statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          console.log(response.data);
        }
      },
      fail: function(err) {
        console.log('请求 LevelRule 失败', err);
      }
    });
  },
  getRankingList: function(id) {
    var that = this;
    qcloud.request({
      url: config.service.getRankingList,
      header: {
        'Content-Type': 'application/json'
      },
      data: { //这里写你要请求的参数
        openId: that.globalData.openId,
        typeId: id,
      },
      success: (response) => {
        console.log('请求成功 statusCode:' + response.statusCode);
        if (response.statusCode == 0) {
          console.log(response);
        }
      },
      fail: function(err) {
        console.log('请求 LevelRule 失败', err);
      }
    });
  },
  getNextLevelScoreGap: function(score, level) {
    if (this.globalData.rule != null && this.globalData.rule.length > 0) {
      for (var i = 0; i < this.globalData.rule.length; i++) {
        var levels = this.globalData.rule[i];
        for (var j = 0; j < levels.levels.length; j++) {
          var data = levels.levels[j];
          if (level == data.level) {
            return data.score - score;
          }
        }
      }
    }
    return 1;
  },
  scoreConvertLevel: function(score) {
    var level = 0;
    if (this.globalData.rule != null && this.globalData.rule.length > 0) {
      for (var i = 0; i < this.globalData.rule.length; i++) {
        var levels = this.globalData.rule[i];
        for (var j = 0; j < levels.levels.length; j++) {
          var data = levels.levels[j];
          if (score <= data.score) {
            return data.level - 1;
          }
        }
      }
    }
    return level;
  },
  addChallengeCnt: function(num) {
    this.globalData.achievementDetail.totalChallenge += num;
    console.log('update achievementDetail:' + this.globalData.achievementDetail.totalChallenge);
  },
  updateWinningStreak: function(num) {
    if (this.globalData.achievementDetail.winningStreak < num)
      this.globalData.achievementDetail.winningStreak = num;
  },
  updateMaxScore: function(score) {
    if (this.globalData.achievementDetail.maxScore < score)
      this.globalData.achievementDetail.maxScore = score;
    if (score > 0) {
      this.globalData.totalScore += score;
      if (this.globalData.updateScoreInfoCallBack != null) {
        this.globalData.updateScoreInfoCallBack(this.globalData.scoreInfo);
      }
    }
  },
  addTotalInvitation: function(num) {
    console.log(this.globalData.achievementDetail.totalInvitation);
    this.globalData.achievementDetail.totalInvitation += num;
    console.log(this.globalData.achievementDetail.totalInvitation);
  },
  addInvitationWin: function(num) {
    return this.globalData.achievementDetail.invitationWin += num;
  },
  updateInvitationWinRate: function() {
    this.globalData.achievementDetail.invitationWinRate = (this.globalData.achievementDetail.invitationWin * 100 / this.globalData.achievementDetail.totalInvitation)
  },
  saveDataToStorage: function() {
    console.log('save achievementDetail:');
    console.log(this.globalData.achievementDetail);
    wx.setStorage({
      key: 'achievementDetail',
      data: this.globalData.achievementDetail,
    });
  },
  getDataFromStorage: function() {
    var that = this;
    wx.getStorage({
      key: 'achievementDetail',
      success: function(res) {
        console.log("获取 achievementDetail 数据成功:");
        console.log(res.data);
        that.globalData.achievementDetail = res.data;
      },
      fail: function(res) {
        console.log("获取 achievementDetail 数据失败");
      }
    });
    /*
    var data = wx.getStorageSync('achievementDetail');
    console.log('data:');
    console.log(data);
    if(!data){
      console.log('set achievementDetail');
      //this.globalData.achievementDetail = data;
    }
    console.log('get achievementDetail:');
    console.log(this.globalData.achievementDetail);
    */
  },
  setUpdateRankingCallBack: function(cb) {
    if (typeof cb == "function") {
      this.globalData.updateScoreInfoCallBack = cb;
    } else {
      console.log(' setUpdateRankingCallBack param is unvalid!')
    }
  },
  uploadScoreInfo: function(id, score) {
    var that = this;
    console.log('uploadScoreInfo id:' + id + ', score:' + score);
    qcloud.request({
      url: config.service.updateScoreInfo,
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: { //这里写你要请求的参数
        openId: that.globalData.openId,
        total_score: that.globalData.totalScore,
        category_id: id,
        current_score: score,
        user_experience: 10,
      },
      success: (response) => {
        console.log('上传 uploadScoreInfo 成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          console.log(response.data.data);
          console.log(response.data.code);
        }
      },
      fail: function(err) {
        console.log('请求 uploadScoreInfo 失败', err);
      }
    });
  },

  getCategory: function() {
    console.log("getCategory");
    var that = this;
    qcloud.request({
      url: config.service.requestCategory,
      login: false,
      header: {
        'Content-Type': 'application/json'
      },
      success: (response) => {
        console.log('请求挑战类别成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          that.globalData.categoryTree = response.data.data;
        }
        console.log(that.globalData.categoryTree);
      },
      fail: function(err) {
        console.log('请求挑战类别失败', err);
      }
    });

    qcloud.request({
      url: config.service.requestStudyCategory,
      login: false,
      header: {
        'Content-Type': 'application/json'
      },
      success: (response) => {
        console.log('请求学习类别成功 statusCode:' + response.statusCode);
        if (response.statusCode == 200) {
          that.globalData.categoryStudyTree = response.data.data;
        }
        console.log(that.globalData.categoryStudyTree);
      },
      fail: function(err) {
        console.log('请求学习类别失败', err);
      }
    });
  },

  getCategoryList: function() {
    console.log('getCategoryList');
    var list = [];
    if (this.globalData.commonCategory.subLevel.length > 0) {
      list.push(this.globalData.commonCategory);
    }
    for (var i in this.globalData.categoryTree) {
      list.push(this.globalData.categoryTree[i]);
    }
    return list;
  },
  getCategoryStudyList: function() {
    console.log('getCategoryStudyList');
    var list = [];
    if (this.globalData.commonStudyCategory.subLevel.length > 0) {
      list.push(this.globalData.commonStudyCategory);
    }
    for (var i in this.globalData.categoryStudyTree) {
      list.push(this.globalData.categoryStudyTree[i]);
    }

    console.log('categoryStudyTree');
    console.log(list);
    return list;
  }, 

  getCommonCategory: function() {
    var that = this;
    wx.getStorage({
      key: 'commonCategory',
      success: function(res) {
        console.log("获取 commonCategory 数据成功:");
        that.globalData.commonCategory.subLevel = res.data;
        console.log(that.globalData.commonCategory);
      },
      fail: function(res) {
        console.log("获取 commonCategory 数据失败");
      } 
    });
  },
  getCommonStudyCategory: function() {
    var that = this;
    wx.getStorage({ 
      key: 'commonStudyCategory',
      success: function(res) {
        console.log("获取 commonStudyCategory 数据成功:");
        that.globalData.commonStudyCategory.subLevel = res.data;
        console.log(that.globalData.commonStudyCategory);
      }, 
      fail: function(res) {
        console.log("获取 commonStudyCategory 数据失败");
      }
    });
  }, 

  updateCommonCategory: function(id, data) {
    console.log('++++++> updateCommonCategory id:' + id);
    console.log(data);

    var alreadyInCommonPosIdx = -1;
    for (var i = 0; i < this.globalData.commonCategory.subLevel.length; i++) {
      var obj = this.globalData.commonCategory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInCommonPosIdx = i;
        break;
      }
    }

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    if (alreadyInCommonPosIdx < 0) { //not in common at before.
      if (this.globalData.commonCategory.subLevel.length >= 6) {
        this.globalData.commonCategory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonCategory.subLevel) {
        list.push(this.globalData.commonCategory.subLevel[i]);
      }

      this.globalData.commonCategory.subLevel = list;
    } else if (alreadyInCommonPosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.globalData.commonCategory.subLevel.splice(alreadyInCommonPosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonCategory.subLevel) {
        list.push(this.globalData.commonCategory.subLevel[i]);
      }

      this.globalData.commonCategory.subLevel = list;
    }

    wx.setStorage({
      key: 'commonCategory',
      data: this.globalData.commonCategory.subLevel,
    });
    this.updateUserUsedCategoryList(id, data);
  },    
    
  updateCommonStudyCategory: function(id, data) {
    console.log('++++++> updateCommonStudyCategory id:' + id);
    console.log(data);
   
    var alreadyInCommonPosIdx = -1;

    console.log('commonStudyCategory:');
    console.log(this.globalData.commonStudyCategory);

    for (var i = 0; i < this.globalData.commonStudyCategory.subLevel.length; i++) {
      var obj = this.globalData.commonStudyCategory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInCommonPosIdx = i;
        break;
      }
    }

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    if (alreadyInCommonPosIdx < 0) { //not in common at before.
      if (this.globalData.commonStudyCategory.subLevel.length >= 6) {
        this.globalData.commonStudyCategory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonStudyCategory.subLevel) {
        list.push(this.globalData.commonStudyCategory.subLevel[i]);
      }

      this.globalData.commonStudyCategory.subLevel = list;
    } else if (alreadyInCommonPosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.globalData.commonStudyCategory.subLevel.splice(alreadyInCommonPosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonStudyCategory.subLevel) {
        list.push(this.globalData.commonStudyCategory.subLevel[i]);
      }

      this.globalData.commonStudyCategory.subLevel = list;
    }

    wx.setStorage({
      key: 'commonStudyCategory',
      data: this.globalData.commonStudyCategory.subLevel,
    });
    this.updateUserUsedStudyCategoryList(id, data);
  },

  updateUserUsedCategoryList: function(id, data) {
    console.log(data);
    var alreadyInCommonPosIdx = -1;
    for (var i = 0; i < this.globalData.commonList.length; i++) {
      var obj = this.globalData.commonList[i];
      if (obj.subId == (data.subId)) {
        console.log('  find:' + id + ' has already exist!');
        console.log(data);
        alreadyInCommonPosIdx = i;
        break;
      }
    }

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    var list = [];
    if (alreadyInCommonPosIdx < 0) {
      list.push(data);
      for (var i in this.globalData.commonList) {
        list.push(this.globalData.commonList[i]);
      }
      this.globalData.commonList = list;
    } else if (alreadyInCommonPosIdx == 0) {
      //no need update.
    } else {
      list.push(data);
      for (var i in this.globalData.commonList) {
        if (i == alreadyInCommonPosIdx) {
          continue;
        }
        list.push(this.globalData.commonList[i]);
      }
      this.globalData.commonList = list;
    }

    console.log(this.globalData.commonList);
    wx.setStorage({
      key: 'categoryList',
      data: this.globalData.commonList,
    });
  },
  
  updateUserUsedStudyCategoryList: function(id, data) {
    console.log('updateUserUsedStudyCategoryList data:');
    console.log(data);
    console.log('commonStudyList');
    console.log(this.globalData.commonStudyList);
    var alreadyInCommonPosIdx = -1;
    for (var i = 0; i < this.globalData.commonStudyList.length; i++) {
      var obj = this.globalData.commonStudyList[i];
      if (obj.subId == (data.subId)) {
        console.log('  find:' + id + ' has already exist!');
        console.log(data);
        alreadyInCommonPosIdx = i;
        break; 
      }
    } 

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    var list = [];
    if (alreadyInCommonPosIdx < 0) { 
      list.push(data);
      for (var i in this.globalData.commonStudyList) {
        list.push(this.globalData.commonStudyList[i]);
      }
      this.globalData.commonStudyList = list;
    } else if (alreadyInCommonPosIdx == 0) {
      //no need update.
    } else {
      list.push(data);
      for (var i in this.globalData.commonStudyList) {
        if (i == alreadyInCommonPosIdx) {
          continue;
        }
        list.push(this.globalData.commonStudyList[i]);
      }  
      this.globalData.commonStudyList = list;
    }
          
    console.log(this.globalData.commonStudyList);
    wx.setStorage({
      key: 'categoryStudyList',
      data: this.globalData.commonStudyList,
    });
  }, 

  getCommonCategoryList: function() {
    var that = this;
    wx.getStorage({
      key: 'categoryList',
      success: function(res) {
        console.log("获取 commonList 数据成功:");
        that.globalData.commonList = res.data;
        console.log(that.globalData.commonList);
      },
      fail: function(res) {
        console.log("获取 commonList 数据失败");
      }
    });
  },
  getCommonStudyCategoryList: function() {
    var that = this;
    wx.getStorage({
      key: 'categoryStudyList',
      success: function(res) {
        console.log("获取 commonStudyList 数据成功:");
        that.globalData.commonStudyList = res.data;
        console.log(that.globalData.commonStudyList);
      },
      fail: function(res) {
        console.log("获取 commonStudyList 数据失败");
      }
    });
  },

  findCategoryItemById(id) {
    for (var i = 0; i < this.globalData.categoryTree.length; i++) {
      var twoLevel = this.globalData.categoryTree[i].subLevel;
      console.log('twoLevel:');
      console.log(twoLevel);
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        console.log('obj:');
        console.log(_obj);
        if (_obj.id == id) {
          return _obj;
        }
      }
    } 
  },
  findCategoryStudyItemById(id) {
    console.log('---findCategoryStudyItemById id:' + id + ' categoryStudyTree:');
    console.log(this.globalData.categoryStudyTree);
    for (var i = 0; i < this.globalData.categoryStudyTree.length; i++) {
      var twoLevel = this.globalData.categoryStudyTree[i].subLevel;
      console.log('twoLevel:');
      console.log(twoLevel);
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          console.log('obj:');
          console.log(_obj);
          console.log('---findCategoryStudyItemById end ---');
          return _obj;
        }
      }
    }
  },
  findParentCategoryById(id) {
    for (var i = 0; i < this.globalData.categoryTree.length; i++) {
      var twoLevel = this.globalData.categoryTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          return this.globalData.categoryTree[i];
        }
      }
    }
    return null;
  },
  findParentCategoryStudyById(id) {
    console.log('----findParentCategoryStudyById id:' + id);
    for (var i = 0; i < this.globalData.categoryStudyTree.length; i++) {
      var twoLevel = this.globalData.categoryStudyTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          var _obj = this.globalData.categoryStudyTree[i];
          console.log('obj:');
          console.log(_obj);
          console.log('----findParentCategoryStudyById end----' );
          return _obj;
        }
      }
    }
    return null;
  },
  addShareTargeOpenGId: function (TYPE, openGid) {
    for (var i in this.globalData.openGids){
      if (openGid == this.globalData.openGids[i]){
        console.log('has exist gid:' + openGid)
        console.log(openGid)
        return false;
      }
    }
    wx.showToast({
      title: '获得100经验值',
    })
    this.globalData.totalScore += 100;
    if (this.globalData.updateScoreInfoCallBack != null) {
      this.globalData.updateScoreInfoCallBack(this.globalData.scoreInfo);
    }
    console.log('addShareTargeOpenGId:' + openGid)
    this.globalData.openGids.push(openGid);
    wx.setStorage({
      key: 'openGids',
      data: this.globalData.openGids,
    });
    return true;
  },
  getShareTargeOpenGId:function(){
    var that = this;
    wx.getStorage({
      key: 'openGids',
      success: function (res) {
        console.log("获取 openGids 数据成功:");
        console.log(res.data);
        that.globalData.openGids = res.data;
        console.log(that.globalData.openGids);
      },
      fail: function (res) {
        console.log("获取 openGids 数据失败");
      }
    });
  },
  getShareTicket: function (res) {
    var that = this;
    wx.getSystemInfo({
      success: function (d) {
        console.log('data:');
        console.log(d);
        //判断用户手机是IOS还是Android
        if (d.platform == 'android') {
          wx.getShareInfo({//获取群详细信息
            shareTicket: res.shareTickets,
            success: function (res) {
              console.log('shareTickets:');
              console.log(res);
              that.getOpenGId(res);
            },
            fail: function (res) {//这个方法就是分享到的是好友，给一个提示
              console.log('fail shareTickets:');
              console.log(res);
            }
          })
        } else if (d.platform == 'ios') {//如果用户的设备是IOS
          if (res.shareTickets != undefined) {
            console.log("分享的是群");
            wx.getShareInfo({
              shareTicket: res.shareTickets,
              success: function (res) {
                //分享到群之后你要做的事情
                that.getOpenGId(res);
              }
            })
          } else {//分享到个人要做的事情，我给的是一个提示
            console.log("分享的是个人");
            /*wx.showModal({
              title: '提示',
              content: '分享好友无效，请分享群',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })*/
          }
        } else {
          wx.getShareInfo({//获取群详细信息
            shareTicket: res.shareTickets,
            success: function (res) {
              console.log('shareTickets:');
              console.log(res);
              var iv = res.iv
              console.log('openId:')
              console.log("" + that.globalData.openId)

              console.log(JSON.stringify(res.encryptedData))
              that.getOpenGId(res);
            },
            fail: function (res) {//这个方法就是分享到的是好友，给一个提示
              console.log('fail shareTickets:');
              console.log(res);
              wx.showModal({
                title: '提示',
                content: '分享好友无效，请分享群',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  getOpenGId: function (res) {
    var that = this;
    console.log('openId:')
    console.log("" + that.globalData.openId)
    wx.request({
      url: config.service.getGID,
      data: {
        encryptedData: res.encryptedData,
        iv: JSON.stringify(res.iv),
        appId: 'wx7cf81d27e6c79640',
        openId: that.globalData.openId,
      },
      success: function (res) {
        console.log(res.data)
        var openGId = res.data.data.openGId
        var ret = that.addShareTargeOpenGId(0, openGId);
        if(ret){
          that.uploadScoreInfo(24, 0);
        }
      },
      fail: function (res) {
        console.log('fail get user OpenGid!!!');
        console.log(res);
      }
    })
  },
})