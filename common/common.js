const api = require('./api.js')
const config = require('./config.js')
module.exports = {
    api,
    config,
    getOpenId(isRegister = true) { //获取openId
        if (!isRegister || wx.getStorageSync('openId')) return new Promise((resolve, reject) => resolve())
        else return new Promise((resolve, reject) => wx.login({ success: resolve }))
            .then((res) => new Promise((resolve, reject) => {
                const code = res.code
                code && api.request(config.GetSaveEngineerOpenId, { code })
                    .then((res) => {
                        if (res.data.res) {
                            let data = res.data;
                            wx.setStorageSync('openId', data.openid)
                            wx.setStorageSync('userId', data.UserID)
                            wx.setStorageSync('session_key', data.session_key)
                            resolve(res)
                        } else reject(res)
                    })
                    .catch((res) => reject(res))
            }))
    },
    checkSession() { //查看登录状态是否过期
        return new Promise((resolve, reject) => wx.checkSession({ success: resolve, fail: reject }))
            .then((res) => new Promise((resolve, reject) => resolve()))
            .catch((res) => this.getOpenId(true))
    },
    loading(title = '请求中...') {
        wx.showLoading({ title })
    },
    hide() {
        wx.hideLoading()
    },
}