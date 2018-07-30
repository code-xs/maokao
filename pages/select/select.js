var app = getApp()

Page({
  data: {
    frompageid: 0,
    showUpgradeModal: false,
    categoryTree: [],
    categoryStudyTree:[],
    oldLevel: 0,
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
      // categoryTree: app.getCategoryList(),
      // categoryStudyTree: app.getCategoryStudyList(),
      frompageid: fpid,
    });
  }, 

  onSelect: function(e) {
    console.log(' onSelect:' + e.target.id);
    var id = e.target.id;   

    console.log('onSelect ---> commonStudyCategory:');
    console.log(app.globalData.commonStudyCategory);

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

            app.updateCommonStudyCategory(item.id, this.data.selectStudyCategory);

            wx.navigateTo({
              url: '../study/study?id=' + item.subId + '&frompageid=' + this.data.frompageid,
            })
            break;
          } 
        }  
      } else {
        var obj = app.findCategoryStudyItemById(e.target.id);
        var parentObj = app.findParentCategoryStudyById(e.target.id);
        if (obj.subLevel != null) {
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
 
          app.updateCommonStudyCategory(obj.id, this.data.selectStudyCategory);

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

            app.updateCommonCategory(item.id, this.data.selectCategory);

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
        console.log(obj);
        if (obj.subLevel != null) {
          wx.navigateTo({
            url: '../level/level' + '?id=' + obj.id
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

          app.updateCommonCategory(obj.id, this.data.selectCategory);
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

  onShow: function() {  
    console.log('onShow')
    console.log('this.globalData.commonStudyCategory');
    console.log(app.globalData.commonStudyCategory);
 
    if(this.data.frompageid == 4) { 
        console.log('onShow udpate Study Category---------');
        var tmpcategoryStudyTree = app.getCategoryStudyList();
        this.setData({
          categoryStudyTree: tmpcategoryStudyTree,
        })
    } else {
        console.log('onShow udpate Category---------');
        var tmpcategoryTree = app.getCategoryList();
        this.setData({
          categoryTree: tmpcategoryTree,
        })
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