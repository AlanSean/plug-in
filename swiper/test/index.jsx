import React, { Component } from 'react';
import Swiper from '../swiper';
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            a:1,
            swiper: {
                cycle:2000,//切换时间 默认5000
                duration:300,//过渡时间 默认 500
                activeClassName:"active"//在视口中元素的类名 默认 swiper-slide-active
            }
        }
    }
    render(){
        let li = [],
            i = 0;
        while (i < 5) {
            li[li.length] = <li  key={i}>{i}</li>
            i++;
        }
        return (
            <div className="my"  style={{
                    width:'100vw',height:'100vh'
                }}>
                <Swiper options={this.state.swiper} >
                    {li}
                </Swiper>
            </div>
    )}
}
export default Home
