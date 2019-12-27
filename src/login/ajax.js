/*
 * @Author: your name
 * @Date: 2019-10-29 17:32:00
 * @LastEditTime: 2019-10-31 14:27:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\ajax.js
 */
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
import axios from "axios";
import ELEMENT from "element-ui";
import router from "./router";
let pending = [];
let mag = null;
let cancelToken = axios.CancelToken;
let removeRepeatUrl = (ever, type) => {
    let responseUrl = ever.url + '&' + ever.method;
    for (let p in pending) {
        // 当当前请求在数组中存在时执行函数体
        if (pending[p].u === responseUrl) {
            if (type == 'request') {
                // 执行取消操作
                pending[p].f('操作被用户取消');
            }
            // 把这条记录从数组中移除
            pending.splice(p, 1);
        }
    }
}
const ins = axios.create();
// 请求拦截器
ins.interceptors.request.use(config => {
    if ('get' === config.method) {
        config.params = {
            // _t: Date.parse(new Date()) / 1000,
            ...config.params
        }
    }
    // 这里拿到的url没有host信息所以需要手动拼接 或者 setTimeout也可以
    let configUrl = '';
    if (config.baseURL && !config.url.includes('http://')) {
        configUrl = (config.baseURL + config.url).replace(/\/\//g, '/').replace('http:/', 'http://');
    } else {
        configUrl = config.url;
    }
    // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new cancelToken((c) => {
        removeRepeatUrl({
            url: configUrl,
            method: config.method
        }, 'request');
        // 自定义唯一标识
        pending.push({ u: configUrl + '&' + config.method, f: c });
    });
    return config;
}, err => {
    return Promise.reject(err, 1);
})
let loginStatus = true;
// 响应拦截器
ins.interceptors.response.use(res => {
    if (res.request.responseType == 'blob') {
        res.config.headers.Accept = 'application/octet-stream'
        return res
    }
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removeRepeatUrl(res.config, 'response');
    // 返回信息拦截
    if ('domain.json' !== res.config.url && !res.config.url.includes('article/data/download/package/files')) {
        if ('0000000' !== res.data.returnCode) {
            if ("0038805" == res.data.returnCode) {
                router.replace({
                    path: "/"
                })
                window.localStorage.setItem("sessionId", "");
                if (loginStatus) {
                    loginStatus = false;
                    ELEMENT.Message({
                        type: 'error',
                        message: res.data.returnMessage
                    });
                }
            } else {
                ELEMENT.Message({
                    type: 'error',
                    message: res.data.returnMessage
                });
            }
            return;
        }
    }
    loginStatus = true;
    return res;
}, err => {
    if ('操作被用户取消' !== err.message && loginStatus) {
        loginStatus = false;
        ELEMENT.Message({
            type: 'error',
            message: '请求失败'
        });
        return Promise.reject(err);
    }
})

export default ins
