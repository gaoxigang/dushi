//index.js
const AV = require('../../libs/av-weapp-min.js');

//获取应用实例
var app = getApp()
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

  onLoad: function (options) {

    var objectId = options.id;
    //console.log(objectId)
    var that = this
    //调用应用实例的方法获取全局数据
    var query = new AV.Query('Shici');
    query.descending('createdAt');
    query.equalTo('objectId', objectId);
    query.find().then(function (results) {
      // 成功获得实例   
      //console.log(results)  
      that.setData({
        "shici": results[0].attributes,
        "mp3Url": results[0].attributes.yuyin.attributes.url,
        "pic": results[0].attributes.tupian.attributes.url,
        "scId": results[0].id
      });
      // console.log(that.data.pic)
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

    var time = new Date();
    var m = time.getMonth() + 1;
    var t = time.getFullYear();
    var d = time.getDate();
    var date = t + '-' + m + '-' + d;
    that.setData({ 'date': date })
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

  //日历查询
  showRili: function (e) {
    var that = this;
    var shijian = e.detail.value;
    shijian = shijian.replace(/-/g, "");
    //date = date.substring(0,8) 

    wx.navigateTo({
      url: '../rili/rili?id=' + shijian
    })

  },

  imageLongTap: function (e) {
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        //console.log(e)
        if (res.tapIndex == 0) {
          var imageSrc = e.currentTarget.dataset.src
          //console.log(imageSrc)
          wx.downloadFile({
            url: imageSrc,
            success: function (res) {
              console.log(res)
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (res) {
                  //console.log(res.savedFilePath)
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1000
                  })
                },
                fail: function (e) {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'loading',
                    duration: 1000
                  })
                }
              })
            },
            fail: function (e) {
              wx.showToast({
                title: '图片下载失败',
                icon: 'loading',
                duration: 1000
              })
            }
          })
        }
      }
    })
  }


})
