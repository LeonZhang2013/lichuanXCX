//index.js
var shopCart = require('./shopCart.js');
var math = require('/../..//utils/math.js')
var app = getApp()
Page({
  data: {
    totalPrice: 0,
    totalNum:0,
    list: [],
    editModle: true,
    buyNumMax: getApp().globalData.buyNumMax,
  },

  editTap: function () {
    this.setData({
      editModle: !this.data.editModle
    })
    console.log(this.data.editModle)
  },

  onShow: function () {
    this.setData({
      editModle: true
    })
    var shopList = [];
    // 获取购物车数据
    this.calculation(app.cart);
  },

  calculation: function (shopCart) {
    console.log(shopCart)
    var totalPrice = 0;
    var totalNum = 0;
    for (var i = 0; i < shopCart.length; i++) {
      let subPrice = math.mul(shopCart[i].price, shopCart[i].num);
      totalPrice = math.add(totalPrice, subPrice)
      totalNum += shopCart[i].num
    }
    this.setData({
      totalPrice: totalPrice,
      list: shopCart,
      totalNum : totalNum
    });
  },

  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  reduceBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    if (app.cart[parseInt(index)].num>1) {
      app.cart[parseInt(index)].num--;
      this.calculation(app.cart);
    }
  },

  inputNumber(res) {
    var index = res.currentTarget.dataset.index;
    if (res.detail.value > this.data.buyNumMax) {
      res.detail.value = this.data.buyNumMax;
    }
    if (res.detail.value.length == 0 || res.detail.value<1) {
      res.detail.value = 1;
    }
    app.cart[parseInt(index)].num = parseInt(res.detail.value);
    this.calculation(app.cart);
  },


  addBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    if (app.cart[parseInt(index)].num< this.data.buyNumMax) {
      app.cart[parseInt(index)].num++
    }
    this.calculation(app.cart);
  },

  toPayOrder: function(){
    shopCart.pushData({
      succcess() {
        wx.navigateTo({
          url: "/pages/to-pay-order/index"
        })
      }
    });
  },
  deleteAll:function(){
    var that =  this;
    wx.showModal({
      title: '删除所有商品',
      content: '',
      success(res){
        if (res.confirm){
          app.cart = []
          that.calculation(app.cart);
        }
      }
    })

  },

  delItem:function(e){
    var index = e.currentTarget.dataset.index;
    app.cart.splice(index,1)
    this.calculation(app.cart);
  },
  onHide(){
    shopCart.pushData();
  }
})
