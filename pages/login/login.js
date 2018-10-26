const $common = require('../../common/common.js')
const app = getApp()
Page({
  data: {
    bgImage: 'http://img.zcool.cn/community/01c941586c8c66a8012060c8c789c1.jpg@1280w_1l_2o_100sh.png',
    clause: true, //条款同意状态
  },
  getPhoneMumber(e) { //获取手机号
    if (!this.data.clause) return $common.api.showModal('请阅读并同意隐私条款!')
    console.log(e);
    if (e.detail.encryptedData) {
      $common.getOpenId(true)
        .then(() => {
          let options = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            session_key: wx.getStorageSync('session_key')
          }
          $common.api.request($common.config.GetUserPhone, options)
            .then((res) => {
              console.log(res);
              wx.redirectTo({
                url: '/pages/bind/bind'
              })
            })
            .catch((res) => {
              console.log(res);
            })
        })
        .catch(() => {
          $common.api.showModal('获取失败，请稍候重试！')
        })

    }
  },
  changeClause() { //条款change
    this.setData({
      clause: !this.data.clause
    })
  },
  toClause() { //跳转至隐私政策页面
    wx.navigateTo({
      url: '/pages/clause/clause'
    })
  },
  getCollection() { //获取图片等信息
    $common.api.request($common.config.GetCollection, { type: 1 })
      .then((res) => {

      })
  },
  onLoad() {
    $common.api.locationAndGetAddress()
      .then((res) => app.userLocation = res)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCollection()
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
    $common.api.share()
  }
})