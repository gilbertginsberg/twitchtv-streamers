// javascript

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

function showStreamStatus(streamJsonData, user) {
  const streamJson = JSON.parse(streamJsonData);
  console.log(streamJson);
  const spanForStatus = document.createElement('span');
  const userDiv = document.getElementById(user);

  if (streamJson.stream === null) {
    spanForStatus.innerHTML = 'Offline';
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers offline');
  } else {
    spanForStatus.innerHTML = `${streamJson.stream.game} ${streamJson.stream.channel.status}`;
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers online');
  }
  spanForStatus.setAttribute('class', 'status');
}

function showChannelLogoAndName(data) {
  // extracts json data that'll be used in app
  const json = JSON.parse(data);
  console.log(json);
  const displayName = json.display_name;
  const userName = json.name;
  const logoSrc = json.logo;

  // creates elements for displaying channel details
  const twitchBox = document.getElementById('twitchBox');
  const div = document.createElement('div');
  const logo = document.createElement('img');
  const spanForUserName = document.createElement('span');
  const anchor = document.createElement('a');

  // set up channel divs with logo and link
  createLogo(logo, logoSrc, displayName);
  createHyperLinkedUserName(anchor, spanForUserName, displayName);

  // adds channel details to streamer container
  div.setAttribute('id', userName);
  div.setAttribute('class', 'streamers');
  div.appendChild(logo);
  div.appendChild(spanForUserName);

  twitchBox.appendChild(div);
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();

  // if ajax response is 200, then handlers are called
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (resource.indexOf('channels') !== -1) {
        showChannelLogoAndName(xhr.responseText);
      } else {
        showStreamStatus(xhr.responseText, user);
      }
    } else {
      console.log(xhr.statusText);
      console.log('There was a problem with the request.');
    }
  };

  xhr.onerror = function () {
    console.log('There was an error!');
  };
  xhr.open('GET', resource);
  xhr.send();
}

function initialize() {
  const users = ['freecodecamp', 'esl_sc2', 'jhovgaard'];
  let channelUrl = '';
  let streamUrl = '';

  users.forEach(function (user) {
    channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${user}`;
    streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${user}`;
    ajaxRequest(channelUrl);
    ajaxRequest(streamUrl, user);
  });
}

window.onload = initialize;
