<template>
    <!-- 二级联动 -->
    <div  class="areaCity"

        :class="{'areaCityShow': isShow}">
        <div class="shadow " @click="handleAction('cancel')"></div>
        <div class="citySelect" >
            <div class="button clearfix">

                <span class="float_left"  @click="handleAction('cancel')">取消</span>
                <span class="float_right" @click="handleAction('comfir')">确定</span>
            </div>
            <div
                class="province"
                :style="{'width':area[0][cityArrayKey] ? '50%': '100%'}"
                :ref="provinceKey"
                @touchstart="touchstart"
                @touchend="touchend(provinceKey)"
                @scroll="scroll(provinceKey)">
                <li
                    v-for="item,index in area"
                    :class="{'select':index==indeX[provinceKey]}"
                    :id="index">{{item[provinceKey]}}</li>
            </div>
            <div
                v-if="area[0][cityArrayKey]"
                class="city"
                :ref="cityArrayKey"
                @touchstart="touchstart()"
                @touchend="touchend(cityArrayKey)"
                @scroll="scroll(cityArrayKey)">
                <li
                    v-for="item,index in area[indeX[provinceKey]][cityArrayKey]"
                    :class="{'select':index==indeX[cityArrayKey]}"
                    :id="index">{{item[cityKey]}}</li>
            </div>
            <div class="listShadow"></div>
        </div>
    </div>
</template>
<script>
    import VCurve from 'vcurve';
    const vcurve = new VCurve({
        duration: 0.2
    });
    var time,time1;//定时器
    export default {
        name: "areaCity",
        watch:{
            isShow:function(newval){
                if(newval){
                    const provinceScrollTop = this.indeX['old'+this.provinceKey] *35;
                    if(this.$refs[this.provinceKey].scrollTop != provinceScrollTop){
                        this.$refs[this.provinceKey].scrollTop = provinceScrollTop;
                    }
                    if(this.$refs[this.cityArrayKey]){
                        const cityScrollTop = this.indeX['old'+this.cityArrayKey] *35;
                        if(this.$refs[this.cityArrayKey].scrollTop != cityScrollTop){
                            this.$refs[this.cityArrayKey].scrollTop = cityScrollTop;
                        }
                    }
                }
                this.scorllStop(newval);
            }
        },
        methods: {
            touchstart(){
                this.touchStatus = true;
            },
            touchend(key){
                this.touchStatus = false;
                this.vcurve(key)
            },
            handleAction(action){
                if(action === 'comfir'){
                    this.indeX['old'+this.provinceKey]  = this.indeX[this.provinceKey];
                    if(this.$refs[this.cityArrayKey]){
                        this.indeX['old'+this.cityArrayKey]  = this.indeX[this.cityArrayKey];
                    }
                } else {
                    this.indeX[this.provinceKey] = this.indeX['old'+this.provinceKey] ;
                    if(this.$refs[this.cityArrayKey]){
                        this.indeX[this.cityArrayKey] = this.indeX['old'+this.cityArrayKey] ;
                    }
                }
                this.isShow = false;
                this.callback && this.callback(action);
            },
            getSelect(){
                const province  = this.area[this.indeX[this.provinceKey]];
                var arr = [province[this.provinceKey]];
                if(province[this.cityArrayKey]){
                    const city  = province[this.cityArrayKey][this.indeX[this.cityArrayKey]][this.cityKey];
                    arr.push(city)
                }
                return arr;
            },
            scroll(key){
                this.indeX[key] = Math.round(this.$refs[key].scrollTop/35);
                if(this.$refs[this.cityArrayKey]){
                    if(key == this.provinceKey && this.$refs[this.cityArrayKey].scrollTop !=0){
                        this.$refs[this.cityArrayKey].scrollTop = 0;
                        this.indeX[this.cityArrayKey] = 0;
                    }
                }
                this.vcurve(key);
            },
            vcurve(key){
                if(this.touchStatus) return false;
                clearTimeout(time);
                time = setTimeout(() => {
                    const divDom = this.$refs[key],
                          { scrollTop } = divDom;
                    if(this.scrollStart || scrollTop%35 == 0) return false;
                    this.scrollStart = true;
                    vcurve.starNum = divDom.scrollTop;
                    vcurve.endNum =  Math.round(scrollTop/35)*35;
                    vcurve.start( n => {
                        if(n == vcurve.endNum){
                            this.scrollStart = false;
                        }
                        divDom.scrollTop = n;
                    });
                    clearTimeout(time);
                },100);
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './index';
</style>
