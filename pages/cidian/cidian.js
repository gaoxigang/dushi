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
    AV.Cloud.run('getCidian', params).then(function (res) {
      that.setData({
        res: res.result
      })
      var str = JSON.stringify(res.result)
      str = str.replace(/<b>/g, "").replace(/<\/b>/g, "").replace(/<br \/>/g, "").replace(/<br>/g, "")
      //console.log(str)     
      str = JSON.parse(str)
      //console.log(str)
      that.setData({
        res: str
      })
    }, function (err) {
      // 处理调用失败
      wx.showModal({
        title: '提示',
        content: '查询失败！只能查询词组或成语哦！',
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
      title: '现代汉语词典查询', // 分享标题
      desc: '小程序版现代汉语词典查询', // 分享描述
      path: '/pages/cidian/cidian' // 分享路径
    }
  }
})