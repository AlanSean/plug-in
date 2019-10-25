//author: huangqing
;(function(self, factory) {
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      self.Luckydraw = factory();
    }
}(this, function() {
    class  Luckydraw {
    // context    $('canvas').getContext('2d')
    // num 多少奖品
    // complete 抽奖运行完成后的回调
    constructor(obj) {
        this.context = obj.context;
        this.num = obj.num || 6;
        this.averageRadian =  Math.PI*2/obj.num;
        this.duration = obj.duration || 3;//持续时间 单位 秒
        this.startRadian = 0;
        this.complete = obj.complete;
        this.isRun = false;//动画是否运行中
        this.strokeCircle();
    }
    //radius 圆弧半径
    //startAngle 圆弧开始
    //endAngle 圆弧结束
    strokeCircle(){
        const {
            context,
            context:{
                canvas:{
                    width,
                    height
                }
            },
            averageRadian,
            startRadian,
            num
        } = this,
        x =  width/2,
        radius = x-1,
        banjing = x-5,//色块半径
        //边长  2Rsin(PI/n)
        bianchang = Math.ceil(2*(banjing*0.8)*Math.sin(Math.PI/num)),
        pointerH = 25,
        pointerW = 8,
        buttonRadius = 15,
        bianchang2 = Math.ceil(2*(radius*0.7)*Math.sin(Math.PI/num)),
        y = height/2;
        context.clearRect(0,0,width,height);
        //保存当前Canvas画布状态并放在栈的最上面
        context.save();
        context.fillStyle = '#ffd1d1';
        context.arc(x,y,radius,Math.PI/2+Math.PI,Math.PI*4,false);
        context.fill();
        context.restore();
        //Math.PI = 3.14  =  180°
        // 绘制色块
        for(let i=0;i<num;i++){
            context.save();
            context.fillStyle = i%2 == 0 ? '#FD5757' : '#F79494';
            var startAngle = startRadian+averageRadian*i+Math.PI/2+Math.PI-averageRadian/2,
                endAngle = startAngle + averageRadian;

            context.beginPath();
            context.arc(x,y,banjing,startAngle,endAngle,false);
            context.arc(x,y,0,endAngle,startAngle,true);
            context.fill();
            context.restore();


            //绘制 序号
            context.save();
            context.fillStyle = '#fff';
            context.font = 'bold 16px helvetica';
            context.translate(100+Math.cos(startAngle)*radius*0.7 ,100+Math.sin(startAngle)*radius*0.7);
            context.rotate(startAngle+averageRadian/2+Math.PI/2);
            context.fillText(i+1,bianchang2 /2 - context.measureText(i+1).width/2,0);
            context.restore();

            //奖品明细
            // var text = '我是奖品名称',
            //     textWidth = context.measureText(text).width,
            //     centerNum = bianchang/2-textWidth/2,
            //     //1px = (endAngle-startAngle)/bianchang 弧度
            //     pingjun = (endAngle-startAngle)/bianchang,
            //     //起点
            //     start = pingjun*centerNum+startAngle,
            //     //终点
            //     end = endAngle - pingjun*centerNum,
            //     angleDecrement = (start-end)/text.length,
            //     angle = start;
            // for(let t=0; t<text.length;t++){
            //     context.save();
            //     context.fillStyle = '#c9281e';
            //     context.font = 'bold 12px helvetica';
            //     context.translate(100+Math.cos(angle)*radius*0.8,100+Math.sin(angle)*radius*0.8);
            //     context.rotate(angle+Math.PI/2);
            //     context.fillText(text[t],0,0);
            //     angle -=angleDecrement;
            //     context.restore();
            // }

        }
        //白圈
        context.save();
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = '#fff';
        context.arc(x,y,buttonRadius+2,0,Math.PI*2,false);
        context.stroke();
        context.restore();

        //绘制指针

        context.save();
        context.fillStyle = "#fd8160";
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x-pointerW/2,y-buttonRadius);
        context.lineTo(x,y-pointerH-buttonRadius);
        context.closePath();
        context.fill();
        context.restore();

        context.save();
        context.fillStyle = "#fd3f36";
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x+pointerW/2,y-buttonRadius);
        context.lineTo(x,y-pointerH-buttonRadius);
        context.closePath();
        context.fill();
        context.restore();

        //绘制按钮
        context.save();
        context.beginPath();
        context.fillStyle = '#fc8471';
        context.arc(x,y,buttonRadius,0,Math.PI*2,false);
        context.fill();
        context.restore();
    }
    //开始旋转
    //N  中第几个
    luckDraw(N){
        if(this.isRun) return false;
        if(N == undefined){
            N = parseInt(Math.random()*(this.num-1))+1;
        }
        this.isRun = true;
        this.startRadian = 0;
        //公式
        //模拟指针指向 奖品的区域随意位置
        // averageRadian乘以奖品下标加上平均弧度的一半
        var num = this.num*3-N+1,//下标
            averageRadian = this.averageRadian,
            averageRadianHalf =  this.averageRadian/2,
            border = averageRadian*0.1,
            //起点 -border防止停到起点边线
            start = averageRadian*num + averageRadianHalf-border,
            //终点 +border防止停到终点边线
            end =  averageRadian*(num-1)+averageRadianHalf+border,
            endNum = Math.random()*(end-start)+start;
        new Curve({
            duration: this.duration,
            starNum: 0,
            endNum: endNum,
            toFixed:15
        }).start( n => {
            this.startRadian = n;
            this.strokeCircle();
            if(n >= endNum){
                if(this.isRun == false) return false;
                this.complete && this.complete(N);
                this.isRun = false;
            }
        })
    }
}
    return Luckydraw
}));
