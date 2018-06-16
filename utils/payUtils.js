var network = require('./network.js')

var cancel = -1, ok = 1

var key = "pay";
var okSuccess = null


function pay(requestHandler, res) {
  wx.requestPayment({
    'timeStamp': res.data.data.timeStamp,
    'nonceStr': res.data.data.nonceStr,
    'package': res.data.data.package,
    'signType': res.data.data.signType,
    'paySign': res.data.data.paySign,
    fail: function (res) {
      if (requestHandler.fail != null) {
        requestHandler.fail(res)
      }
    },
    success: function (res) {
      if (requestHandler.success!=null) {
        requestHandler.success(res);
      }
    },
    complete: function (res) {
      if (requestHandler.complete!=null) {
        requestHandler.complete(res)
      }
    }
  })
}

//付款后的回调方法。
function successNotify(res) {
  network.POST({
    url: getApp().url.xcxPayNotify,
    data: {
      orderNo: res.orderNo,
      state: res.state
    },
    success: function (res) {
      //服务器保存状态成功 返回代码1 ，将本地缓存的订单数据清空。
      if (res.data.code == 1) {
        wx.removeStorageSync(key)
      }
      if (okSuccess) {
        okSuccess(res);
      }
    },
  })
}

// 检查是否有付款成功但没有保存到后台成功的数据
function checkPay() {
  let orderNo = wx.getStorageSync(key);
  if (orderNo) {
    successNotify({
      state: ok,
      orderNo: orderNo,
    })
  }
}


module.exports = {
  pay: pay,
  checkPay: checkPay
}