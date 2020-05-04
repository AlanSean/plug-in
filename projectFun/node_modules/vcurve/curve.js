
(function(self, factory) {
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      self.Curve = factory();
    }
}(this, function() {

    const curve = function(){
       /*
           ___      ___ ________  ___  ___  ________  ___      ___ _______
          |\  \    /  /|\   ____\|\  \|\  \|\   __  \|\  \    /  /|\  ___ \
          \ \  \  /  / \ \  \___|\ \  \\\  \ \  \|\  \ \  \  /  / \ \   __/|
           \ \  \/  / / \ \  \    \ \  \\\  \ \   _  _\ \  \/  / / \ \  \_|/__
            \ \    / /   \ \  \____\ \  \\\  \ \  \\  \\ \    / /   \ \  \_|\ \
             \ \__/ /     \ \_______\ \_______\ \__\\ _\\ \__/ /     \ \_______\
              \|__|/       \|_______|\|_______|\|__|\|__|\|__|/       \|_______|

        */
    };

    var lines = new String(curve);
    lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
    console.log('%c'+lines,'color:#f00;');

    //requestAnimFrame 兼容
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = (callback, element) => {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(() =>{
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = id => {
            clearTimeout(id);
        };
    }

    //参数验证
    function isNumber(value){
        return typeof value === 'number';
    }


    class Curve {

        constructor(obj){
            this.rafId = null;//帧动画id
            this.paused = false;//是否暂停
            this.theNum = 0;//当前开启|暂停中的数值
            this.progress = 0;// 当前执行了多久
            this.duration = Number(obj.duration)*1000 || 1000;
            this.starNum = Number(obj.starNum) || 0;
            this.endNum = Number(obj.endNum) || 1000;
            this.reductionGear = obj.reductionGear !== undefined ? obj.reductionGear  : true;//渐减速
            this.toFixed = Number(obj.toFixed) || 2;//保留小数
            this.startCb = null;
            if(this.starNum == this.endNum){
                throw new Error('开始和结束数值不能为同一个');
            }
        }



        start(cb){
            const { duration, starNum, endNum,rafId } = this;
            if(isNumber(duration) && isNumber(starNum) && isNumber(endNum)){
                this.startCb = cb;
                this.step(duration, starNum, endNum, cb);
            } else {
                throw new Error('duration、starNum，endNum 必须为纯数字，类型可以为number  string')
            }
        }
        /**
         * 更新 持续时间不变，
         * @method update
         * @param  {Number} endNum 新的结束值
         * @param  {Function} cb 可选，不传 默认使用 start传入的回调
         */
        update(endNum,cb){

            const { duration, theNum,rafId } = this;
            if( cb === undefined || typeof cb === 'function'){
                cb = cb ||  this.startCb;
                this.step(duration, theNum, endNum, cb);
            } else {
                throw new Error('update的回调函数必须为函数，或者你不传')
            }
        }
        /**
         * 暂停
         * @method pause 暂停和继续 暂停之后，再次调用即可继续
         * @return {Object} theNum 当前暂时或开始的数值，progress已经执行的时长 paused暂停的状态
         */
        pause(){
            let { paused,
                rafId,
                reductionGear,
                duration,
                progress,
                theNum,
                endNum,
                startCb
            }  = this;
            if(!paused){
                this.paused = true;
                window.cancelAnimationFrame(rafId);
            } else {
                this.paused = false;
                duration = reductionGear ?  duration : duration-progress;
                this.step(duration, theNum, endNum, startCb,progress);

            }
            return {
                theNum: theNum,
                progress: progress,
                paused: this.paused
            }
        }
        /**
        * 目前只实现了正向递增
        * @param { Number }  starNum 开始数值;
        * @param { Number }  endNum 结束数值;
        * @param { callback }  cb  回调函数，附带参数过渡数值。
        * @param { Number }  dTime  时间补偿  用于补偿暂停 再开始速度 从头开始计算的问题
        */
        step(duration, starNum, endNum, cb,dTime){
           let start = null,//当前时间戳
               dValue,
               progress,//执行时长
               id;//帧动画id

           const { rafId, reductionGear } = this;

           const steps = (timestamp) => {
               //清除上一个id
               window.cancelAnimationFrame(id);
                if (!start){
                   start = timestamp
                };
                this.progress =timestamp-start;
                progress = this.progress+(dTime || 0);

                if(progress !== dTime){

                    dValue = Math.min(Math.abs(endNum-starNum) * (reductionGear ? (-Math.pow(2, -10 * this.progress / duration) + 1) * (1/(-Math.pow(2, -10)+1)) : this.progress / duration), Math.abs(endNum-starNum));
                    this.theNum =  Number((starNum > endNum ? starNum-dValue : starNum+dValue).toFixed(this.toFixed));
                    cb && cb(this.theNum,progress/1000);//递增值

                }
               if (this.progress < duration) {
                    id = window.requestAnimationFrame(steps);
                    this.rafId = id;
               }
           }
           id = window.requestAnimationFrame(steps);
           this.rafId = id;
        }
    }
    return Curve;
}))
