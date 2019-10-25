chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.executeScript({
    code: 'window.inputFill();',
    allFrames: !0
  })
})
