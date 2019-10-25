import Vue from 'vue';
import Area from './index.vue';
import area from './area.js';

var AreaConstructor = Vue.extend(Area);

if(!Vue.prototype.scorllStop){
    /**
     * @param { Boolean }   isHidden判断是否要禁止滚动或者一屏显示
     * @param { Boolean }   isBg判断是否要修改背景为白色
     */
    var scrollTopY;
    Vue.prototype.scorllStop = function(isHidden,isBg){
        if(isHidden){
            scrollTopY = window.scrollTop();
            document.body.style.position= 'fixed';
            document.body.style.top = '-'+scrollTopY+'px';
        } else {
            document.body.className = '';
            document.body.style.top = "";
            window.scrollTotop(scrollTopY);
            scrollTopY = undefined;
        }
        document.body.style.backgroundColor = isBg ? ' #fff' : null;

    }
};


class Instance {
    constructor(obj,currentArea) {
        obj = obj ? obj : {};
        this.data = {
            isShow: false,
            scorllStatus:false,//滚动条状态
            touchStatus: false,
            key: null,//正在滑动的元素
            province: obj.province || null,//一级默认选中项 非必传
            city: obj.city || null,// 二级默认选中项 非必传 传默认一级 不传默认二级  二级默认选择 首项
            area: obj.area || area, // 二级联动数据源
            // 例子 [{"province": "北京市","city": [{"name": "北京市"]}]
            provinceKey: obj.provinceKey || 'province',//一级 要显示的key
            cityArrayKey: obj.cityArrayKey || 'city',//二级 数组的key
            cityKey: obj.cityKey || 'name',//二级数组的中要显示的key
            indeX:{},
        };
        this.areaInstance = null;
        this.currentArea = currentArea;
        this.init(obj.province);
        if(!this.areaInstance){
            document.body.appendChild(this.initInstance().$el);
        }
    }

    init(province) {
        if(province){
            this.setIndeX();
        } else {
            this.data.indeX[this.data.provinceKey] = 0;
            this.data.indeX['old'+this.data.provinceKey]  = 0;
            this.data.indeX[this.data.cityArrayKey] = 0;
            this.data.indeX['old'+this.data.cityArrayKey]  = 0;
        }
    }
    setIndeX(){

        const { data, data:{province,city}} = this;
        let i = 0,k=0,length = data.area.length,citylength,provinces,citys;
        for(i;i<length;i++){
            provinces = data.area[i];

            if(province == provinces[data.provinceKey]){
                this.data.indeX[data.provinceKey] = i;
                this.data.indeX['old'+data.provinceKey]  = i;
                if(city != null){
                    citys = provinces[data.cityArrayKey];
                    for(k;k<citys.length;k++){
                        if(city == citys[k][data.cityKey]){

                            this.data.indeX[data.cityArrayKey] = k;
                            this.data.indeX['old'+data.cityArrayKey]  = k;

                            return false;
                        }
                    }
                }
                return false;
            }
        }
    }
    initInstance(){
        this.areaInstance = new AreaConstructor({
            data: ()=>({...this.data}),
            el: document.createElement('div')
        })
        return this.areaInstance;
    }
    defaultCallback(action){
        const {
                currentArea,
                areaInstance,
                currentArea:{ callback }
            } = this;
        if(currentArea){
            const getSelect = areaInstance.getSelect();
            if(typeof callback === 'function'){
                if(action === 'comfir'){
                    callback && callback({
                        action: action,
                        getSelect: getSelect
                    });
                } else {
                    callback && callback(action)
                }
            }
            if(currentArea.resolve){
                if(action === 'comfir'){
                    currentArea.resolve({
                        action: action,
                        getSelect: getSelect
                    });
                } else {
                    currentArea.resolve({
                        action: action
                    })
                }
            }
        }
    }
    showNextArea(currentArea){
        this.currentArea = currentArea;
        this.areaInstance.callback = (action) => {
            this.defaultCallback(action);
        };
        this.areaInstance.isShow = true;
        return this.areaInstance;
    }
    destroyed(){
        this.areaInstance.$destroy();
        document.body.removeChild(this.areaInstance.$el);
    }
}



export default Instance;
