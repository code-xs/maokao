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
    this.getCommonCateory();
    this.getCommonStudyCateory();
    this.getCommonCateoryList();
    this.getCommonStudyCateoryList();
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

    commonCateory: {
      id: 0,
      title: "常用",
      src: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/select/category_idx_fav.png',
      color: '#f49967',
      subLevel: [],
    },
    commonStudyCateory: {
      id: 0,
      title: "常用",
      src: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/select/category_idx_fav.png',
      color: '#f49967',
      subLevel: [],
    },

    selectCateory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1: 'none'
    },
    selectStudyCateory: {
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
    console.log(' data score:' + score + ', level:' + level)
    if (this.globalData.rule != null && this.globalData.rule.length > 0) {
      for (var i = 0; i < this.globalData.rule.length; i++) {
        var levels = this.globalData.rule[i];
        for (var j = 0; j < levels.levels.length; j++) {
          console.log(' cur level:' + level)
          var data = levels.levels[j];
          console.log(' data level:' + data.level)
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
    console.log('levels:' + score)
    if (this.globalData.rule != null && this.globalData.rule.length > 0) {
      for (var i = 0; i < this.globalData.rule.length; i++) {
        var levels = this.globalData.rule[i];
        console.log('levels:')
        console.log(levels.levels)
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

  getCateoryList: function() {
    var list = [];
    if (this.globalData.commonCateory.subLevel.length > 0) {
      list.push(this.globalData.commonCateory);
    }
    for (var i in this.globalData.categoryTree) {
      list.push(this.globalData.categoryTree[i]);
    }
    return list;
  },
  getCateoryStudyList: function() {
    console.log('getCateoryStudyList');
    var list = [];
    if (this.globalData.commonStudyCateory.subLevel.length > 0) {
      list.push(this.globalData.commonStudyCateory);
    }
    for (var i in this.globalData.categoryStudyTree) {
      list.push(this.globalData.categoryStudyTree[i]);
    }

    return list;
  },

  getCommonCateory: function() {
    var that = this;
    wx.getStorage({
      key: 'commonCateory',
      success: function(res) {
        console.log("获取 commonCateory 数据成功:");
        that.globalData.commonCateory.subLevel = res.data;
        console.log(that.globalData.commonCateory);
      },
      fail: function(res) {
        console.log("获取 commonCateory 数据失败");
      }
    });
  },
  getCommonStudyCateory: function() {
    var that = this;
    wx.getStorage({
      key: 'commonStudyCateory',
      success: function(res) {
        console.log("获取 commonStudyCateory 数据成功:");
        that.globalData.commonStudyCateory.subLevel = res.data;
        console.log(that.globalData.commonStudyCateory);
      },
      fail: function(res) {
        console.log("获取 commonStudyCateory 数据失败");
      }
    });
  },

  updateCommonCateory: function(id, data) {
    console.log('++++++> updateCommonCateory id:' + id);
    console.log(data);

    var alreadyInCommonPosIdx = -1;
    for (var i = 0; i < this.globalData.commonCateory.subLevel.length; i++) {
      var obj = this.globalData.commonCateory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInCommonPosIdx = i;
        break;
      }
    }

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    if (alreadyInCommonPosIdx < 0) { //not in common at before.
      if (this.globalData.commonCateory.subLevel.length >= 6) {
        this.globalData.commonCateory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonCateory.subLevel) {
        list.push(this.globalData.commonCateory.subLevel[i]);
      }

      this.globalData.commonCateory.subLevel = list;
    } else if (alreadyInCommonPosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.globalData.commonCateory.subLevel.splice(alreadyInCommonPosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonCateory.subLevel) {
        list.push(this.globalData.commonCateory.subLevel[i]);
      }

      this.globalData.commonCateory.subLevel = list;
    }

    wx.setStorage({
      key: 'commonCateory',
      data: this.globalData.commonCateory.subLevel,
    });
    this.updateUserUsedCateoryList(id, data);
  },

  updateCommonStudyCateory: function(id, data) {
    console.log('++++++> updateCommonStudyCateory id:' + id);
    console.log(data);

    var alreadyInCommonPosIdx = -1;
    for (var i = 0; i < this.globalData.commonStudyCateory.subLevel.length; i++) {
      var obj = this.globalData.commonStudyCateory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInCommonPosIdx = i;
        break;
      }
    }

    console.log('  alreadyInCommonPosIdx:' + alreadyInCommonPosIdx);

    if (alreadyInCommonPosIdx < 0) { //not in common at before.
      if (this.globalData.commonStudyCateory.subLevel.length >= 6) {
        this.globalData.commonStudyCateory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonStudyCateory.subLevel) {
        list.push(this.globalData.commonStudyCateory.subLevel[i]);
      }

      this.globalData.commonStudyCateory.subLevel = list;
    } else if (alreadyInCommonPosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.globalData.commonStudyCateory.subLevel.splice(alreadyInCommonPosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.globalData.commonStudyCateory.subLevel) {
        list.push(this.globalData.commonStudyCateory.subLevel[i]);
      }

      this.globalData.commonStudyCateory.subLevel = list;
    }

    wx.setStorage({
      key: 'commonStudyCateory',
      data: this.globalData.commonStudyCateory.subLevel,
    });
    this.updateUserUsedStudyCateoryList(id, data);
  },

  updateUserUsedCateoryList: function(id, data) {
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
      key: 'cateoryList',
      data: this.globalData.commonList,
    });
  },

  updateUserUsedStudyCateoryList: function(id, data) {
    console.log(data);
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
      key: 'cateoryStudyList',
      data: this.globalData.commonStudyList,
    });
  },

  getCommonCateoryList: function() {
    var that = this;
    wx.getStorage({
      key: 'cateoryList',
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
  getCommonStudyCateoryList: function() {
    var that = this;
    wx.getStorage({
      key: 'cateoryStudyList',
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
          return _obj;
        }
      }
    }
    return null;
  },

})