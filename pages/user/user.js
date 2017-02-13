const AV = require('../../libs/av-weapp-min.js');
var app = getApp()
Page({
  data: {
    userInfo: null,
    shicis: []
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    that.setData({
      userInfo: app.globalData.user
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    
    //console.log(that.data.userInfo.objectId) 

    var useroid = AV.Object.createWithoutData('_User', that.data.userInfo.objectId);

    // 构建 StudentCourseMap 的查询
    var query = new AV.Query('shoucang');

    // 查询所有选择了线性代数的学生
    query.equalTo('useroid', useroid);
    query.include('shicioid');
    // 执行查询
    query.find().then(function (shicis) {
      // studentCourseMaps 是所有 course 等于线性代数的选课对象
      shicis.forEach(function (result) {
        //var shicioid = sc.get('shicioid');
        result.set('shici', result.get('shicioid') ? result.get('shicioid').toJSON() : null);
      });
      that.setData({
        shicis: shicis
      })
      //console.log(that.data.shicis)

    });
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})