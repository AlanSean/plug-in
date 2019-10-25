## 七牛png图片上传封装

1. qiniu-js  `npm -S qiniu-js`
2. [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader)
3. [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)



### 使用方法

```
import upload from '**/upload/index.js';

const fileread = new FileReader();

fileread.onload = (e) => {
    const {  result } = e.target;
    const data = (typeof result) === 'object' ? new Bolb([result]) : result;
    target.value = '';
    upload(data, token, {
        
        next(res) { //上传进度
            
        },
        error(err) {//上传错误
            
        },
        complete(res) {//完成后 res.key 生成的名称
            
        }
    });
}

//file input.files[0]
fileread.readAsDataURL(file);
```