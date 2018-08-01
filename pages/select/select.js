var app = getApp()
var needUpdateFavorite = false;

Page({
  data: {
    frompageid: 0,
    showUpgradeModal: false,
    favoriteList: [],
    favoriteCategory: {
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
    favoriteStudyList: [],
    favoriteStudyCategory: {
      id: 0,
      title: "常用",
      src: 'https://lg-6enwjric-1256925828.cos.ap-shanghai.myqcloud.com/select/category_idx_fav.png',
      color: '#f49967',
      subLevel: [],
    },
    selectStudyCategory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1: 'none'
    },
    categoryTree: [],
    categoryStudyTree: [],
    oldLevel: 0,
  },
  onLoad: function(option) {
    console.log('onLoad  frompageid:' + option.frompageid)
    this.data.oldLevel = app.scoreConvertLevel(app.globalData.totalScore)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a753d6',
    });

    if (option.frompageid == 4) {
      wx.setNavigationBarTitle({
        title: "个人练习"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "个人挑战"
      })
    }

    this.initData(0, option.frompageid);
  },

  initData: function(len, fpid) {
    if (fpid == 4) {
      this.setData({
        frompageid: fpid,
      });
      this.loadFavoriteStudyCategory();
    } else {
      this.setData({
        frompageid: fpid, 
      });
      this.loadFavoriteCategory();
    }
  }, 
 
  loadFavoriteCategory: function () {
    console.log('loadFavoriteCategory'); 
    var that = this;
    wx.getStorage({
      key: 'favoriteCategorySubLevels',
      success: function (res) {
        console.log("获取 favoriteCategorySubLevels 数据成功:");
        that.data.favoriteCategory.subLevel= res.data;
        console.log(that.data.favoriteCategory);

        that.loadFavoriteList();
      },
      fail: function (res) {
        console.log("获取 favoriteCategorySubLevels 数据失败");
        that.loadFavoriteList();
      }
    });
    console.log('loadFavoriteStudyCategory end-----');
  },

  loadFavoriteStudyCategory: function() {
    console.log('loadFavoriteStudyCategory');
    var that = this;
    wx.getStorage({
      key: 'favoriteStudyCategorySubLevels',
      success: function(res) {
        console.log("获取 favoriteStudyCategorySubLevels 数据成功:");
        that.data.favoriteStudyCategory.subLevel = res.data;
        console.log(that.data.favoriteStudyCategory);

        that.loadFavoriteStudyList();
      },
      fail: function(res) {
        console.log("获取 favoriteStudyCategorySubLevels 数据失败");
        that.loadFavoriteStudyList();
      }
    });
    console.log('loadFavoriteStudyCategory end-----');
  },

  loadFavoriteStudyList: function() {
    console.log('loadFavoriteStudyList');
    this.data.categoryStudyTree = [];

    if (this.data.favoriteStudyCategory.subLevel.length > 0) {
      this.data.categoryStudyTree.push(this.data.favoriteStudyCategory);
    }

    for (var i in app.globalData.categoryStudyTree) {
      this.data.categoryStudyTree.push(app.globalData.categoryStudyTree[i]);
    }

    this.setData({
      favoriteStudyCategory: this.data.favoriteStudyCategory,
      favoriteStudyList: this.data.favoriteStudyList,
      categoryStudyTree: this.data.categoryStudyTree,
    });

    console.log('loadFavoriteStudyList  end --------- list');
    console.log(this.data.categoryStudyTree);
  },

  loadFavoriteList: function () {
    console.log('loadFavoriteList');
    this.data.categoryTree = [];

    if (this.data.favoriteCategory.subLevel.length > 0) {
      this.data.categoryTree.push(this.data.favoriteCategory);
    }
    for (var i in app.globalData.categoryTree) {
      this.data.categoryTree.push(app.globalData.categoryTree[i]);
    }
    this.setData({
      favoriteCategory: this.data.favoriteCategory,
      favoriteList: this.data.favoriteList,
      categoryTree: this.data.categoryTree,
    });

    console.log('loadFavoriteList  end --------- list');
    console.log(this.data.categoryTree);
  },

  onSelect: function(e) {
    console.log(' onSelect:' + e.target.id);
    var id = e.target.id;

    if (this.data.frompageid == 4) { //study page
      if (id < 0) {
        this.showModal(true);
        return;
      }

      if (id > 10000) {
        for (var i in this.data.categoryStudyTree[0].subLevel) {
          var item = this.data.categoryStudyTree[0].subLevel[i];

          console.log('id > 10000, item');
          console.log(item);

          if (id == item.id) {

            this.data.selectStudyCategory.id = item.id;
            this.data.selectStudyCategory.subId = item.subId;
            this.data.selectStudyCategory.title = item.title;
            this.data.selectStudyCategory.src = item.src;
            this.data.selectStudyCategory.subtitle = item.subtitle;
            this.data.selectStudyCategory.subtitle1 = item.title;

            this.updateFavoriteStudyCategory(item.id, this.data.selectStudyCategory);

            wx.navigateTo({
              url: '../study/study?id=' + item.subId + '&frompageid=' + this.data.frompageid,
            })
            break;
          }
        }
      } else {
        var obj = this.findCategoryStudyItemById(e.target.id);
        var parentObj = this.findParentCategoryStudyById(e.target.id);
        if (obj.subLevel != null) {

          needUpdateFavorite = true;

          wx.navigateTo({
            url: '../level/level' + '?id=' + obj.id + '&frompageid=' + this.data.frompageid
          })
        } else {
          this.data.selectStudyCategory.id = (10000 + id);
          this.data.selectStudyCategory.subId = id;
          this.data.selectStudyCategory.title = obj.title;
          this.data.selectStudyCategory.src = obj.src;
          this.data.selectStudyCategory.subtitle = obj.subtitle;
          this.data.selectStudyCategory.subtitle1 = obj.title;

          this.updateFavoriteStudyCategory(obj.id, this.data.selectStudyCategory);

          wx.navigateTo({
            url: '../study/study?id=' + obj.id + '&frompageid=' + this.data.frompageid,
          })
        }
      }

    } else {
      if (id < 0) {
        this.showModal(true);
        return;
      }

      if (id > 10000) {
        for (var i in this.data.categoryTree[0].subLevel) {
          var item = this.data.categoryTree[0].subLevel[i];
          if (id == item.id) {

            this.data.selectCategory.id = item.id;
            this.data.selectCategory.subId = item.subId;
            this.data.selectCategory.title = item.title;
            this.data.selectCategory.src = item.src;
            this.data.selectCategory.subtitle = item.subtitle;
            this.data.selectCategory.subtitle1 = item.title;

            this.updateFavoriteCategory(item.id, this.data.selectCategory);

            wx.navigateTo({
              url: '../challenge/challenge?id=' + item.subId,
            })
            break;
          }
        }
      } else {
        var obj = this.findCategoryItemById(e.target.id);
        var partentObj = this.findParentCategoryById(e.target.id);
        console.log('find obj:');
        console.log(obj);
        if (obj.subLevel != null) { 

          needUpdateFavorite = true;

          wx.navigateTo({
            url: '../level/level' + '?id=' + obj.id + '&frompageid=' + this.data.frompageid
          })
        } else {
          console.log(' select:');
          console.log(obj);
          this.data.selectCategory.id = (10000 + id);
          this.data.selectCategory.subId = id;
          this.data.selectCategory.title = obj.title;
          this.data.selectCategory.src = obj.src;
          this.data.selectCategory.subtitle = obj.subtitle;
          this.data.selectCategory.subtitle1 = obj.title;

          this.updateFavoriteCategory(obj.id, this.data.selectCategory);

          wx.navigateTo({
            url: '../challenge/challenge?id=' + obj.id,
          })
        }
      }
    }

    console.log(' onSelect end --------------');
  },
  onClickCloseModal: function() {
    console.log(' onClickCloseModal !');
    this.showModal(false)
  },
  onClickBack: function() {
    this.showModal(false)
  },
  showModal: function(show) {
    this.setData({
      showModal: show,
    })
  },
  onClickOK: function() {
    this.setData({ 
      showUpgradeModal: false,
    })
  },  

  onHide:function() {
    // if (needUpdateFavorite) {
    //   needUpdateFavorite = false;
    //   if(this.data.frompageid == 4) {
    //     this.loadFavoriteStudyList();
    //   } else {
    //     this.loadFavoriteList();
    //   }
    // }
  },

  onShow: function() {
    console.log('onShow')
    console.log('this.data.favoriteStudyCategory');
    console.log(this.data.favoriteStudyCategory);

    if (needUpdateFavorite) {
      needUpdateFavorite = false; 
      if (this.data.frompageid == 4) {
        this.loadFavoriteStudyCategory();
      } else {
        this.loadFavoriteCategory();
      }
    } 

    if (this.data.oldLevel < app.scoreConvertLevel(app.globalData.totalScore)) {
      this.setData({
        showUpgradeModal: true,
      })
    } else if (app.globalData.abortExit) {
      this.showAbortExit();
      app.globalData.abortExit = false;
    }

    console.log('onShow end ----------')
  },
  showAbortExit: function() {
    wx.showModal({
      title: '个人挑战',
      showCancel:false,   
      content: '你已放弃本次挑战!',
      success: function(res) { 
        if (res.confirm) {
          console.log('confirm')
        } 
      } 
    }) 
  },

  updateFavoriteStudyCategory: function(id, data) {
    console.log('++++++> updateFavoriteStudyCategory id:' + id);
    console.log(data);

    needUpdateFavorite = true;

    var alreadyInFavoritePosIdx = -1;

    console.log('favoriteStudyCategory:');
    console.log(this.data.favoriteStudyCategory);

    for (var i = 0; i < this.data.favoriteStudyCategory.subLevel.length; i++) {
      var obj = this.data.favoriteStudyCategory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInFavoritePosIdx = i;
        break;
      }
    }

    console.log('  alreadyInFavoritePosIdx:' + alreadyInFavoritePosIdx);

    if (alreadyInFavoritePosIdx < 0) { //not in common at before.
      if (this.data.favoriteStudyCategory.subLevel.length >= 6) {
        this.data.favoriteStudyCategory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.data.favoriteStudyCategory.subLevel) {
        list.push(this.data.favoriteStudyCategory.subLevel[i]);
      }

      this.data.favoriteStudyCategory.subLevel = list;
    } else if (alreadyInFavoritePosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.data.favoriteStudyCategory.subLevel.splice(alreadyInFavoritePosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.data.favoriteStudyCategory.subLevel) {
        list.push(this.data.favoriteStudyCategory.subLevel[i]);
      }

      this.data.favoriteStudyCategory.subLevel = list;

    }

    this.updateUserUsedStudyCategoryList(id, data);

    wx.setStorage({
      key: 'favoriteStudyCategorySubLevels',
      data: this.data.favoriteStudyCategory.subLevel,
    });
  },

  updateUserUsedStudyCategoryList: function(id, data) {
    console.log('updateUserUsedStudyCategoryList data:');
    console.log(data);
    console.log('favoriteStudyList');
    console.log(this.data.favoriteStudyList);

    var alreadyInFavoritePosIdx = -1;
    for (var i = 0; i < this.data.favoriteStudyList.length; i++) {
      var obj = this.data.favoriteStudyList[i];
      if (obj.subId == (data.subId)) {
        console.log('  find:' + id + ' has already exist!');
        console.log(data);
        alreadyInFavoritePosIdx = i;
        break;
      }
    }

    console.log('  alreadyInFavoritePosIdx:' + alreadyInFavoritePosIdx);

    var list = [];
    if (alreadyInFavoritePosIdx < 0) {
      list.push(data);
      for (var i in this.data.favoriteStudyList) {
        list.push(this.data.favoriteStudyList[i]);
      }
      this.data.favoriteStudyList = list;
    } else if (alreadyInFavoritePosIdx == 0) {
      //no need update.
    } else {
      list.push(data);
      for (var i in this.data.favoriteStudyList) {
        if (i == alreadyInFavoritePosIdx) {
          continue;
        }
        list.push(this.data.favoriteStudyList[i]);
      }
      this.data.favoriteStudyList = list;
    }

    console.log(this.data.favoriteStudyList);
    wx.setStorage({
      key: 'favoriteStudyList',
      data: this.data.favoriteStudyList,
    });
  },  

  updateFavoriteCategory: function (id, data) {
    console.log('++++++> updateFavoriteCategory id:' + id);
    console.log(data);

    needUpdateFavorite = true;

    var alreadyInFavoritePosIdx = -1;

    console.log('favoriteCategory:');
    console.log(this.data.favoriteCategory);

    for (var i = 0; i < this.data.favoriteCategory.subLevel.length; i++) {
      var obj = this.data.favoriteCategory.subLevel[i];
      if (obj.id == (data.id)) {
        alreadyInFavoritePosIdx = i;
        break;
      }
    }

    console.log('  alreadyInFavoritePosIdx:' + alreadyInFavoritePosIdx);

    if (alreadyInFavoritePosIdx < 0) { //not in common at before.
      if (this.data.favoriteCategory.subLevel.length >= 6) {
        this.data.favoriteCategory.subLevel.splice(5, 1);
      }

      var list = [];
      list.push(data);

      for (var i in this.data.favoriteCategory.subLevel) {
        list.push(this.data.favoriteCategory.subLevel[i]);
      }

      this.data.favoriteCategory.subLevel = list;
    } else if (alreadyInFavoritePosIdx == 0) { //already stay at the latest position in common.
      //no need move, evething is ok.
    } else { //stay in common, not the latest one, move to the first position.
      this.data.favoriteCategory.subLevel.splice(alreadyInFavoritePosIdx, 1);

      var list = [];
      list.push(data);

      for (var i in this.data.favoriteCategory.subLevel) {
        list.push(this.data.favoriteCategory.subLevel[i]);
      }

      this.data.favoriteCategory.subLevel = list;

    }

    this.updateUserUsedCategoryList(id, data);

    wx.setStorage({
      key: 'favoriteCategorySubLevels',
      data: this.data.favoriteCategory.subLevel,
    });
  },

  updateUserUsedCategoryList: function (id, data) {
    console.log('updateUserUsedCategoryList data:');
    console.log(data);
    console.log('favoriteList');
    console.log(this.data.favoriteList);

    var alreadyInFavoritePosIdx = -1;
    for (var i = 0; i < this.data.favoriteList.length; i++) {
      var obj = this.data.favoriteList[i];
      if (obj.subId == (data.subId)) {
        console.log('  find:' + id + ' has already exist!');
        console.log(data);
        alreadyInFavoritePosIdx = i;
        break;
      }
    }

    console.log('  alreadyInFavoritePosIdx:' + alreadyInFavoritePosIdx);

    var list = [];
    if (alreadyInFavoritePosIdx < 0) {
      list.push(data);
      for (var i in this.data.favoriteList) {
        list.push(this.data.favoriteList[i]);
      }
      this.data.favoriteList = list;
    } else if (alreadyInFavoritePosIdx == 0) {
      //no need update.
    } else {
      list.push(data);
      for (var i in this.data.favoriteList) {
        if (i == alreadyInFavoritePosIdx) {
          continue;
        }
        list.push(this.data.favoriteList[i]);
      }
      this.data.favoriteList = list;
    }

    console.log(this.data.favoriteList);
    wx.setStorage({
      key: 'favoriteList',
      data: this.data.favoriteList,
    });
  },  

  findCategoryStudyItemById(id) {
    console.log('---findCategoryStudyItemById id:' + id + ' categoryStudyTree:');
    console.log(this.data.categoryStudyTree);
    for (var i = 0; i < this.data.categoryStudyTree.length; i++) {
      var twoLevel = this.data.categoryStudyTree[i].subLevel;
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

  findParentCategoryStudyById(id) {
    console.log('----findParentCategoryStudyById id:' + id);
    for (var i = 0; i < this.data.categoryStudyTree.length; i++) {
      var twoLevel = this.data.categoryStudyTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          var _obj = this.data.categoryStudyTree[i];
          console.log('obj:');
          console.log(_obj);
          console.log('----findParentCategoryStudyById end----');
          return _obj;
        }
      }
    }
    return null;
  },  

  findCategoryItemById(id) {
    for (var i = 0; i < this.data.categoryTree.length; i++) {
      var twoLevel = this.data.categoryTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          return _obj;
        }
      }
    }
  },

  findParentCategoryById(id) {
    for (var i = 0; i < this.data.categoryTree.length; i++) {
      var twoLevel = this.data.categoryTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          return this.data.categoryTree[i];
        }
      }
    }
    return null;
  },
})