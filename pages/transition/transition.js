const $common = require('../../common/common.js')
Page({
  data: {},
  onLoad(options) {
    wx.setStorageSync('eId', options.eId || 0)  //小程序有可能是扫码进入
    $common.loading()
    $common.getOpenId()
      .then(() => {
        return $common.api.request($common.config.IsBanDing, { openid: wx.getStorageSync('openId') })
      })
      .catch(() => {
        $common.api.codeModal()
      })
      .then((res) => {
        $common.hide()
        if (res.data.res) {
          wx.setStorageSync('userId', res.data.UserID)
          wx.redirectTo({
            url: '/pages/bind/bind'
          })
        } else {
          if (res.data.errorType === 0) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } else {
            $common.api.codeModal(res.data.errorType)
          }
        }
      })
      .catch((res) => {
        $common.hide()
        $common.api.codeModal()
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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