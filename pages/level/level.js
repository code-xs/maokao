var app = getApp()
Page({
  data: {
    frompageid: 0,
    level:[],
    CLASS:[],
    CLASSID:[],
    categoryTree: [],
    categoryStudyTree: [],
    selectClass:null,
    selectLevel:null,
    isClass:true,
    TREE:null,
    favoriteList: [],
    selectCateory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle:"none",
      subtitle1: "none",
    },
    favoriteStudyList: [],
    selectStudyCateory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1: "none",
    },
  },
  onLoad: function (option) {
    console.log('onLoad option.id:' + option.id+' frompageid:' + option.frompageid)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bf70d6',
    });

    if (option.frompageid == 4) {
      this.loadFavoriteStudyCategory();
    } else {
      this.loadFavoriteCategory();
    }

    this.initData(option.id, option.frompageid);
  },
  initData: function (id, fpid){
    var that = this;
    var classes ;
    
    if(fpid == 4) {
      classes = this.findCategoryStudyItemById(id);
    } else {
      classes = this.findCategoryItemById(id);
    }
    
    console.log("classes:");
    console.log(classes);
    console.log('initData classes.length:' + classes.subLevel.length)
    for (var i = 0; i < classes.subLevel.length; i++) {
      var obj = classes.subLevel[i];
      this.data.CLASS.push(obj.title);
      this.data.CLASSID.push(obj.id);
    }
    this.setData({
      CLASS: this.data.CLASS,
      CLASSID: this.data.CLASSID,
      TREE:classes,
      frompageid: fpid,
    });
    console.log("CLASS:" + this.data.CLASS + ' class len:'+this.data.CLASS.length);
    
    if (fpid == 4) {
      wx.getStorage({
        key: 'favoriteStudyCateory',
        success: function (res) {
          console.log("获取 favoriteStudyCateory 数据成功:");
          that.data.favoriteStudyList = res.data;
          console.log(that.data.favoriteStudyList);
        },
        fail: function (res) {
          console.log("获取 favoriteStudyCateory 数据失败");
        }
      });
    } else {
      wx.getStorage({
        key: 'favoriteCateory',
        success: function (res) {
          console.log("获取 favoriteCateory 数据成功:");
          that.data.favoriteList = res.data;
          console.log(that.data.favoriteList);
        },
        fail: function (res) {
          console.log("获取 favoriteCateory 数据失败");
        }
      });
    }
  },

  resetData: function (value) {
    console.log('resetData value:'+value);
    this.data.CLASS = [];
    this.data.CLASSID = [];
    for (var i = 0; i < value.length; i++) {
      this.data.CLASS.push(value[i].title);
      this.data.CLASSID.push(value[i].id);
    }
    this.setData({
      CLASS: this.data.CLASS,
      CLASSID: this.data.CLASSID
    });
    console.log("CLASS:" + this.data.CLASS + this.data.CLASS.length);
  },

  onLevelSelect:function(e){
    console.log(' onLevelSelect:'+e.target.id);
    var pullID = -1;
    var title = null;
    var id = e.target.id;
    var tree = this.data.TREE.subLevel;
    for (var i = 0; i < tree.length; i++) {
      var obj = tree[i];
      console.log(' onLevelSelect title:' + obj.title + ' obj.id:' + obj.id);
      if (id == obj.id){
        if (obj.subLevel != null && obj.subLevel.length > 0){
          var subObj = obj.subLevel;
          this.resetData(subObj);
          return;
        }else{
          pullID = id;
          title = obj.title;
          break;
        }
      }

      var subObj = obj.subLevel;
      if(subObj == null)
        continue;

      for (var j = 0; j < subObj.length; j++) {
        var obj2 = subObj[j];
        console.log(' subLevel title:' + obj2.title + ' obj.id:' + obj2.id);
        if (id == obj2.id) {
          pullID = id;
          title = obj2.title;
          break;
        }
      }
      if (pullID > 0){
        break;
      }
    } 

    if (this.data.frompageid == 4) {
      this.data.selectStudyCateory.id = (10000 + id);
      this.data.selectStudyCateory.subId = id;
      this.data.selectStudyCateory.title = this.data.TREE.title;
      this.data.selectStudyCateory.src = this.data.TREE.src;
      this.data.selectStudyCateory.subtitle = this.data.TREE.subtitle;
      this.data.selectStudyCateory.subtitle1 = title;

      console.log('  open study with param id:' + id);
      console.log(this.data.selectStudyCateory);

      this.updateFavoriteStudyCateory(id, this.data.selectStudyCateory);

      wx.redirectTo({
        url: '../study/study?id=' + id,
      })
    } else {
      this.data.selectCateory.id = (10000 + id);
      this.data.selectCateory.subId = id;
      this.data.selectCateory.title = this.data.TREE.title;
      this.data.selectCateory.src = this.data.TREE.src;
      this.data.selectCateory.subtitle = this.data.TREE.subtitle;
      this.data.selectCateory.subtitle1 = title;

      console.log('  open challenge with param id:' + id);
      console.log(this.data.selectCateory);

      this.updateFavoriteCateory(id, this.data.selectCateory);

      wx.redirectTo({
        url: '../challenge/challenge?id=' + id,
      })
    }
  },

  navigateBackFunc: function (level) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.setData({
      selectLevel: level
    })
    wx.navigateBack();
  },

  updateFavoriteStudyCategory: function (id, data) {
    console.log('++++++> updateFavoriteStudyCategory id:' + id);
    console.log(data);

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
      key: 'favoriteStudyCategory',
      data: this.data.favoriteStudyCategory.subLevel,
    });
  },

  updateUserUsedStudyCategoryList: function (id, data) {
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
      key: 'categoryStudyList',
      data: this.data.favoriteStudyList,
    });
  },

  updateFavoriteCategory: function (id, data) {
    console.log('++++++> updateFavoriteCategory id:' + id);
    console.log(data);

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
      key: 'favoriteCategory',
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
      key: 'categoryList',
      data: this.data.favoriteList,
    });
  },  

  loadFavoriteStudyCategory: function () {
    console.log('loadFavoriteStudyCategory');
    var that = this;
    wx.getStorage({
      key: 'favoriteStudyCategory',
      success: function (res) {
        console.log("获取 favoriteStudyCategory 数据成功:");
        that.data.favoriteStudyCategory.subLevel = res.data;
        console.log(that.data.favoriteStudyCategory);

        that.loadFavoriteStudyList();
      },
      fail: function (res) {
        console.log("获取 favoriteStudyCategory 数据失败");
        that.loadFavoriteStudyList();
      }
    });
    console.log('loadFavoriteStudyCategory end-----');
  },

  loadFavoriteStudyList: function () {
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

  findCategoryStudyItemById(id) {
    for (var i = 0; i < this.data.categoryStudyTree.length; i++) {
      var twoLevel = this.data.categoryStudyTree[i].subLevel;
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        if (_obj.id == id) {
          return _obj;
        }
      }
    }
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

})