Page({
  data: {
    level:[],
    CLASS:[],
    CLASSID:[],
    selectClass:null,
    selectLevel:null,
    isClass:true,
    TREE:null,
  },
  onLoad: function (option) {
    console.log('onLoad:'+option.class)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bf70d6',
    });
    this.initData(option);
  },
  initData: function (option){
    var classes = JSON.parse(option.class);
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
    });
    console.log("CLASS:" + this.data.CLASS + ' class len:'+this.data.CLASS.length);
  },

  resetData: function (value) {
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
          break;
        }
      }
      if (pullID > 0){
        break;
      }
    }
    console.log('  open challenge with param id:'+id);
    wx.navigateTo({
      url: '../challenge/challenge?id='+id,
    })
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