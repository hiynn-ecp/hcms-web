import axios from 'axios';
// 设置cookie
const setCookie = function (name, value, time) {
    let Days = time || 1;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + exp.toGMTString();
};
// 获取cookie
const getCookie = function (name) {
    let strCookie = document.cookie;
    let arrCookie = strCookie.split("; ");
    for (let i = 0; i < arrCookie.length; i++) {
        let arr = arrCookie[i].split("=");
        if (arr[0] === name && arr[1].substr(0, 3) === '%7B') {
            return JSON.parse(decodeURIComponent(arr[1]));
        } else if (arr[0] === name) {
            return decodeURIComponent(arr[1]);
        }
    }
    return '';
};
// 监听页面滚动方向
const handleScroll = function (direction) {
    let p_scroll = 0; //当前scrollTop值
    let t_scroll = 0; //上一次scrollTop值
    window.addEventListener('scroll', () => {
        p_scroll = document.body.scrollTop || document.documentElement.scrollTop;
        if (t_scroll <= p_scroll && p_scroll !== 0) { //向下滚动
            direction(1)
        } else {
            direction(2)
        }
        setTimeout(() => {
            t_scroll = p_scroll;
        }, 0)
    })
};
// 上拉加载更多
const bottomScroll = function (more, doMore) {
    window.addEventListener('scroll', () => {
        let documentScrollHeight = document.body.clientHeight // 页面高度
        let windowHeight = document.documentElement.clientHeight // 窗口高度
        let documentScrollTop = document.body.scrollTop || document.documentElement.scrollTop // 滚动条距离顶部
        if (((windowHeight + documentScrollTop) - documentScrollHeight) >= 0) {
            if (more) {
                more = false
                doMore()
            }
        }
    })
};
// 获取storage(通用)
const getSession = function (val) {
    return JSON.parse(window.sessionStorage.getItem(val))
};
// 修改storage(通用)
const setSession = function (label, value) {
    window.sessionStorage.setItem(label, value)
};
// 获取local(通用)
const getLocal = function (val) {
    return window.localStorage.getItem(val)
};
// 修改local(通用)
const setLocal = function (lab, val) {
    return window.localStorage.setItem(lab, val)
};
// 格式化时间
const getCurrTime = function(c) {
    let time = new Date();
    let year, month, day, hour, min, sec;
    year = time.getFullYear();
    month =
        time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1;
    day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    min =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    sec =
        time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    return year + c + month + c + day + '\xa0\xa0' + hour + ':' + min + ':' + sec
}
// 长链接推送警情
const connectData = function(userName, passWord, destinationUrl, rabbitMq,debugFn,callback) {
    /**
     *  用户名：userName
     * 密码：passWord
     * destianation路径：destinationUrl
     * 链接地址：rabbitMq
     * 链接成功的回调钩子： debugFn
     * 信息推送之后的回调钩子： callback
     * */
    let client;
    // 需引入Stompjs
    client = Stomp.client(rabbitMq);
    client.debug = function(str) {
        debugFn()
    };
    client.connect(userName, passWord, function(frame) {
        client.debug("connected to Stomp");
        client.subscribe(destinationUrl, function(message) {
            callback()
        });
    });
}
// 判断列表显示
const showPageList = function (u) {
    axios.get(window.baseURL + '/sys/menu/perms').then(res => {
        setLocal('btnKey', res.data.data)
    })
}
export {
    setCookie,
    getCookie,
    handleScroll,
    bottomScroll,
    getSession,
    setSession,
    setLocal,
    getLocal,
    getCurrTime,
    connectData,
    showPageList
}
