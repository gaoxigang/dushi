//index.js
const AV = require('../../libs/av-weapp-min.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    shici: null,
    mp3Url: "",
    pic: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
  },
  //事件处理函数

  onLoad: function (options) {
    var that = this;
    var shijian = options.id;
    //console.log(shijian)
    //调用应用实例的方法获取全局数据
    var query = new AV.Query('Shici');
    query.descending('createdAt');
    query.equalTo('shijian', shijian);
    query.find().then(function (results) {
      // 成功获得实例 
      console.log(results)    
      that.setData({
        "shici": results[0].attributes,
        "mp3Url": results[0].attributes.yuyin.attributes.url,
        "pic": results[0].attributes.tupian.attributes.url
      });
      //console.log(that.data.pic)
    }, function (error) {
      // 异常处理 
    });
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    //console.log(that.data.winHeight)
  },

  //滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  //点击tab切换   
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }


})
