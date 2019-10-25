import Instance from './instance.js';

export default function (obj) {

    var currentArea, instance= new Instance(obj);
    function areaCity (callback) {
        if (typeof Promise !== 'undefined') {
            return new Promise(function(resolve, reject) {
                currentArea = {
                    callback: callback,
                    resolve: resolve,
                    reject: reject,
                }
                instance.showNextArea(currentArea);
            });

        } else {
            currentArea = {
                callback: callback
            }
            instance.showNextArea(currentArea);
        }
    };
    areaCity.destroyed  = function(){
        instance.destroyed();
    }
    return areaCity;
};
