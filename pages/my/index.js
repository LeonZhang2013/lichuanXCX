// pages/my/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
  },

  managerAddress:function(){
    wx.navigateTo({
      url: '/pages/show-address/index',
    })
  },

  orderList: function () {
        wx.navigateTo({
          url: '/pages/order-list/order_list',
        })
  },

  callme:function(){
      wx.showModal({
        title: '投诉建议',
        content: '拨通客服电话',
        success(res){
          console.log(res)
          if(res.confirm){
            wx.makePhoneCall({
              phoneNumber: '0818-8960111' //仅为示例，并非真实的电话号码
            })
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


})