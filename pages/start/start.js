//login.js
//获取应用实例
var app = getApp();
Page({
  
  data: {
    remind: '加载中',
    angle: 0,
    message:'',
    userInfo: {},
    hasUserInfo: false,
  },
  goToIndex: function () {
      if (app.user){
        wx.switchTab({
          url: '/pages/index/index',
        });
      }else{
        wx.navigateTo({
          url: "/pages/address/index"
        })
      }
  },

  onLoad: function () {
    var that = this
    this.getUserInfo()
    wx.login({
      success(res) {
        getApp().globalData.code = res.code
        that.liChuanLogin(that,res.code);
      }
    })
  },
  liChuanLogin(that,code){
    wx.request({
      url: app.url.login,
      method: 'post', 
      data: {
        code: code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          getApp().user = res.data.data.user
          app.globalData.token = res.data.data.user.token
          app.cart = res.data.data.cart
          wx.setStorageSync('cart', app.cart)
        }
        app.globalData.xcxId = res.data.data.xcx_id
      },
      complete() {
        that.setData({
          remind: ''
        });
      }
    })
  },
  showMessage(message){
    var that = this;
    wx.showModal({
      title: '提示',
      content: that.data.message,
      confirmText: '联系公司',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: app.globalData.conpanyPhone //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  },
  getUserInfo: function(){
    console.log("app.globalData.userInfo")
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      console.log("app.globalData.userInfo--------")

      wx.getUserInfo({
        success(res){
          console.log(res)
        },
        complete(res){
          console.log(res)
        }
        
      })
      // wx.getUserInfo({
       
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     console.log("app.globalData.userInfo===============");
      //     console.log(res.userInfo)
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
    }
  },
  

  onReady: function () {
    var that = this;
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }

});