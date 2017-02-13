//app.js
const AV = require('./libs/av-weapp-min.js');
AV.init({
  appId: 'FmsRuyEtOMrY90Usv1n9WmTD-gzGzoHsz',
  appKey: 'tadJnylxQx0wb54VqBrpGp14',
});
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    AV.User.loginWithWeapp().then(user => {
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({userInfo}) => {
          // 更新当前用户的信息
          user.set(userInfo).save().then(user => {
            // 成功，此时可在控制台中看到更新后的用户信息
            this.globalData.user = user.toJSON();
            //console.log(this.globalData.user)
          }).catch(console.error); 
        },
        fail() {
          wx.showToast({
            title: '将无法使用收藏',
            icon: 'loading',
            duration: 2000
          })
        }
      }); 

      this.globalData.user = user.toJSON();

    }).catch(console.error);

    // 假设已经通过 AV.User.loginWithWeapp() 登录
    // 获得当前登录用户
    const user = AV.User.current();
    //console.log(user); 

  },

  globalData: {
    user: null,
    scId: ''
  }
})