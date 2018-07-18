var app = getApp()
Page({
  data: {
    level:[],
    lockLevel:0,
    maxLevel:0,
    progress:1,
    times:[],
    duration:[],
    Height:150,
    images:[],
    categoryTree: [],
    /*[{
      id: 0,
      title: '常用',
      src: '/images/8.png',
      subLevel: [{
        'id': 11,
        'title': '语文',
        'src':'/images/10.png',
      }, {
        'id': 12,
        'title': '数学',
        'src': '/images/1.png'
      }, {
        'id': 13,
        'title': 'CET4',
        'src': '/images/1.png'
      }, {
        'id': 14,
        'title': '物理',
        'src': '/images/2.png'
      }, {
        'id': 15,
        'title': '科目1',
        'src': '/images/3.png'
      }]
    }, {
      id: 1,
      title: '文科',
      src: '/images/5.png',
      subLevel: [{
        'id': 11,
        'title': '语文',
        'src': '/images/4.png',
        'subLevel': [{
          'id': 111,
          'title': '小学',
          'subLevel': [{
            'id': 1111,
            'title': '一年级',
          }, {
            'id': 1112,
            'title': '二年级',
          }, {
            'id': 1113,
            'title': '三年级',
          }, {
            'id': 1114,
            'title': '四年级',
          }, {
            'id': 1115,
            'title': '五年级',
          }]
        }, {
          'id': 112,
          'title': '中学',
          'subLevel': [{
            'id': 1121,
            'title': '初中一年级',
          }, {
            'id': 1122,
            'title': '初中二年级',
          }, {
            'id': 1123,
            'title': '初中三年级',
          }]
          }, {
            'id': 113,
            'title': '高中',
            'subLevel': [{
              'id': 1131,
              'title': '高中一年级',
            }, {
              'id': 1132,
              'title': '高中二年级',
            }, {
              'id': 1133,
              'title': '高中三年级',
            }]
            },{
              'id': 114,
              'title': '大学',
            }, {
              'id': 115,
              'title': '成人教育',
          }]
      }, {
        'id': 12,
        'title': '外语',
        'src': '/images/1.png',
        'subLevel': [{
          'id': 121,
          'title': '小学',
          'subLevel': [{
            'id': 1211,
            'title': '一年级',
          }, {
            'id': 1212,
            'title': '二年级',
          }, {
            'id': 1213,
            'title': '三年级',
          }, {
            'id': 1214,
            'title': '四年级',
          }, {
            'id': 1215,
            'title': '五年级',
          }]          
        }, {
          'id': 122,
          'title': '中学',
          'subLevel': [{
            'id': 1221,
            'title': '初中一年级',
          }, {
            'id': 1222,
            'title': '初中二年级',
          }, {
            'id': 1223,
            'title': '初中三年级',
          }]          
        }, {
          'id': 123,
          'title': '高中',
          'subLevel': [{
            'id': 1231,
            'title': '高中一年级',
          }, {
            'id': 1232,
            'title': '高中二年级',
          }, {
            'id': 1233,
            'title': '高中三年级',
          }]          
        }, {
          'id': 124,
          'title': '大学',
          'subLevel': [{
            'id': 1241,
            'title': '大学一年级',
          }, {
            'id': 1242,
            'title': '大学二年级',
          }, {
            'id': 1243,
            'title': '大学三年级',
          }]          
        }, {
          'id': 125,
          'title': '成人教育',
        }]
      }, {
        'id': 13,
        'title': '历史',
        'src': '/images/5.png',
        'subLevel': [{
          'id': 131,
          'title': '小学',
          'subLevel':[{
            'id': 1311,
            'title': '一年级',            
          }, {
            'id': 1312,
            'title': '二年级',
          }, {
              'id': 1313,
              'title': '三年级',
          }, {
            'id': 1314,
            'title': '四年级',
          }, {
            'id': 1315,
            'title': '五年级',
          }]
        }, {
            'id': 132,
          'title': '中学',
          'subLevel': [{
            'id': 1321,
            'title': '初中一年级',
          }, {
            'id': 1322,
            'title': '初中二年级',
          }, {
            'id': 1323,
            'title': '初中三年级',
          }]
        }, {
          'id': 133,
          'title': '高中',
          'subLevel': [{
            'id': 1331,
            'title': '高中一年级',
          }, {
            'id': 1332,
            'title': '高中二年级',
          }, {
            'id': 1333,
            'title': '高中三年级',
          }]
        }, {
          'id': 134,
          'title': '大学',
        }, {
          'id': 135,
          'title': '成人教育',
        }]
      }]
    }, {
      id: 2,
      title: '社会证书',
      src: '/images/10.png',
      subLevel: [{
        'id': 41,
        'title': 'CET4',
        'src': '/images/1.png'
      }, {
        'id': 42,
        'title': 'CET6',
        'src': '/images/10.png'
      }, {
        'id': 43,
        'title': 'PETS',
        'src': '/images/1.png'
      }, {
        'id': 44,
        'title': 'WSK',
        'src': '/images/4.png'
      }]
    }],*/
    level:[],
    CLASS:[],
  },
  onLoad: function (option) {
    console.log('onLoad')
    var that = this;
    that.setData({
      lockLevel: option.lockLevel,
      maxLevel:option.maxLevel,
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a753d6',
    });
    this.data.duration = wx.getStorageSync('durations');
    console.log("__level:" + this.data.lockLevel+', max:'+this.data.maxLevel);
    this.data.categoryTree = app.globalData.categoryTree;
    that.initData(this.data.maxLevel); 

    console.log("onelevel title:" + this.data.categoryTree[1]);
    var secondLevel = this.data.categoryTree[0].subLevel;
    console.log("secondLevel len:"+secondLevel.length+"title:" + secondLevel[1].title + ', id:' + secondLevel[1].id);
    /*var thirLevel = secondLevel[1].subLevel;
    console.log("subLevel title:" + thirLevel[1].title + ', id:' + thirLevel[1].id);
    var subLevel = thirLevel[1].subLevel;
    console.log("subLevel title:" + subLevel[2].title + ', id:' + subLevel[2].id);*/
  },
  initData:function(len){
    for(var i=0; i< len; i++){
      this.data.level.push([i+1]);
    }
    for (var j = 0; j < this.data.duration.length; j++){
      var gap = this.data.duration[j];
      if (gap > 0) {
        this.data.times.push(app.convertTimes(gap));
      } else {
        this.data.times.push('0\'00"');
      }
    }

    this.setData({
      level:this.data.level,
      times:this.data.times,
      categoryTree: this.data.categoryTree,
    })
  },

  onSelect:function(e){
    console.log(' onLevelSelect:'+e.target.id);
    var obj = app.findCategoryItemById(e.target.id);
    /*
    for (var i = 0; i < this.data.categoryTree.length-1; i++){
      var twoLevel = this.data.categoryTree[i].subLevel;
      //console.log(' _obj.title:' + this.data.categoryTree[i].title + ', _obj.id:' + this.data.categoryTree[i].id);
      for (var j = 0; j < twoLevel.length; j++) {
        var _obj = twoLevel[j];
        console.log('obj:');
        console.log(_obj);
        if (_obj.id == e.target.id){
          obj = _obj;
          break;
        }
      }
    }*/
    console.log('find obj:');
    console.log(JSON.stringify(obj));
    if (obj.subLevel != null){
      wx.navigateTo({
        url: '../level/level' + '?id=' + obj.id
      })
    }else{
      console.log(' select:' + obj.title+' with param id:' + obj.id);
      wx.navigateTo({
        url: '../challenge/challenge?id=' + obj.id,
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