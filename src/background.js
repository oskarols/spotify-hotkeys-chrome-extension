console.log('INIT SPOTIFY EXTENSION');

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
