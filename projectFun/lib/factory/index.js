//获取根标签的fontsize
export const getFontSize = function (){
    return parseFloat(document.documentElement.style.fontSize) || 12;
}
const u = navigator.userAgent;
// app = navigator.appVersion;
export const getAgent = {
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
    qq: u.toLowerCase().match(/\s(QQ|qq)/i) == " qq" //是否QQ
};

/**
 * @param { Array} 数组请传
 */
var reduceFeng = function (arr) {
    if (Array.isArray(arr)) {
        arr.map(reduceFeng);
    } else {
        if (sessionStorage[String(arr)]) sessionStorage.removeItem(String(arr));
    }
};

/**
 * @function 批量清空临时存储
 * @param {String | Array} 数组请传 1维数组
 */
export const clearSessionStorage = function (item) {
    switch (Object.prototype.toString.call(item)) {
        case '[object Array]':
            reduceFeng(item);
            break;
        case '[object String]':
            if (sessionStorage[item]) sessionStorage.removeItem(item);
            break;
    }
};


/**
 * @param { ObjectDom }   copyDOM 要复制的文案dom
 */
export const copyText = function (copyDOM) {
    var successful,
        selection,
        range;
    range = document.createRange();
    range.selectNode(copyDOM);
    selection = window.getSelection();
    if (selection) {
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
            selection.addRange(range);
            successful = document.execCommand('copy');
            // Toast.info(successful ? "复制成功" : "复制失败，稍后重试");
            selection.removeAllRanges();
            return successful
        }
         return false
    }
    return false

}
