//原本想做K线图后来就弃了 就将无用的代码删除去了
(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.KLineMap = factory());
})(this,function(){
    'use strict'
    const $ = (id) =>  document.querySelector(id);


    class Canvas {
        constructor() {
            this.dom = $('#myCanvas');
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.k = {
                width:0,//宽度
                height:0,//高度
                xStart:0,//x轴起点
                xEnd:0,//x轴终点
                yStart:0,//y轴起点
                yEnd:0,//y轴终点
            }
            this._kBinding = {};
            this.kObserver();
            this.canvasInit();
        }
        step(duration, starNum, endNum, cb){
           var start = null,//当前时间戳
                theNum,//当前运行的值
                id,//帧动画id
                progress,//已运行的时长
               dValue;//差值

           const steps = (timestamp) => {
                if (!start){
                   start = timestamp
                };
                progress =timestamp-start;

                dValue = Math.min(Math.abs(endNum-starNum)*progress/duration, Math.abs(endNum-starNum));
                theNum =  (starNum > endNum ? starNum-dValue : starNum+dValue).toFixed(2);
               cb && cb(theNum);//递增值
               if (progress < duration) {
                   id = window.requestAnimationFrame(steps);
               } else {
                   window.cancelAnimationFrame(id);
               }
           }
           id = window.requestAnimationFrame(steps);
        }

        kInit(){
            const { dom,canvas,ctx } = this;
            this.k.xStart = canvas.width*0.1;
            this.k.xEnd = canvas.width*0.95;
            this.k.width = this.k.xEnd-this.k.xStart;
            this.k.yStart = canvas.height*0.1;
            this.k.yEnd = canvas.height*0.85;
            this.k.height = this.k.yEnd-this.k.yStart;
        }
        kObserver(){
            var key1;
            let { k } = this;
            for(key1 in k){
                ((key,value) => {
                    if(k.hasOwnProperty(key)){
                        this._kBinding[key] = {
                            _directives:new Array()
                        };
                        Object.defineProperty(this.k,key,{
                            configurable:true,
                            enumerable:true,
                            get: () => value,
                            set: newVal => {
                                if(newVal != value){
                                    value = newVal;
                                    if(this._kBinding[key]._directives.length>0){
                                        this._kBinding[key]._directives.forEach(function(item){
                                            item && item(newVal);
                                        });
                                    }
                                }
                            }
                        });
                    }
                })(key1,k[key1])
            }
            this._directives();
        }
        drawLine (obj){
            const { ctx, k:{xStart, xEnd, yStart, yEnd} } = this;
            let id = null,
                countx = xStart,
                county = yEnd;
            ctx.strokeStyle = (obj && obj.color) || '#000';
            ctx.lineWidth= (obj && obj.lineWidth) || 2;
            this.step(1000,xStart,xEnd,n=>{
                ctx.beginPath();
                ctx.moveTo(countx,yEnd);
                ctx.lineTo(n,yEnd);
                ctx.stroke();
                countx = n;
            })
            this.step(1000,yEnd,yStart,n=>{
                ctx.beginPath();
                ctx.moveTo(xStart,county);
                ctx.lineTo(xStart,n);
                ctx.stroke();
                county = n;
            })

            return ctx;
        }
        _directives(){
            // this._kBinding['y']._directives.push(newVal => {
            //     console.log(newVal)
            // });
        }
        canvasInit(){
            const { dom,canvas,ctx } = this;
            canvas.width = dom.offsetWidth*2;
            canvas.height = dom.offsetHeight*2;
            canvas.style.width = dom.offsetWidth+'px';
            canvas.style.height = dom.offsetHeight+'px';
            dom.append(canvas);
            this.createFill([0,0,canvas.width,canvas.height],'#f2f2f2');
            this.kInit();
        }
        /**
         * 绘制矩形
         * @method createFill
         * @param  {Object} obj xyXY
         * @param  {String} color 颜色
         * @return {Object} this
         */
        createFill(obj,color){
            const {ctx} = this;
            ctx.fillStyle = color || '#000';
            ctx.fillRect(...obj);
            return this;
        }
        /**
         * @method createLine 绘制线条
         * @param  {Object}  obj xyXYlineWidthcolor
         * @return {Object} this
         */
        createLine(obj){
            const { ctx } = this;
            const { color, lineWidth, x, y, X, Y} = obj;
            let id = null,count = x;
            ctx.strokeStyle = color || '#000';
            ctx.lineWidth= lineWidth || 2;
            this.step(1000,x,X,n=>{
                ctx.beginPath();
                ctx.moveTo(count,y);
                ctx.lineTo(n,Y);
                ctx.stroke();
                count = n;
            })
            return this;
        }
        /**
         * 文字绘制
         * @method creatFont
         * @param  {Array} obj 文字，x,y
         * @param  {Object || callback} style 样式或者回调函数
         * @return {Object} this;
         */
        creatFont(obj,style){
            const { canvas,ctx } = this;
            var width = this.getTextWidth(obj.text);
            this.clear(obj.x-width,obj.y-40,width,40);
            if(typeof style === 'object'){
                ctx.font=style.font ||'24px Arial'
                ctx.textBaseline=style.textBaseline || "middle"
                ctx.fillStyle = style.color || '#000'
                ctx.textAlign = style.textAlign || 'end';
            }
            ctx.fillText(...obj);
            if(typeof style === 'function') style && style(obj);
            return this;
        }
        /**
         * 画布清除
         * @method clear
         * @param  {Array}  obj x y width height
         * @return {Object} this;
         */
        clear(obj){
            const { ctx } = this;
            ctx.clearRect(...obj);
            return this;
        }
        /**
         * 获取文字宽度
         * @method getTextWidth
         * @param  {String} text
         * @return {Number} 文字宽度
         */
        getTextWidth(text){
            return this.ctx.measureText(text).width;
        }
    }

    return Canvas;
});
