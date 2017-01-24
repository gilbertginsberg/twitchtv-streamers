 // index.html javascript

// defines logo, link, and placeholder functions
function createLogo(logoEl, logoSrc, displayName) {
  logoEl.setAttribute('src', logoSrc);
  logoEl.setAttribute('alt', `Twitch TV - ${displayName} logo`);
}

function createHyperLinkedUserName(anchor, spanForUserName, displayName) {
  const anchorEl = anchor;
  anchorEl.innerHTML = displayName;
  anchor.setAttribute('href', `https://www.twitch.tv/${displayName}`);
  spanForUserName.appendChild(anchor);
}

function showPlaceholderIfNoAccount(parsedJson, user) {
  const channelDiv = document.getElementById(user);
  const span = document.createElement('span');

  span.innerHTML = parsedJson.message;
  span.setAttribute('class', 'placeholderSpan');
  channelDiv.appendChild(span);
}

function showChannelLogoAndNameOrPlaceholder(parsedJson, user) {
  console.log(parsedJson);
  const displayName = parsedJson.display_name;
  const logoSrc = parsedJson.logo;

  // creates elements for displaying channel details
  const channelDiv = document.getElementById(user);
  const logo = document.createElement('img');
  const spanForUserName = document.createElement('span');
  const anchor = document.createElement('a');

  // set up channel with logo and link OR placeholder if account doesn't exist
  if (parsedJson.error) {
    showPlaceholderIfNoAccount(parsedJson, user);
  } else {
    createLogo(logo, logoSrc, displayName);
    createHyperLinkedUserName(anchor, spanForUserName, displayName);
    // adds channel details to streamer container
    channelDiv.appendChild(logo);
    channelDiv.appendChild(spanForUserName);
  }
}

function showStreamStatus(streamJsonData, user) {
  const streamJson = JSON.parse(streamJsonData);
  console.log(streamJson);
  const spanForStatus = document.createElement('span');
  const userDiv = document.getElementById(user);
  const maxWidth500 = window.matchMedia('(max-width: 500px)');
  function mediaQueryOnlineStatusHelper(maxWidth500) {
    if (maxWidth500.matches) {
      console.log('matchMedia is being called');
      spanForStatus.innerHTML = `${streamJson.stream.game}`;
    } else {
      console.log('matchMedia is NOT being called');
      spanForStatus.innerHTML = `${streamJson.stream.game} ${streamJson.stream.channel.status}`;
    }
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers online');
  }

  if (streamJson.stream === null) {
    spanForStatus.innerHTML = 'Offline';
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers offline');
  } else {
    maxWidth500.addListener(mediaQueryOnlineStatusHelper);
    mediaQueryOnlineStatusHelper(maxWidth500);
  }
  spanForStatus.setAttribute('class', 'status');
}

function createChannelBoxes(jsonString, user) {
  const json = JSON.parse(jsonString);
  const twitchBox = document.getElementById('twitchBox');
  const channelDiv = document.createElement('div');

  channelDiv.setAttribute('id', user);
  channelDiv.setAttribute('class', 'streamers');
  twitchBox.appendChild(channelDiv);

  // callback
  showChannelLogoAndNameOrPlaceholder(json, user);
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();

  // if ajax response is 200, then handlers are called
  xhr.onload = function ajaxResponse() {
    if (xhr.status === 200) {
      if (resource.indexOf('channels') !== -1) {
        createChannelBoxes(xhr.responseText, user);
      } else {
        showStreamStatus(xhr.responseText, user);
      }
    } else {
      console.log(`Appears to be a problem with req. Status is ${xhr.statusText}`);
    }
  };

  // onerror calls your callback function is there's an error with the request
  xhr.onerror = function errorResponse() {
    console.log('There was an error!');
  };
  xhr.open('GET', resource, false);
  xhr.send();
}

function initialize() {
  const users = ['freecodecamp', 'esl_sc2', 'jhovgaard', 'brunofin', 'comster404'];
  let channelUrl = '';
  let streamUrl = '';

  users.forEach(function makeAjaxCalls(user) {
    channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${user}`;
    streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${user}`;
    ajaxRequest(channelUrl, user);
    ajaxRequest(streamUrl, user);
  });
}

window.onload = initialize;
