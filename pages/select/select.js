var app = getApp()
Page({
  data: {
    showModal:false,
    showExitModal:false,
    categoryTree: [],
    selectCateory: {
      id: 0,
      title: "none",
      subId: 0,
      src: null,
      subtitle: "none",
      subtitle1:'none'
    },
  },
  onLoad: function (option) {
    console.log('onLoad')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a753d6',
    });
    this.initData(0); 
  },
  initData:function(len){
    var that = this;
    this.setData({
      categoryTree: app.getCateoryList(),
    });
  },

  onSelect:function(e){
    console.log(' onLevelSelect:'+e.target.id);
    var id = e.target.id;
    if(id < 0){
      this.showModal(true);
      return;
    }
    if (id > 10000){
      for (var i in this.data.categoryTree[0].subLevel){
        var item = this.data.categoryTree[0].subLevel[i];
        console.log(item);
        if (id == item.id){
          wx.navigateTo({
            url: '../challenge/challenge?id=' + item.subId,
          })
          break;
        }
      }
    }else{
      var obj = app.findCategoryItemById(e.target.id);
      console.log('find obj:');
      console.log(JSON.stringify(obj));    
      if (obj.subLevel != null){
        wx.navigateTo({
          url: '../level/level' + '?id=' + obj.id
        })
      }else{
        console.log(' select:');
        console.log(obj);
        this.data.selectCateory.id = (10000 + obj.id);
        this.data.selectCateory.subId = id;
        this.data.selectCateory.title = obj.title;
        this.data.selectCateory.src = obj.src;
        this.data.selectCateory.subtitle = obj.subtitle;
        this.data.selectCateory.subtitle1 = obj.title;
        app.updateCommonCateory(obj.id, this.data.selectCateory);
        wx.navigateTo({
          url: '../challenge/challenge?id=' + obj.id,
        })
      }
    }
  },
  onClickCloseModal: function () {
    console.log(' onClickCloseModal !');
    this.showModal(false)
  },
  onClickBack:function(){
    this.showModal(false)
  },
  showModal:function(show){
    this.setData({
      showModal: show,
    })
  },
  onClickOK:function(){
    this.setData({
      showExitModal: false,
    })
  },
  onShow: function () {
    if (app.globalData.abortExit){
      this.setData({
        showExitModal: true,
      })
      app.globalData.abortExit = false;
    }
  },
})