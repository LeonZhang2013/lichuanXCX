var network = require("/../..//utils/network.js")
var payUtil = require('/../../utils/payUtils.js'); 

var app = getApp()
Page({
  data: {
    statusType: [],
    currentType: 0,
    orderList: []
  },

  onLoad(res) {
    var that = this
    if (res.status!=null) {
      that.setData({
        currentType: res.status
      })
    }

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
    console.log(orderId)
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
          network.POST({
            url: app.url.cancelOrder,
            data: {
              order_id: orderId
            },
            success: (res) => {
              console.log(res)
              wx.hideLoading();
              if (res.data.code == 1) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  goodsOk(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    network.POST({
      url: app.url.goodsOk,
      data: {
        order_id: e.currentTarget.dataset.id
      },
      success(res){
        console.log(res)
        if(res.code == 1){
          that.onShow()
        }else{
          wx.showModal({
            content: res.data.message,
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
            that.getOrderList(that.data.currentType, 1, 10);
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
       let data = res.data.data;
       for (let i = 0; i < data.length; i++) {
         data[i].create_time = that.fomartDate(data[i].create_time)
        }
       console.log(data)
        that.setData({
          orderList: data
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
    this.getOrderList(this.data.currentType, 1, 10);
  },


  fomartDate:function (time) {
    let current = new Date().getTime();
    let offset = (current - time) / 1000;
    if(offset < 60) {
      return "刚刚";
    }
  if (offset < 3600) {
      return parseInt(offset / 60) + "分钟前";
    }
  if (offset < 36000) {
      return parseInt(offset / 3600) + "小时前";
    }
  let date = new Date(time)
  return date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日  " + date.getHours() + ":" + date.getMinutes()+"分";
  }

})
