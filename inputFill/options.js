let div = document.querySelector('div');
var one = document.querySelector('.one');
var oneText = document.querySelector('.oneText');
var two = document.querySelector('.two');
var twoText = document.querySelector('.twoText');

chrome.storage.sync.get('data', function(data){
    one.value = data.data[0].index;
    oneText.value =  data.data[0].text;
    two.value = data.data[1].index;
    twoText.value =  data.data[1].text;
});
div.addEventListener('click', function() {
    var data = [
        {
            index: one.value,
            text: oneText.value,
        },
        {
            index: two.value,
            text: twoText.value,
        }
    ];
    chrome.storage.sync.set({data: data});
});
