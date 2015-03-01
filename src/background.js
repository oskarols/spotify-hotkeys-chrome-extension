console.log('INIT');

function getCommandData (command) {
  function undefinedDocument () {
    console.log('SPOTIFY::UNDEFINED PANEL COMMAND::' + command);
    return undefined;
  };

  var playerPanelID = '#app-player',
      collectionPanelID = '[id^="collection-app-spotify"]'; // partial, match first since:
  // Collection ID example: "collection-app-spotify:app:collection-0-1425223339731"

  // If missing selector, assume key is selector
  var commandMap = {
    'play-pause': {
      panelID: playerPanelID
    },
    'next': {
      panelID: playerPanelID
    },
    'previous': {
      panelID: playerPanelID
    },
    'track-add': {
      panelID: collectionPanelID,
      selector: 'tr.current.playing .btn-add' // need to use tr else it confuses it with something else ..
    },
    'delete-from-playlist': '' // not sure what to od here ..
  };

  return commandMap[command] || undefinedDocument();
};

function onCommand(command) {
  chrome.tabs.query({url: 'https://play.spotify.com/*'}, function(tabs) {

    // Open a spotify tab if one does not exist yet.
    if (tabs.length === 0) {
      chrome.tabs.create({url: 'https://play.spotify.com'});
    }

    var commandData = getCommandData(command),
        commandActionSelector = commandData.selector || '#' + command;

    // spotify UI consists of several iframes (i.e. 'documents')
    var code = "document.querySelector('" + commandData.panelID + "').contentDocument.querySelector('" + commandActionSelector + "').click()";

    console.log(code);
    // Apply command on all spotify tabs.
    for (var tab of tabs) {
      chrome.tabs.executeScript(tab.id, {code: code});
    }

    // Unload background page as soon as we're done. Disable this for debugging
    // window.close();
  });
};

chrome.commands.onCommand.addListener(onCommand);
