if (window.history['scrollRestoration']) {
    history.scrollRestoration = 'manual'; //改为manual之后，就不会记录滚动位置
}
import VCurve from 'vcurve';
const vcurve = new VCurve({
    duration: 1
})
/**
 * 获取window滚动条位置
 */
var supportPageOffset = window.pageYOffset !== undefined;
var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
export function scrollTop() {
    return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
};
export function scrollLeft() {
    return supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
};
/**
 * 控制Y 滚动条的位置
 * @param { Obj }  scroll.top 滚动的位置
 * @param { Obj }  scroll.behavior smooth 平滑 暂时还没实现
 */
export function scrollTotop(scroll) {
    if (scroll !== undefined) {
        if (window.scrollTop() == (scroll.top || scroll)) {
            return;
        }
        if (scroll.behavior && scroll.behavior == 'smooth') {
            vcurve.starNum = window.scrollTop();
            vcurve.endNum = scroll.top;
            vcurve.start(n => {
                if (window.scrollTo) {
                    window.scrollTo(0, n);
                } else if (document.documentElement.scrollTop) {
                    document.documentElement.scrollTop = n;
                } else if (document.body.scrollTop) {
                    document.body.scrollTop = n;
                }
            })
            return;
        }

        if (window.scrollTo) {
            window.scrollTo(0, scroll.top || scroll);
        } else if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = scroll.top || scroll;
        } else if (document.body.scrollTop) {
            document.body.scrollTop = scroll.top || scroll;
        }
    }
}


/**
 * @param { Boolean }   isHidden判断是否要禁止滚动或者一屏显示
 * @param { Boolean }   isBg判断是否要修改背景为白色
 */
const bodyOverFlow = '.bodyOverFlow {position:fixed;width:100%;}.wirteBg{background-color:#fff;}';
var scrollTopY;
export const scorllStop = function (isHidden, isBg) {

    if (document.getElementById('#react-style')) {
        const style = document.createElement('style');
        style.id = 'react-style'
        style.innerHTML = bodyOverFlow;
        document.head.append(style);
    }
    if (isHidden) {
        scrollTopY = scrollTop();
        document.body.className = 'bodyOverFlow';
        document.body.style.top = '-' + scrollTopY + 'px';

    } else if (/^(bodyOverFlow)|(wirteBg)$/g.test(document.body.className)) {
        document.body.className = '';
        document.body.style.top = "";
        scrollTotop(scrollTopY);
        scrollTopY = 0;
    }
    document.body.className += isBg ? ' wirteBg' : "";
};