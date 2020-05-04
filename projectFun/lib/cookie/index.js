//获取cookie
export function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    return arr && decodeURIComponent(arr[2]) || null;
}

//设置cookie
export function setCookie(name, value, expiredays = 30) {
    var d = new Date();
    d.setTime(d.getTime() + expiredays * 24 * 60 * 60 * 1000); //30天过期
    if (process.env.NODE_ENV == 'development') {
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/;domain=localhost;SameSite=Strict;";
    } else {
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/;SameSite=Strict;";
    }
    return true;
};


//删除cookie
export function delCookie(name) {
    if (process.env.NODE_ENV == 'development') {
        document.cookie = name + "= null;expires=Thu, 01-Jan-70 00:00:01 GMT;path=/;domain=localhost;SameSite=Strict";
    } else {
        document.cookie = name + "= null;expires=Thu, 01-Jan-70 00:00:01 GMT;path=/;SameSite=Strict";
        document.cookie = name + "=null;expires=Thu, 01-Jan-70 00:00:01 GMT;path=/;SameSite=Strict";
    }
};

export function clearCookie(key,cb){
    if (Array.isArray(key)) {
        key.forEach(delCookie);
    } else {
        delCookie(key);
    }
    
    return cb && cb();
};
