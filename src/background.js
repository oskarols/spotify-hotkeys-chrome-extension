console.log('INIT SPOTIFY EXTENSION');
// chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)

var port = chrome.runtime.connect();

function onCommand(command) {

  chrome.tabs.query({url: 'https://play.spotify.com/*'}, function(tabs) {
    tabs.map(function sendCommand(tab) {
      chrome.tabs.sendMessage(tab.id, {
        "command": command
      });
    });
  });
}

chrome.commands.onCommand.addListener(onCommand);


// chrome.runtime.onMessage.addListener(function callback)

// window.addEventListener("spotify.enhancement.", function(event) {
//   // We only accept messages from ourselves
//   if (event.source != window)
//     return;

//   if (event.data.type && (event.data.type == "FROM_PAGE")) {
//     console.log("Content script received: " + event.data.text);
//     port.postMessage(event.data.text);
//   }
// }, false);
