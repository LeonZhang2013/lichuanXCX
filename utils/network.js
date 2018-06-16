var secret = require('./secret.js')


function sortJ(a, b) {
  return a.key > b.key;
}

function signature(obj) {
  let data = obj.sort(sortJ);
  var strData = "";
  for (let i = 0; i < data.length; i++) {
    strData += data[i].key + "=" + data[i].value;
    if (i != data.length - 1) {
      strData += "&"
    }
  }
  return secret.sha1(strData);
}


function myRequest(method, requestHandler){
  let data = [];

  let params = requestHandler.data;
  if (params != null) {
    for (var attr in params) {
      data.push({ key: attr, value: params[attr] })
    }
  }
  wx.request({
    url: requestHandler.url,
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
      requestHandler.success(res)
    },
    fail: function (res) {
     
      if (requestHandler.fail!=null)
      requestHandler.fail(res)
    },
    complete: function (res) {
      if (requestHandler.complete != null)
      requestHandler.complete(res)
    }
  })
}


//GET请求  
function GET(requestHandler) {
  secritRequest('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  secritRequest('POST', requestHandler)
}

function secritRequest(method, requestHandler) {
  //注意：可以对params加密等处理  
  let token = getApp().globalData.token;
  let timestamp = Date.parse(new Date());
  let data = [
    { key: 'token', value: token },
    { key: 'timestamp', value: timestamp },
  ];

  let params = requestHandler.data;
  if (params!=null){
    for (var attr in params) {
      data.push({key: attr,value:params[attr]})
    }  
  }
  let sign = signature(data);
  wx.request({
    url: requestHandler.url,
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': token,
      'timestamp': timestamp,
      'signatrue': sign
    },
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
      if (requestHandler.success)
      requestHandler.success(res)
    },
    fail: function (res) {
      if (requestHandler.fail)
      requestHandler.fail(res)
    },
    complete: function (res) {
      if (requestHandler.complete)
      requestHandler.complete(res)
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}  