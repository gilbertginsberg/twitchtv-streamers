// index.html javascript

// defines logo and link functions
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

function showChannelLogoAndName(json, user) {
  // extracts json data that'll be used in app

  console.log(json);
  const displayName = json.display_name;
  const logoSrc = json.logo;

  // creates elements for displaying channel details
  const div = document.getElementById(user);
  const logo = document.createElement('img');
  const spanForUserName = document.createElement('span');
  const anchor = document.createElement('a');

  // set up channel divs with logo and link
  createLogo(logo, logoSrc, displayName);
  createHyperLinkedUserName(anchor, spanForUserName, displayName);

  // adds channel details to streamer container
  div.appendChild(logo);
  div.appendChild(spanForUserName);
}

function createChannelBoxes(json, user) {
  const twitchBox = document.getElementById('twitchBox');
  const channelDiv = document.createElement('div');

  channelDiv.setAttribute('id', user);
  channelDiv.setAttribute('class', 'streamers');
  twitchBox.appendChild(channelDiv);

  // callback
  showChannelLogoAndName(json, user);
}

function showStreamStatus(streamJsonData, user) {
  const streamJson = JSON.parse(streamJsonData);
  console.log(streamJson);
  const spanForStatus = document.createElement('span');
  const userDiv = document.getElementById(user);
  const twitchBox = document.getElementById('twitchBox');

  if (streamJson.stream === null && userDiv !== null) {
    spanForStatus.innerHTML = 'Offline';
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers offline');
  } else if (streamJson.stream) {
    twitchBox.removeChild(userDiv);
  }
  spanForStatus.setAttribute('class', 'status');
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();

  // if ajax response is 200, then handlers are called
  xhr.onload = function ajaxResponse() {
    if (xhr.status === 200) {
      if (resource.indexOf('channels') !== -1) {
        const json = JSON.parse(xhr.responseText);
        if (!json.error) {
          createChannelBoxes(json, user);
        }
      } else {
        showStreamStatus(xhr.responseText, user);
      }
    } else {
      console.log(`Appears to be a problem with req. Status is ${xhr.statusText}`);
    }
  };

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
