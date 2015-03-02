/**
 * Responsible for config for each command
 *
 * @param  {string} command
 * @return {object}
 */
function getCommandData (command) {

  function unhandledCommand () {
    return undefined;
  }

  var playerPanelID = '#app-player',
      playlistPanelID = '[id^="collection-app-spotify"]';
      // partial, match first since:
      // the playlist iframe ID can look like this: "collection-app-spotify:app:collection-0-14251312112731"

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
      panelID: playerPanelID,
      selector: 'button.btn-add'
    },
    'delete-from-playlist': {
      panelID: playlistPanelID,
      selector: 'tr.current.playing .tl-more button'
    }
  };

  return commandMap[command] || unhandledCommand();
}

/**
 * Receives message from the extension, containing
 * which command was triggered by Chrome.
 *
 * @param  {object} request
 */
function chromeCommandHandler (request, sender, sendResponse) {

  if (! request.command) {
    console.log('Received message from source other than extension, args:', arguments);
    return
  }

  var command = request.command,
      commandData = getCommandData(command),
      commandActionSelector = commandData.selector || '#' + command;

  if (! commandData) return;

  // spotify UI consists of several iframes (i.e. 'documents'), so
  // we need to muck around with contentDocument
  document
    .querySelector(commandData.panelID)
    .contentDocument
    .querySelector(commandActionSelector)
    .click();

  if (command === 'delete-from-playlist') {
    // Only way to do this seems to be by clicking the ellipsis button
    // in the playlist, so we need to let the menu that pops up
    // properly initialize before proceeding to delete.
    window.setTimeout(function (){
      document
        .querySelector('#context-actions')
        .contentDocument
        .querySelector('#delete-playlist-track')
        .click();

      chromeCommandHandler({command: 'next'});
    }, 500);
  }

}

chrome.runtime.onMessage.addListener(chromeCommandHandler);