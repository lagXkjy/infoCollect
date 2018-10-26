const api = require('./api.js');
const config = require('./config.js');
module.exports = {
    api,
    config,
    getOpenId(getSession = false) { //获取openId
        if (!getSession && wx.getStorageSync('openId')) return new Promise((resolve, reject) => resolve())
        else return new Promise((resolve, reject) => wx.login({ success: resolve }))
            .then((res) => new Promise((resolve, reject) => {
                const code = res.code;
                code && api.request(config.GetSaveEngineerOpenId, { code })
                    .then((res) => {
                        //成功获取到openId后，缓存于本地
                        if (res.data.res) {
                            let data = res.data;
                            wx.setStorageSync('openId', data.openid);
                            wx.setStorageSync('UserID', data.UserID);
                            wx.setStorageSync('session_key', data.session_key);
                            resolve(res)
                        } else reject(res)
                    })
                    .catch((res) => reject(res))
            }))
    },
    loading(title = '请求中...') {
        wx.showLoading({ title })
    },
    hide() {
        wx.hideLoading();
    },
}