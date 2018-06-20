// pages/to-pay-order/index.js
var network = require("/../../utils/network.js")
var shopCart = require('./../shop-cart/shopCart.js');
var payUtil = require('/../../utils/payUtils.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券

    addressInfo: {},
    charge: {},
    cartList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.loadingData(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  loadingData: function (order_id) {
    var that = this;
    network.GET({
      url: app.url.getOrderDetail,
      data: { order_id: order_id},
      success: function (res) {
        console.log(res)
        that.setData({
          addressInfo: res.data.data.order,
          goodsList: res.data.data.goods,
          charge: res.data.data.charge,
          yunPrice: res.data.data.charge.totalFreight,
          allGoodsPrice: res.data.data.charge.totalGoodsPrice,
          allGoodsAndYunPrice: res.data.data.charge.totalPrice
        })
      }
    })
  },


})