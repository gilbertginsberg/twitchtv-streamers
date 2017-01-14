// javascript

// defining helper functions
function createLogo(logoEl, logoSrc, displayName) {
  logoEl.setAttribute('src', logoSrc);
  logoEl.setAttribute('alt', 'Twitch TV - ' + displayName + ' logo');
}

function createHyperLinkedUserName(anchor, spanForUserName, displayName) {
  anchor.innerHTML = displayName;
  anchor.setAttribute('href', 'https://www.twitch.tv/' + displayName);
  spanForUserName.appendChild(anchor);
}

function showStreamStatus(streamData, user) {
  const streamJSON = JSON.parse(streamData);
  console.log(streamJSON);
  const spanForStatus = document.createElement('span');
  const userId = document.getElementById(user);
  console.log('userId is ' + userId)

  if (streamJSON.stream === null) {
    spanForStatus.innerHTML = 'Offline';
    userId.appendChild(spanForStatus);
  } else {
    spanForStatus.innerHTML = 'Online';
    userId.appendChild(spanForStatus);
  }
}

function showChannelLogoAndName(data) {
  // extracts json data that'll be used in app
  const json = JSON.parse(data);
  console.log(json);
  const displayName = json.display_name;
  const userName = json.name;
  const channelUrl = json.url;
  const logoSrc = json.logo;

  // creates elements for displaying channel details
  const div = document.createElement('div');
  const logo = document.createElement('img');
  const spanForUserName = document.createElement('span');
  const anchor = document.createElement('a');

  const twitchBox = document.getElementById('twitchBox');

  createHyperLinkedUserName(anchor, spanForUserName, displayName);
  createLogo(logo, logoSrc, displayName);

  // adds channel details to streamer container
  div.setAttribute('id', userName);
  div.setAttribute('class', 'streamers');
  div.appendChild(logo);
  div.appendChild(spanForUserName);

  // appends channel with all its details included
  twitchBox.appendChild(div);
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();
  console.log('called');

  // if ajax response is 200, then handlers are called
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (resource.indexOf('channels') !== -1) {
            showChannelLogoAndName(xhr.responseText);
          } else if (resource.indexOf('streams') !== -1) {
            showStreamStatus(xhr.responseText, user);
          }
        } else {
          console.log(xhr.statusText);
          console.log('There was a problem with the request.');
        }
      }
    };

  xhr.onerror = function() {
    console.log('There was an error!');
  };
  xhr.open('GET', resource);
  xhr.send();
}

function initialize() {
  const users = ['freecodecamp', 'esl_sc2', 'jhovgaard'];
  let channelUrl = '';
  let streamUrl = '';

  for (let i = 0; i < users.length; i += 1) {
    channelUrl = 'https://wind-bow.gomix.me/twitch-api/channels/' + users[i];
    streamUrl = 'https://wind-bow.gomix.me/twitch-api/streams/' + users[i];
    ajaxRequest(channelUrl);
    ajaxRequest(streamUrl, users[i]);
  }
}

window.onload = initialize;
