

var inputType = "numbertextpassword"
window.inputFill = function(){
    chrome.storage.sync.get('data', function(data){
        var input = document.querySelectorAll("input:not(:disabled):not([readonly])"),
            newArr = [];
        input.forEach( item => {
            if(inputType.indexOf(item.type) > -1){
                newArr.push(item);
            }
        })
        data.data.forEach( item => {
            e = newArr[item.index-1];
            e.value = item.text;
            ["input", "click", "change", "blur"].forEach(function(t) {
                var event = new Event(t, {
                    bubbles: !0,
                    cancelable: !0
                });
                e.dispatchEvent(event);
            });
        });
    });
}
