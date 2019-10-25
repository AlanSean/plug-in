参考的 [countUp](https://github.com/inorganik/countUp.js)


[简单体验地址](https://alansean.github.io/plug-in/Vcurve/test/index.html)


渐减速运动 输出当前运行到的数值

自己更多用于一些动画,滚动条回滚


```
    ___      ___ ________  ___  ___  ________  ___      ___ _______
   |\  \    /  /|\   ____\|\  \|\  \|\   __  \|\  \    /  /|\  ___ \
   \ \  \  /  / \ \  \___|\ \  \\\  \ \  \|\  \ \  \  /  / \ \   __/|
    \ \  \/  / / \ \  \    \ \  \\\  \ \   _  _\ \  \/  / / \ \  \_|/__
     \ \    / /   \ \  \____\ \  \\\  \ \  \\  \\ \    / /   \ \  \_|\ \
      \ \__/ /     \ \_______\ \_______\ \__\\ _\\ \__/ /     \ \_______\
       \|__|/       \|_______|\|_______|\|__|\|__|\|__|/       \|_______|

```



```
var curve = new Curve({
    duration: 1,//单位秒 默认1s
    starNum: Number , // 起点 默认0
    reductionGear: Boolean, //渐减速运动 默认true
    endNum: Number  //终点 默认1000
    toFixed: Number //保留小数  默认2
});

curve.start(fn)  // 传入回调函数 返回，当前运行的值，已经当前执行的时长
     .update(newEnd,fn) 新的结束值。 新的回调 可选。 不会改变原来的endNum,只用作当前的临时新结束值
     .pause 暂停或者继续 返回 暂停时的值，时长以及暂停状态



```



### 使用例子 滚动条y轴 平滑滚动

```
const vcurve = new VCurve({
    duration: 1
})

/**
 * 控制Y 滚动条的位置
 * @param { Obj }  scroll.top 滚动的位置
 * @param { Obj }  scroll.behavior smooth 平滑
 */
 window.scrollTotop = function(scroll){
     if(scroll !== undefined){
        if(window.scrollTop() == (scroll.top || scroll)){
             return;
        }
        if(scroll.behavior && scroll.behavior == 'smooth'){
            curve.starNum = window.scrollTop();
            curve.endNum = scroll.top;
            curve.start( n => {
                if(window.scrollTo){
                    window.scrollTo(0,n);
                } else if(document.documentElement.scrollTop){
                    document.documentElement.scrollTop = n;
                } else if(document.body.scrollTop){
                    document.body.scrollTop = n;
                }
            })
            return;
        }

        if(window.scrollTo){
            window.scrollTo(0,scroll.top || scroll);
        } else if(document.documentElement.scrollTop){
            document.documentElement.scrollTop = scroll.top || scroll;
        } else if(document.body.scrollTop){
            document.body.scrollTop = scroll.top || scroll;
        }
    }
 }


window.scrollTotop({
    top: 0,
    behavior: 'smooth'
})
```
