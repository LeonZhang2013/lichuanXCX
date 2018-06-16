//app.js
//var host = 'https://www.lichuanshipin.ltd/lichuan/';
var host = 'http://47.96.97.84/lichuan/';

App({

  url: {
    login: host + 'wx/user/login',
    addWXAddress: host + "wx/user/addWXAddress",
    getWXAddress:host +"wx/user/wxAddress",
    payment: host +"wx/pay/payment",
    getSaler: host +"wx/user/getSaler",
    getStorageList: host +"storage/getStorageList",
    getBannerList: host + 'wx/product/getBannerList',
    getCategories: host + 'product/getCategories',
    getProducts: host + 'product/getProducts',
    getNotice: host + 'common/getNotice',
    addGoodsToCart: host +"cart/addGoodsToCart",
    saveCart: host + "cart/saveCart",
    getAddress: host +"user/getAddress",
    getMyAddressAndFreight: host +"user/getMyAddressAndFreight",
    createOrder: host +"order/createOrder",
    getOrderList: host +"order/getWxOrderList",
    getOrderStatus: host +"order/getOrderStatus",
    getSaleNum: host + "order/getSaleNum",
  },
  

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    buyNumMax :9999,
    userInfo: null,
    session_key: null,
    openid: null,
    token:'',
    xcxId:'',
    conpanyPhone:'0818-8960111',
    shopName:"立川食品",
    shareProfile:'美味小零食，好吃的停不下来'
  },
  cart:[]

})
