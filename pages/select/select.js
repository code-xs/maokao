var app = getApp()


Page({
  data: {
    frompageid: 0,
    showUpgradeModal: false,
    categoryTree: [],
    categoryStudyTree:[],
    oldLevel: 0,
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
  },
  onLoad: function(option) {
    console.log('onLoad  frompageid:' + option.frompageid)
    this.data.oldLevel = app.scoreConvertLevel(app.globalData.totalScore)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a753d6',
    });

    if(option.frompageid == 4) {
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
    var that = this;
    this.setData({
      categoryTree: app.getCateoryList(),
      categoryStudyTree: app.getCateoryStudyList(),
      frompageid: fpid,
    });
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
          console.log(item);
          if (id == item.id) {
            wx.navigateTo({
              url: '../study/study?id=' + item.subId + '&frompageid=' + this.data.frompageid,
            })
            break;
          }
        } 
      } else {
        var obj = app.findCategoryStudyItemById(e.target.id);
        var parentObj = app.findParentCategoryStudyById(e.target.id);
        console.log('find obj:');
        console.log(obj);
        console.log('find parentObj:');
        console.log(parentObj);
        if (obj.subLevel != null) {
          wx.navigateTo({
            url: '../level/level' + '?id=' + obj.id + '&frompageid=' + this.data.frompageid
          })
        } else {
          this.data.selectStudyCateory.id = (10000 + id);
          this.data.selectStudyCateory.subId = id;
          this.data.selectStudyCateory.title = obj.title;
          this.data.selectStudyCateory.src = obj.src;
          this.data.selectStudyCateory.subtitle = obj.subtitle;
          this.data.selectStudyCateory.subtitle1 = obj.title;

          wx.navigateTo({
            url: '../study/study?id=' + obj.id + '&frompageid=' + this.data.frompageid,
          })
          //todo
          app.updateCommonStudyCateory(obj.id, this.data.selectStudyCateory);
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
          console.log(item);
          if (id == item.id) {
            wx.navigateTo({
              url: '../challenge/challenge?id=' + item.subId,
            })
            break;
          }
        }
      } else {
        var obj = app.findCategoryItemById(e.target.id);
        var partentObj = app.findParentCategoryById(e.target.id);
        console.log('find obj:');
        console.log(JSON.stringify(obj));
        if (obj.subLevel != null) {
          wx.navigateTo({
            url: '../level/level' + '?id=' + obj.id
          }) 
        } else {
          console.log(' select:');
          console.log(obj);
          this.data.selectCateory.id = (10000 + id);
          this.data.selectCateory.subId = id;
          this.data.selectCateory.title = obj.title;
          this.data.selectCateory.src = obj.src;
          this.data.selectCateory.subtitle = obj.subtitle;
          this.data.selectCateory.subtitle1 = obj.title;

          //todo
          app.updateCommonCateory(obj.id, this.data.selectCateory);
          wx.navigateTo({
            url: '../challenge/challenge?id=' + obj.id,
          })
        }
      }
    }
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
  onShow: function() {
    console.log('onShow')
    console.log(this.data.oldLevel)
    if (this.data.oldLevel < app.scoreConvertLevel(app.globalData.totalScore)) {
      this.setData({
        showUpgradeModal: true,
      })
    } else if (app.globalData.abortExit) {
      this.showAbortExit();
      app.globalData.abortExit = false;
    }
  },
  showAbortExit: function() {
    wx.showModal({
      title: '个人挑战',
      content: '你已放弃本次挑战!',
      success: function(res) {
        if (res.confirm) {
          console.log('confirm')
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  }
})