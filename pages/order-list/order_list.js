var network = require("/../..//utils/network.js")
var payUtil = require('/../../utils/payUtils.js'); 

var app = getApp()
Page({
  data: {
    statusType: [],
    currentType: 0,
    orderList: []
  },

  onLoad() {
    var that = this
    network.GET({
      url: app.url.getOrderStatus,
      data: {},
      success(res) {
        that.setData({
          statusType: res.data.data
        })
      }
    })
  },


  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    let statusId = this.data.statusType[curType].id
    this.getOrderList(statusId, 1, 10);
  },


  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },


  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },


  toPayTap: function (e) {
    var that = this;
    network.POST({
      url: app.url.payment,
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success(res) {
        payUtil.pay({
          fail: function (res) {
            console.log(res)
          },
          success: function (res) {
            this.getOrderList(0, 1, 10);
          },
          complete: function (res) {
            console.log(res)
          }
        }, res);
      }
    })
  },

  getOrderList(status, page, row) {
    var that = this
    wx.showLoading();
    network.GET({
      url: app.url.getOrderList,
      data: {
        page: page,
        row: row,
        status: status
      },
      success(res) {
        that.setData({
            orderList: res.data.data
        });
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },


  onShow: function () {
    // 获取订单列表
    wx.showLoading();
    var that = this;
    this.getOrderList(0, 1, 10);
  },

})
