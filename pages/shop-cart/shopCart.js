var app = getApp()
var netwrok = require('/../..//utils/network.js');
var buyNumMax = 10000;

// 购物车原理 一定要看
// 购物车原理 一定要看
// 购物车原理 一定要看
 //首先将数据保存在本地，然后在切换页面时，如果数据有变化就提交给服务器，否则不提交给服务器。
 //wx.setStorageSync('cart', cart); 保存到本地的数据 只有在这个类中使用到。
// 外部类主要通过修改 app.cart ，购物车类，只需要通过比较 app.cart 和 wx.getStorageSync('cart') 进行比较。

function addGoods(goods, count) {
  goods.num = count;
  let num = put(goods)
  wx.showToast({
    title: '+' + num,
    duration: 1000
  })
  return num
}

function put(goods) {
  for (var i = 0; i < app.cart.length; i++) {
    if (app.cart[i].id === goods.id) {
      app.cart[i].num += parseInt(goods.num);
      if (app.cart[i].num > app.globalData.buyNumMax) {
        app.cart[i].num = app.globalData.buyNumMax
      }
      return app.cart[i].num;
    }
  };
  app.cart[app.cart.length] = goods;
  return goods.num == app.globalData.buyNumMax ? "已经满了" : goods.num
};

/**
 * 推送数据到服务器，如果 dataChange = false 就不提交。
 */
function pushData(res) {
  let cart = app.cart;
  if (!dataChange(cart)){
    if (res != null) res.succcess()
    return 
  } 
  wx.setStorageSync('cart', cart);

  var cartJson = [];
  for (var i = 0; i < cart.length; i++) {
    cartJson[i] = { product_id: cart[i].id, num: cart[i].num }
  }
  netwrok.POST({
    url: app.url.saveCart,
    data: { carts: JSON.stringify(cartJson) },
    success(e) {
      if (res != null) res.succcess()
    }
  })
};

function orderCommit(){
  app.cart = [];
  wx.setStorageSync('cart', []);
};

/**
 * 返回 true 有改变，false 数据没有变化
 */
function dataChange(cart) {
  let cartOld = wx.getStorageSync('cart')
  //长度不相等，说明数据有改变 true
  if (cart.length != cartOld.length) return true;
  //长度不相等，商品个数不同 ，有改变 true
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id != cartOld[i].id || cart[i].num != cartOld[i].num) {
      return true;
    }
  }
  //通过重重考验，到达这里，说明数据没有改变 false
  return false
}

function inputNumber(index, num) {
  if (num > app.globalData.buyNumMax) {
    num = app.globalData.buyNumMax;
  }
  app.cart[parseInt(index)].num = parseInt(res.detail.value);
}


function reduceGoods(index) {
  if (app.cart[parseInt(index)].num > 1) {
    app.cart[parseInt(index)].num--;
  }
  return
}



function reduce(key) {
  for (var i = 0; i < app.cart.length; i++) {
    if (app.cart[i].key === key && app.cart[i].count > 1) {
      app.cart[i].count--;
      return;
    }
  };
}

//  根据key获取 goods
function getGoods(key) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].key === key) {
      return cart[i].goods;
    }
  }
  return null;
};

//  根据key获取 item
function get(key) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].key === key) {
      return cart[i];
    }
  }
  return null;
};













module.exports = {
  addGoods: addGoods,
  pushData: pushData,
  reduce: reduce,
  orderCommit: orderCommit,
}