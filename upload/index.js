//需要安装qiniu-js
import * as qiniu from 'qiniu-js';
const text = 'x9y01t8uv7w6z2o3p5q4lmn4rs5i3jk6a7b2cd8e9f0g1h';
function imgName() {
    var str = '',
        index,
        i=0,
        date = new Date();

    str += date.getFullYear();
    str += date.getMonth() >= 10 ? date.getMonth() : '0'+date.getMonth();
    str += date.getDate() >= 10 ? date.getDate() : '0'+date.getDate();
    str += date.getHours() >= 10 ? date.getHours() : '0'+date.getHours();
    str += date.getMinutes() >= 10 ? date.getMinutes() : '0'+date.getMinutes();
    str += date.getSeconds() >= 10 ? date.getSeconds() : '0'+date.getSeconds();
    str += 5;
    for (i; i < 12; i++) {
        index = Math.round(Math.random() * (text.length - 1));
        str += text[index];
    }
    return str;
}

function b64toBlob (b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = window.atob(b64Data);//base-64编码过的字符串进行解码
    const byteArrays = [];
    //进行解吗字符串分割  每512分割一块
    for(let index = 0; index < byteCharacters.length; index += sliceSize) {

        const slice = byteCharacters.slice(index, index + sliceSize);

        const byteNumbers = new Array(slice.length);

        for(let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);//获取Unicode编码
        }

        const byteArray = new Uint8Array(byteNumbers);//8位无符号整数数组
        byteArrays[byteArrays.length] = byteArray;
    }
    return new Blob(byteArrays, {
        type: contentType
    });
}

/**
 * 上传中间件
 * @method upload
 * @param  {base64} base64
 * @param  {Steing} uploadToken 七牛上传图片凭证
 * @param  {object} subscribe 参考七牛文档 https://developer.qiniu.com/kodo/sdk/1283/javascript#3
 */
function upload(base64,uploadToken,subscribe = {}){
    if(!uploadToken){
        return false;
    }
    var newBlod = b64toBlob(base64.substring(base64.indexOf(",")+1),"image/png");
    qiniu.upload(
        newBlod,
        imgName(),
        uploadToken,
        {
            mimeType: ["image/gif","image/jpg","image/jpeg","image/png","image/GIF","image/JPG","image/PNG"] || null //限制上传的类型
        },
        {
            useCdnDomain: true, //cdn加速
            region: qiniu.region.z2 //华南区域
            // qiniu.region.z0: 代表华东区域
            // qiniu.region.z1: 代表华北区域
            // qiniu.region.z2: 代表华南区域
            // qiniu.region.na0: 代表北美区域
            // qiniu.region.as0: 代表东南亚区域
        }
    ).subscribe(subscribe)
}

export default upload;
