var network = require("/../../utils/network.js");


var QQmapkey = "ZQXBZ-YHZCP-G3PDP-VJXGQ-JXH2Q-QYFNH"
//获取应用实例
var app = getApp()
Page({
  data: {
    storage: [],
    selStoraget: '请选择',
    selStorageIndex: 0,
    saler: [],
    salername: "请选择",
    saleIndex: 0,
    address: "",
    userName:"",
    mobile:""
  },
  bindCancel: function() {
    wx.navigateBack({})
  },


  inputMobile(res){
    this.setData({
      mobile:res.detail.value
    })
  },

  inputName(res){
    this.setData({
      userName: res.detail.value
    })
  },

  bindSave: function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var referee = e.detail.value.referee;

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    console.log(mobile.length)
    if (mobile.length < 11) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }

    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }

    if (this.data.salername == "无") {
      wx.showModal({
        title: '提示',
        content: '该地区没有配送人员',
        showCancel: false
      })
      return
    }


    network.POST({
      url: app.url.addWXAddress,

      data: {
        storage_id: this.data.storage[this.data.selStorageIndex].id,
        proxy_id: this.data.saler[this.data.saleIndex].id,
        realname: linkMan,
        city: this.data.storage[this.data.selStorageIndex].city,
        address: address,
        mobile: mobile,
        xcx_id: app.globalData.xcxId,
        referee: referee,
      },
      success: function(res) {
        console.log(res);
        if (res.data.code != 1) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '注册失败',
            content: res.data.message,
            showCancel: false
          })
          return;
        }
        app.user = res.data.data
        console.log(app)
        app.globalData.token = res.data.data.token
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },


  bindPickerStorageChange: function(event) {
    var that = this
    var selIterm = this.data.storage[event.detail.value];
    console.log(selIterm)
    this.setData({
      selStoraget: selIterm.city,
      selStorageIndex: event.detail.value,
    })
    network.GET({
      url: app.url.getSaler,
      data: {
        storageId: selIterm.id
      },
      success(e) {
        var proxyers = e.data.data;
        that.setData({
          saler: proxyers,
          salername: proxyers == null ? "无" : proxyers[0].realname,
          saleIndex: 0,
        })
      }
    })
  },

  bindPickerSaler: function(event) {
    debugger
    var selIterm = this.data.saler[event.detail.value];
    this.setData({
      saleIndex: event.detail.value,
      salername: selIterm.realname
    })
  },

  onLoad: function(e) {
    var id = e.id
    if (id) {

    } else {
      this.loadingStorage()
    }

  },

  selectLocation() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        var address = res.address
        if (address.indexOf("区") > 0) {
          address = address.substring(address.indexOf("区") + 1, address.length)
        } else if (address.indexOf("县") > 0) {
          address = address.substring(address.indexOf("县") + 1, address.length)
        }
        that.setData({
          address: address
        })
      },
    })
  },

  loadingStorage() {
    var that = this
    wx.showLoading();
    wx.request({
      url: app.url.getStorageList,
      data: {},
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            storage: res.data.data,
          });
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: '无法获取库房数据',
            showCancel: false
          })
        }
      }
    })
  },

})