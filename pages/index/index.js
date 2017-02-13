//index.js
const AV = require('../../libs/av-weapp-min.js');

//获取应用实例
var app = getApp();

Page({
  data: {
    shici: null,
    mp3Url: "",
    pic: "",
    scId: "",
    userId: "",
    isLike: 0,
    date: '20170201',
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
  },
  //事件处理函数

  onLoad: function () {

    var that = this
    //调用应用实例的方法获取全局数据
    var query = new AV.Query('Shici');
    query.limit(1);
    query.descending('createdAt');
    query.find().then(function (results) {
      // 成功获得实例     
      that.setData({
        "shici": results[0].attributes,
        "mp3Url": results[0].attributes.yuyin.attributes.url,
        "pic": results[0].attributes.tupian.attributes.url,
        "scId": results[0].id
      });
      var scId = that.data.scId;
      app.globalData.scId = that.data.scId;

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

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var that = this;

    //获取用户信息
    const user = AV.User.current();
    that.setData({
      "userId": user.id
    })

    var useroid = AV.Object.createWithoutData('_User', that.data.userId);
    var shicioid = AV.Object.createWithoutData('Shici', that.data.scId);

    var queryLinke = new AV.Query('shoucang');
    queryLinke.equalTo('useroid', useroid);
    queryLinke.equalTo('shicioid', shicioid);
    queryLinke.find().then(function (result) {
      //console.log(result.length)
      if (result.length == 0) {

        that.setData({ "isLike": 0 })
      } else {
        that.setData({ "isLike": 1 })
      }

    })
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
  },

  //添加到收藏
  addCollection: function () {
    var that = this;
    that.setData({ "isLike": 1 })

    var shoucang = new AV.Object('shoucang');
    var useroid = AV.Object.createWithoutData('_User', that.data.userId);
    var shicioid = AV.Object.createWithoutData('Shici', that.data.scId);
    shoucang.set('useroid', useroid);
    shoucang.set('shicioid', shicioid);
    shoucang.save();//保存到云端
  },

  //取消收藏
  cancelCollection: function () {
    var that = this;
    that.setData({ "isLike": 0 })

    var useroid = AV.Object.createWithoutData('_User', that.data.userId);
    var shicioid = AV.Object.createWithoutData('Shici', that.data.scId);

    //var linke = AV.Object.extend('shoucang');
    var queryLinke = new AV.Query('shoucang');
    queryLinke.equalTo('useroid', useroid);
    queryLinke.equalTo('shicioid', shicioid);
    queryLinke.find().then(function (result) {
      console.log(result[0].id)
      var todell = AV.Object.createWithoutData('shoucang', result[0].id);
      todell.destroy().then(function (success) {
        // 删除成功
        console.log('删除成功')
      }, function (error) {
        // 删除失败
        console.log(error)
      });

    })

  },

  //日历查询
  showRili: function (e) {
    var that = this;
    var shijian = e.detail.value;
    shijian = shijian.replace(/-/g, "");
    //date = date.substring(0,8) 

    wx.navigateTo({
      url: '../rili/rili?id='+shijian
    })

  }

})
