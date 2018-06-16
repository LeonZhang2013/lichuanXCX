var network = require("/../../../utils/network.js");
var shopCart = require("/../../shop-cart/shopCart.js");
var pageIndex = 1;
var app = getApp()
Page({
  data: {
    loadingHidden: false, // loading
    userInfo: {},
    activeCategoryId: 0,
    goods: [],
    loadingMoreHidden: true,
    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
  },

  toDetailsTap: function (e) {
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/goods-details/index?item=" + item
    })
  },

  scroll: function (e) {
    //  console.log(e) ;
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },


  onLoad: function () {

  },

  // 重置商品容器。
  resetGoods() {
    pageIndex = 1;
    this.setData({
      goods: [],
    });
  },

  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    network.POST({
      url: app.url.getProducts,
      data: {
        page: pageIndex,
        categoryId: categoryId,
        keyword: that.data.searchInput,
      },
      success: function (res) {
        if (res.data.code != 1 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        var goods = that.data.goods;
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        console.log(goods)
        that.setData({
          goods: goods,
        });
      }
    })
  },


  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },

  toSearch: function () {
    this.resetGoods();
    this.getGoodsList(this.data.activeCategoryId);
  },

  addCart(item) {
    shopCart.addGoods(item.currentTarget.dataset.item, 1)
  },

  resetGoods() {
    pageIndex = 1;
    this.setData({
      goods: [],
    });
  },

  onPullDownRefresh(e) {
    this.resetGoods();
    this.getGoodsList(this.data.activeCategoryId);
  },

  onReachBottom() {
    pageIndex++;
    this.getGoodsList(this.data.activeCategoryId);
  },

  onHide() {
    shopCart.pushData();
  }
})
