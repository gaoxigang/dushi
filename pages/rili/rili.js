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
      if (results == '') {
        wx.showToast({
          title: '今日暂无',
          icon: 'loading',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面    
          })
        }, 2500);

      }
      that.setData({
        "shici": results[0].attributes,
        "mp3Url": results[0].attributes.yuyin.attributes.url,
        "pic": results[0].attributes.tupian.attributes.url
      });
      //console.log(that.data.pic)
    }, function (error) {
      console.log(error)
      wx.showToast({
        title: '今日暂无',
        icon: 'loading',
        duration: 2000
      })
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
              //console.log(res)
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
