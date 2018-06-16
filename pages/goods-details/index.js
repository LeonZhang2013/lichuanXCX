// pages/goods-details/index.js
var shopCart = require("/../shop-cart/shopCart.js");
var network = require('/../..//utils/network.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideShopPopup: true,
    autoplay: false,
    interval: 5000,
    itemCartNum: 0,
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: getApp().globalData.buyNumMax,
    duration: 1000,
    banners: [],
    detail: [],
    saleNum:'',
    goods: {}
  },

  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  inputNumber(res) {
    console.log(res)
    if (res.detail.value > this.data.buyNumMax) {
      res.detail.value = this.data.buyNumMax;
    }
    this.setData({
      buyNumber: res.detail.value
    })
  },

  showBuyLayout: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  closePopupTap() {
    this.setData({
      hideShopPopup: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var goods = JSON.parse(e.item);
    console.log(goods)
    var banners=[], detail = [];
    if (goods.sub_images) banners = goods.sub_images.split(',');
    if (goods.detail) detail = goods.detail.split(',');
    this.setData({
      goods: goods,
      banners: banners,
      detail: detail
    })
    network.GET({
      url: app.url.getSaleNum,
      data:{
        product_id: that.data.goods.id
      },
      success(e){
        that.setData({
          saleNum : e.data.data
        })
      }
    })
  },

  addGoods: function (item) {
    let num = shopCart.addGoods(item.currentTarget.dataset.item, this.data.buyNumber)
    //直接使用下面的方式会传址过去，导致永远无法改变 num
    //let num = shopCart.addGoods(this.data.goods, this.data.buyNumber) 
    this.setData({
      buyNumber: 1,
      itemCartNum: num > 100 ? '...' : num,
      hideShopPopup: true
    })
  }


})