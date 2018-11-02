const $common = require('../../common/common.js')
const app = getApp()
Page({
  data: {
    banner: '',
    info: {}, //获取到的信息
    useInfo: {}, //待提交的信息
  },
  inputPhone(e) { //手机号
    this.data.useInfo.phone = e.detail.value
  },
  inputName(e) { //姓名
    this.data.useInfo.name = e.detail.value
  },
  inputAge(e) { //年龄
    this.data.useInfo.age = +e.detail.value
  },
  inputAddress(e) { //地址
    this.data.useInfo.address = e.detail.value
  },
  getInfo() { //获取信息
    const userId = wx.getStorageSync('userId')
    this.setData({ userId })
    if (userId <= 0) { //当前用户不存在
      let phone = wx.getStorageSync('phone') || ''
      let address = app.userLocation ? app.userLocation.result.address : ''
      this.setData({
        info: {
          phone,
          address
        }
      })
      this.data.useInfo.phone = phone
      this.data.useInfo.address = address
      return
    }
    $common.api.request($common.config.GetUserInfo, { UserID: wx.getStorageSync('userId') })
      .then((res) => {
        if (res.data.res) {
          let data = res.data.UserInfo
          this.setData({
            info: {
              phone: data.UserTel,
              name: data.UserName,
              age: data.UserAge,
              address: data.UserAddress
            }
          })
        } else {
          $common.api.codeModal(res.data.errorType)
        }
      })
      .catch((res) => {
        $common.api.codeModal()
      })
  },
  getCollection() { //获取图片等信息
    $common.api.request($common.config.GetCollection, { type: 2 })
      .then((res) => {
        if (res.data.res) {
          this.setData({
            banner: res.data.Data
          })
        }
      })
  },
  submitUseInfo(e) { //提交信息
    let userInfo = e.detail.userInfo
    if (!userInfo) return
    let useInfo = this.data.useInfo
    if (!useInfo.phone || !$common.config.phoneReg.test(useInfo.phone)) return $common.api.showModal('请填写正确的手机号码！')
    if (!useInfo.name || useInfo.name.trim().length <= 0) return $common.api.showModal('请填写姓名！')
    if (!useInfo.age || useInfo.age <= 0) return $common.api.showModal('请填写年龄！')
    if (!useInfo.address || useInfo.address.trim().length <= 0) return $common.api.showModal('请填写地址！')
    $common.api.debounce(() => {
      useInfo.openid = wx.getStorageSync('openId')
      useInfo.headImg = userInfo.avatarUrl
      useInfo.nickname = userInfo.nickName
      useInfo.eid = +wx.getStorageSync('eId')
      useInfo.name  = useInfo.name.trim();
      $common.api.request($common.config.PostUserData, useInfo)
        .then((res) => {
          if (res.data.res) {
            wx.setStorageSync('userId', res.data.UserID)
            this.getInfo()
          } else {
            $common.api.showModal('提交失败！')
          }
        })
        .catch((res) => {
          $common.api.codeModal()
        })
    });
  },
  init() {
    this.getCollection()
    this.getInfo()

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share()
  }
})