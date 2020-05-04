interface Props {
    duration?: number
    starNum?: number
    endNum?: number
    reductionGear?: boolean
    toFixed?: number
}
interface Cb { (key?: number): void; }

declare module 'vcurve' {
    export default class Curve {
        public rafId: number | null;//帧动画id
        public paused: boolean;//是否暂停
        public theNum: number;//当前开启|暂停中的数值
        public progress: number// 当前执行了多久
        public duration: number;
        public starNum: number
        public endNum: number
        public reductionGear: boolean//渐减速
        public toFixed: number//保留小数
        public startCb: number
        constructor(props: Props)
        start(cb: Cb): void
        update(endNum: number, cb: Cb): void
        pause(): void
    }
}