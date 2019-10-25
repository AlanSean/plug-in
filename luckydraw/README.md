# 前言

只是做了一个基础功能架子，其他功能再自己加或者改。 

[预览地址](https://alansean.github.io/plug-in/luckydraw/index.html)


## canvas 指定奖品 圆盘抽奖

插件：[Vcurve](https://github.com/AlanSean/plug-in/Vcurve);


### 初始化&抽奖
```
var luckDraw = new Luckydraw({
    context: context, //canvas的上下文
    num: Number(countNum.value) || 6,//几种奖品 默认6
    duration: 3,//运行时间 默认3秒
    complete: (n) => console.log('抽奖完毕:'+n) //抽奖完毕回调函数 虽然是指定抽奖但是完毕还是传回中了第几个
});


开始抽奖(可重复中奖)
参数 N 指定第几个中 区间 1-num  不传为随机
luckydraw.luckDraw(N);
```
