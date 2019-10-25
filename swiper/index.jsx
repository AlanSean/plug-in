import React, {Component} from 'react';
import './index.scss';

window.requestAnimationFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
        window.setTimeout(t, 1e3 / 60)
    }
}()

var hidden,
    state,
    visibilityChange,
    hiddenArray = ['','moz','ms','webkit'];
for(var len = hiddenArray.length,i = 0;i < len;i++){
    let hiddenkey = hiddenArray[i] === '' ? hiddenArray[i]+'hidden' : hiddenArray[i]+'Hidden';
    if(typeof document[hiddenkey] !== 'undefined'){
        if(hiddenArray[i] !== ''){
            hidden = hiddenArray[i]+'Hidden'
            visibilityChange =  hiddenArray[i]+"visibilitychange";
            state =  hiddenArray[i]+"VisibilityState";
        } else {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
            state = "visibilityState";
        }
    }
}
class Swiper extends Component {
    constructor(props) {
        super(props);
        let options = this.props.options || '';
        this.state = {
            start:true,//开关 后续再开发
            activeClassName:options.className || "swiper-slide-active",//在视口中元素的类名
            cycle:parseInt(options.cycle) || 5000,//循环周期
            duration:parseInt(options.duration)  || 500,//过渡时间
            swiperSlideWidth:0,//子元素的父级宽度
            currentX: 0,//位移
            actionTouch: 0,//点击位置
            moveTouch: 0,//移动x
            endTouch: 0,//停止x
            maxWidth:window.innerWidth,//元素宽度
            index: 0,//记录
            maxIndex:0,//最大数
            flag: false//过渡
        }
    }
    componentWillMount() {
        let children = this.props.children;
        //拷贝
        var zero = Object.assign({},this.props.children[0])
        var last = Object.assign({},this.props.children[this.props.children.length-1])
        //篡改唯一标识避免冲突
        Object.defineProperty(last,'key',{
            configurable :true,
            value:'-1'
        })
        //篡改key
        Object.defineProperty(zero,'key',{
            configurable :true,
            value:String(children.length)
        })
        this.props.children.unshift(last);
        this.props.children[children.length] = zero;
    }
    componentDidMount() {
        let len =  this.refs.swiperSlide.children.length;
        const { maxWidth,index,start } = this.state;
        this.setState({
            swiperSlideWidth:len*window.innerWidth,
            maxIndex:2-len,
            currentX:(index+1)*maxWidth*-1
        },()=>{
            if(start){
                this.init();
            }
        })
    }
    componentWillUnmount(){
        clearInterval(this.time);
        clearInterval(this.times);
    }
    init = () => {
        const { index,maxWidth} = this.state;
        this.swiper();
        // this.classChange(index+1);
        window.addEventListener('resize',()=>{
            this.setState({maxWidth: window.innerWidth})
        })
         // 添加监听器，在title里显示状态变化
        document.addEventListener(visibilityChange, () =>{
            if(document[hidden] || document[state] == 'hidden'){
                clearInterval(this.time);
                clearInterval(this.times);
            } else {
                this.swiper();
            }
        }, false);
    }
    step = (date,num,cb) => {
        var start = null;
        let { index } = this.state;
        function step(timestamp){
            if (!start) start = timestamp;
            var progress = timestamp - start;
            var a = Math.min(progress/date*num, num);
            cb && cb(a)
            if (progress < date) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step)
    }
    classChange = (index) =>{
        index = index+1;
        const { activeClassName } = this.state;
        const swiperSlideChildren = this.refs.swiperSlide.children;
        const len = swiperSlideChildren.length;
        for(let i=0;i < len;i++){
            if(i == index){
                swiperSlideChildren[i].className +=" "+activeClassName;
            } else {
                swiperSlideChildren[i].className = swiperSlideChildren[i].className.replace(" "+activeClassName,"");
            }
        }
    }
    swiper = () => {
        let add;
        let {index,maxWidth,maxIndex,cycle,duration,currentX} = this.state;
        this.time = setInterval(() => {
            index = index+1;
            if(index >= Math.abs(maxIndex)){
                index = 0;
            }
            this.setState({
                flag: false,
            })
            this.setState({
                index: index,
            },()=>{
                this.classChange(index);
                this.step(duration,maxWidth,(a)=>{
                    this.setState({
                        currentX:0-a-(index*maxWidth)
                    })
                })
            })
        }, cycle)
    }
    touch = (e) => {
        clearInterval(this.time);
        clearInterval(this.times);
        let clientX = e.touches ? e.touches[0].clientX : e.pageX;
        if(!e.touches){
            window.onmousemove  = null;
            window.onmouseup  = null;
            window.onmousemove  = (e) =>{
                this.move(e);
            }
            window.onmouseup = ()=>{
                window.onmousemove  = null;
                this.end();
            }
        }
        this.setState({flag: false, actionTouch: clientX})
    }
    move = (e) => {

        let clientX = e.touches ? e.touches[0].clientX : e.pageX;

        const {moveTouch, actionTouch, currentX, maxWidth,maxIndex} = this.state;

        if (clientX - actionTouch === 0) return;

        const index = Math.round(currentX / maxWidth);

        let direction = clientX - actionTouch > 0 ? 'RIGHT' : 'LEFT';

        let num = Math.abs(clientX - actionTouch) > 1 ? (clientX - actionTouch) : 0;
            // num = (index >= 0 && direction === 'RIGHT') || (direction === 'LEFT' && index == maxIndex) ? num / 3 : num;

        let random = clientX !== actionTouch ? (Math.random(1) * 0.01) + num : 0;

        if( (direction === 'LEFT' && index == maxIndex  && currentX <= (maxIndex*maxWidth)-(maxWidth/2.5)) || ( index == 0 && direction === 'RIGHT' && currentX >= (-1*maxWidth/2) )) {

            this.setState({
                actionTouch: clientX,
                moveTouch: 0 - random,
                endTouch: clientX,
                currentX: index == maxIndex ? 0-(maxWidth/2.5) : (maxIndex*maxWidth)-(maxWidth/2)
            })
        } else {
            this.setState({
                actionTouch: clientX,
                moveTouch: 0 - random,
                endTouch: clientX,
                currentX: this.state.currentX + random
            })
        }
    }
    end = () => {
        window.onmousemove  = null;//解绑事件
        window.onmouseup  = null;//解绑事件

        const endTouch = this.state.endTouch;
        const {currentX, maxWidth,maxIndex} = this.state;

        let index = Math.round(currentX / maxWidth);
        let currentx;

        if (index >= 0 || index == -0) {
            index = maxIndex;
            currentx = maxWidth*maxIndex;
        } else {
            if (Math.abs(index) >= Math.abs(maxIndex)) {
                currentx = index * maxWidth
            } else {
                currentx = index * maxWidth
            }
        }
        this.setState({
            flag: true,
            index: Math.abs(index)-1,
            currentX: currentx
        },()=>{
            this.classChange(Math.abs(index)-1);
            this.swiper();
        })
    }
    render() {
        let dom;
        return (<div className="swiper">
            <div
                ref='swiperSlide'
                onTouchStart={this.touch}
                onTouchMove={this.move}
                onTouchEnd={this.end}
                onMouseDown={this.touch}
                onMouseUp={this.end}
                className={`swiper-slide ${this.state.flag ? 'active': ''}`}
                style={{
                    width: `${this.state.swiperSlideWidth}px`,
                    transform: `translate3d(${this.state.currentX}px,0,0)`
                }}>
                {this.props.children}
            </div>
        </div>);
    }
}

export default Swiper;
