var network = require("/../../utils/network.js");
var shopCart = require("/../shop-cart/shopCart.js");
var pageIndex = 1;
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    noticeList: [],
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
  },

  tabClick: function (e) {

    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.resetGoods();
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function (e) {
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/goods-details/index?item=" + item
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      var item = JSON.stringify(e.currentTarget.dataset.item);
      wx.navigateTo({
        url: "/pages/goods-details/index?item=" + item
      })
    }
  },
  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
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
    var that = this
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    */
    network.POST({
      url: app.url.getBannerList,
      data: {},
      success: function (res) {
        if (res.data.code != 1) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })

    network.POST({
      url: app.url.getCategories,
      data: { status: 1 },
      success: function (res) {
        var categories = [{ id: 0, name: "全部" }];
        if (res.data.code == 1) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.resetGoods();
        that.getGoodsList(0);
      }
    })
    that.getNotice();
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
        rows:10,
        page: pageIndex,
        categoryId: categoryId,
        keyword: that.data.searchInput,
        status:1
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


  onShareAppMessage: function () {
    return {
      title: app.globalData.shopName + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  getNotice: function () {
    var that = this;
    network.POST({
      url: app.url.getNotice,
      data: {},
      success: function (res) {
        if (res.data.code == 1) {
          var notice = res.data.data.content;
          var noticeList = [];
          var len = 20;
          var count = notice.length % len == 0 ? notice.length / len - 1 : notice.length / len
          for (var i = 0; i < count; i++) {
            noticeList[i] = notice.substring(i * len, (i + 1) * len)
          }
          that.setData({
            noticeList: noticeList
          });
        }
      }
    })
  },



  toSearch: function () {
    wx.navigateTo({
      url: '/pages/index/search/search'
    })
  },
  addCart(item) {
    shopCart.addGoods(item.currentTarget.dataset.item, 1)
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
