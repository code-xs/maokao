var app = getApp()
Page({
  data: {
    frompageid: 0,
    level:[],
    CLASS:[],
    CLASSID:[],
    selectClass:null,
    selectLevel:null,
    isClass:true,
    TREE:null,
    commonList: [],
    selectCateory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle:"none",
      subtitle1: "none",
    },
    commonStudyList: [],
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
    this.initData(option.id, option.frompageid);
  },
  initData: function (id, fpid){
    var that = this;
    var classes ;
    
    if(fpid == 4) {
      classes = app.findCategoryStudyItemById(id);
    } else {
      classes = app.findCategoryItemById(id);
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
        key: 'commonStudyCateory',
        success: function (res) {
          console.log("获取 commonStudyCateory 数据成功:");
          that.data.commonStudyList = res.data;
          console.log(that.data.commonStudyList);
        },
        fail: function (res) {
          console.log("获取 commonStudyCateory 数据失败");
        }
      });
    } else {
      wx.getStorage({
        key: 'commonCateory',
        success: function (res) {
          console.log("获取 commonCateory 数据成功:");
          that.data.commonList = res.data;
          console.log(that.data.commonList);
        },
        fail: function (res) {
          console.log("获取 commonCateory 数据失败");
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
      app.updateCommonStudyCateory(id, this.data.selectStudyCateory);
      wx.redirectTo({
        url: '../study/study?id=' + id,
      })
    } else {
      this.data.selectCateory.id = (10000 + id);
      this.data.selectCateory.subId = id;
      this.data.selectCateory.title = this.data.TREE.title;
      this.data.selectCateory.src = this.data.TREE.src;
      this.data.selectCateory.subtitle = this.data.TREE.subtitle;
      this.data.selectCateory.subtitle1 = this.data.selectCateory.title + title;
      console.log('  open challenge with param id:' + id);
      console.log(this.data.selectCateory);
      app.updateCommonCateory(id, this.data.selectCateory);
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
  }
})