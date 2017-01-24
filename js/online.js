// online.html javascript

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

function showStreamStatus(parsedJson, user) {
  console.log(parsedJson);
  const spanForStatus = document.createElement('span');
  const userDiv = document.getElementById(user);
  const logo = parsedJson.stream.channel.logo;
  const displayName = parsedJson.stream.channel.display_name;
  const game = parsedJson.stream.game;
  const channelStatus = parsedJson.stream.channel.status;

  // Define media query for devices < 500px
  function mediaQueryOnlineStatusHelper(mq) {
    if (mq.matches) {
      spanForStatus.innerHTML = `${game}`;
    } else {
      spanForStatus.innerHTML = `${game} ${channelStatus}`;
    }
    userDiv.appendChild(spanForStatus);
    userDiv.setAttribute('class', 'streamers online');
  }

  if (parsedJson.stream !== null) {
    showLogoAndUserName(logo, displayName, user);
    if (window.matchMedia) {
      const maxWidth500 = window.matchMedia('(max-width: 500px)');

      maxWidth500.addListener(mediaQueryOnlineStatusHelper);
      mediaQueryOnlineStatusHelper(maxWidth500);
    } else {
      spanForStatus.innerHTML = `${game}`;
      userDiv.appendChild(spanForStatus);
      userDiv.setAttribute('class', 'streamers online');
    }
  }
  spanForStatus.setAttribute('class', 'status');
}

function createStreamDiv(jsonString, user) {
  const json = JSON.parse(jsonString);
  const twitchBox = document.getElementById('twitchBox');
  const div = document.createElement('div');

  if (json.stream !== null) {
    console.log(user);
    div.setAttribute('id', user);
    twitchBox.appendChild(div);

    // callback
    showStreamStatus(json, user);
  }
}

function ajaxRequest(resource, user) {
  const xhr = new XMLHttpRequest();

  // if ajax response is 200, then handlers are called
  xhr.onload = function ajaxResponse() {
    if (xhr.status === 200) {
      createStreamDiv(xhr.responseText, user);
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
  let streamUrl = '';

  users.forEach(function makeAjaxCalls(user) {
    streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${user}`;
    ajaxRequest(streamUrl, user);
  });
}

window.onload = initialize;
