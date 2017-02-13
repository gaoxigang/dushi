const AV = require('../../libs/av-weapp-min.js');

Page({
  data: {
    word: "晨读",
    display: "chaxun",
    winHeight: "",
    res: null
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  inputCidian: function (e) {

    var that = this;
    that.setData({
      word: e.detail.value
    })
    //console.log(that.data.word)
  },
  
  chaCidian: function () {
    var that = this;
    var params = {
      "word": that.data.word
    }
    AV.Cloud.run('getZidian', params).then(function (res) {
      that.setData({
        res: res.result
      })
      console.log(that.data.res)
      
    }, function (err) {
      // 处理调用失败
      wx.showModal({
        title: '提示',
        content: '查询失败！只能查询单个文字哦！',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })

    })
  },

  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '新华字典查询', // 分享标题
      desc: '小程序版新华字典查询', // 分享描述
      path: '/pages/zidian/zidian' // 分享路径
    }
  }
})