// online.html javascript
function createStreamDiv(user) {
  const twitchBox = document.getElementById('twitchBox');
  const div = document.createElement('div');

  div.setAttribute('id', user);
  twitchBox.appendChild(div);
}

function showLogoAndUserName(logoSrc, displayName, user) {
  // creates elements for displaying channel details
  const div = document.getElementById(user);
  const logo = document.createElement('img');
  const spanForUserName = document.createElement('span');
  const anchor = document.createElement('a');

  // set up channel divs with logo and link
  logo.setAttribute('src', logoSrc);
  logo.setAttribute('alt', `Twitch TV - ${displayName} logo`);

  anchor.innerHTML = displayName;
  anchor.setAttribute('href', `https://www.twitch.tv/${displayName}`);
  spanForUserName.appendChild(anchor);

  // adds channel details to streamer container
  div.setAttribute('class', 'streamers');
  div.appendChild(logo);
  div.appendChild(spanForUserName);
}

function showStreamStatus(streamJsonData, user) {
  const streamJson = JSON.parse(streamJsonData);
  console.log(streamJson);
  const spanForStatus = document.createElement('span');
  const userDiv = document.getElementById(user);

  if (streamJson.stream !== null) {
    showLogoAndUserName(streamJson.stream.channel.logo, streamJson.stream.channel.display_name, user);
    spanForStatus.innerHTML = `${streamJson.stream.game} ${streamJson.stream.channel.status}`;
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers online');
  }
  spanForStatus.setAttribute('class', 'status');
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();

  // if ajax response is 200, then handlers are called
  xhr.onload = function () {
    if (xhr.status === 200) {
      createStreamDiv(user);
      showStreamStatus(xhr.responseText, user);
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
    streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${user}`;
    ajaxRequest(streamUrl, user);
  });
}

window.onload = initialize;
