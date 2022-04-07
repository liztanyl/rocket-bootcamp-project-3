import axios from 'axios';
import 'regenerator-runtime/runtime';
import './styles.scss';
import { io } from 'socket.io-client';

const socket = io();

// ############### GAME ELEMENTS ################

let currentRound = 0;
const currentTeam = {};
const CLUEGIVER = 'clue giver';
const GUESSER = 'guesser';
const WAITINGTEAM = 'waiting team';
let timerId;

//
// ##############################################################
// ##############################################################
// ------------------------ DOM ELEMENTS ------------------------
// ##############################################################
// ##############################################################
//

// ############## WELCOME SECTION ###############

const welcomeSectionDiv = document.querySelector('#welcome-section');
const welcomeDiv = document.querySelector('#welcome-div');
const signupDiv = document.querySelector('#signup-div');
const loginDiv = document.querySelector('#login-div');

const showSignupBtn = document.querySelector('#show-signup');
const showLoginBtn = document.querySelector('#show-login');
const changeToSignupBtn = document.querySelector('#change-to-signup');
const changeToLoginBtn = document.querySelector('#change-to-login');

const signupBtn = document.querySelector('#signup-btn');
const loginBtn = document.querySelector('#login-btn');

const playerNameDiv = document.querySelector('#player-name');
const teamNameDiv = document.querySelector('#team-name');

// ############# GAME SETUP SECTION #############

const gameSetupSectionDiv = document.querySelector('#game-setup-section');

const gameSetupDiv = document.querySelector('#game-setup-div');
const showCreateGameBtn = document.querySelector('#show-create-game');
const showJoinGameBtn = document.querySelector('#show-join-game');

const createGameDiv = document.querySelector('#create-game-div');
const createGameBtn = document.querySelector('#create-game-btn');

const gameCreatedDiv = document.querySelector('#game-created-div');
const gameIdSpan = document.querySelector('#game-id-span');
const gameCreatedChooseTeamDiv = document.querySelector('#game-created-choose-team-div');

const joinGameDiv = document.querySelector('#join-game-div');
const enterGameIdDiv = document.querySelector('#enter-game-id-div');
const joinGameBtn = document.querySelector('#join-game-id-btn');
const joinGameChooseTeamDiv = document.querySelector('#join-game-choose-team-div');

const changeToJoinGameBtn = document.querySelector('#change-to-join-game');
const changeToCreateGameBtn = document.querySelector('#change-to-create-game');

// ############## GAMEPLAY SECTION ##############

const gameLobbyDiv = document.querySelector('#game-lobby-div');
const gameLobbyStartGameBtn = document.querySelector('#game-lobby-start-game-btn');

const clueGiverDiv = document.querySelector('#clue-giver-div');
const roundInfoDiv = document.querySelector('#round-info-div');
const startTurnBtn = document.querySelector('#clue-giver-start-turn-btn');

const cardViewDiv = document.querySelector('#card-view-div');
const timerDiv = document.querySelector('#timer-div');
// const cardDiv = document.querySelector('#card-div');
const cardNameDiv = document.querySelector('#card-name-div');
const cardDescDiv = document.querySelector('#card-description-div');
const cardPointsDiv = document.querySelector('#card-points-div');
const skipCardBtn = document.querySelector('#skip-card-btn');
const guessedCardBtn = document.querySelector('#guessed-card-btn');

const guesserDiv = document.querySelector('#guesser-div');
const waitingTeamDiv = document.querySelector('#waiting-team-div');

const nextTurnDiv = document.querySelector('#next-turn-div');
const teamTurnOverDiv = document.querySelector('#team-turn-over-div');
const nextTurnBtn = document.querySelector('#next-turn-btn');

const showScoreDiv = document.querySelector('#show-score-div');
const roundOverSpan = document.querySelector('#round-over-span');
const team1PointsDiv = document.querySelector('#team1-points-div');
const team2PointsDiv = document.querySelector('#team2-points-div');

const endRoundPointsDiv = document.querySelector('#end-round-points-div');
const endRoundLeaderDiv = document.querySelector('#end-round-leader-div');
const endRoundStartNextBtn = document.querySelector('#end-round-start-next-btn');

const finalPointsDiv = document.querySelector('#final-points-div');
const endGameWinnerDiv = document.querySelector('#end-game-winner-div');
const endGameGoHomeBtn = document.querySelector('#end-game-go-home-btn');

//
// ##############################################################
// ##############################################################
// ---------------------- HELPER FUNCTIONS ----------------------
// ##############################################################
// ##############################################################
//

const getDocumentCookie = (cookieName) => {
  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith(cookieName))
    ?.split('=')[1];
  if (cookieName === 'userName'
  || cookieName === 'login'
  || cookieName === 'teamName') {
    return cookie;
  }
  return Number(cookie);
};

const checkAuth = async () => {
  const userId = getDocumentCookie('userId');
  const loginHash = getDocumentCookie('login');
  try {
    const { data } = await axios.post('/check-auth', { userId, loginHash });
    if (data.okay) {
      // eslint-disable-next-line no-use-before-define
      updatePlayerNameDiv(data.userName);
      // eslint-disable-next-line no-use-before-define
      changeDisplay(welcomeSectionDiv).hide();
      // eslint-disable-next-line no-use-before-define
      changeDisplay(gameSetupSectionDiv).show();
    } else {
      // eslint-disable-next-line no-use-before-define
      changeDisplay(welcomeSectionDiv).show();
    } }
  catch (error) {
    console.log('something went wrong');
  }
};

const updateCurrentTeam = (responseCurrentTeam) => {
  Object.entries(responseCurrentTeam)
    .forEach(([key, value]) => {
      currentTeam[key] = value;
    });
};

const getRoleForCurrentTurn = (currentTeamDetails) => {
  // if user is in current team
  if (getDocumentCookie('teamId') === currentTeamDetails.id) {
    // if user is clue giver
    if (getDocumentCookie('userId') === currentTeamDetails.userIds[0]) {
      return CLUEGIVER;
    }
    // if user is guesser
    return GUESSER;
  }
  // if user is in opposing team
  return WAITINGTEAM;
};

const formatTimer = (ms) => {
  // calculate minutes & seconds
  let min = Math.floor((ms / 1000 / 60) % 60);
  let sec = Math.floor((ms / 1000) % 60);

  // add leading 0
  if (min < 10) min = `0${min}`;
  if (sec < 10) sec = `0${sec}`;

  // Show min:sec
  return `${min}:${sec}`;
};

const startTimer = () => {
  const seconds = 30;
  let milliseconds = seconds * 1000;
  const delayInMilliseconds = 1000;

  timerDiv.innerText = formatTimer(milliseconds);

  const ref = setInterval(() => {
    timerDiv.innerText = formatTimer(milliseconds);
    if (milliseconds <= 0) clearInterval(ref);
    milliseconds -= delayInMilliseconds;
  }, delayInMilliseconds);

  // eslint-disable-next-line no-use-before-define
  timerId = setTimeout(submitEndTurn, milliseconds);
};

// ############ DOM MANIPULATION ############

/**
 * Function to generate HTML buttons with team names
 * @param div to which the buttons will be appended
 * @param parentDiv to hide when either button is clicked
 * @param teamsArr array with team info
 */
const generateTeamNameBtns = (div, parentDiv, teamsArr) => {
  const introDiv = document.createElement('div');
  introDiv.innerText = 'Choose your team';
  introDiv.classList.add('h5', 'text-center');

  const btnDiv = document.createElement('div');
  btnDiv.classList.add('text-center', 'py-3');

  // create 2 buttons with team names
  teamsArr.forEach((team) => {
    const btn = document.createElement('button');
    btn.value = team.id;
    btn.innerText = team.name;
    btn.classList.add('btn', 'btn-danger', 'mx-3', 'my-2');

    btn.onclick = () => {
      // eslint-disable-next-line no-use-before-define
      submitChooseTeam(parentDiv, team.id);
      div.innerHTML = '';
    };

    btnDiv.append(btn);
  });

  div.append(introDiv);
  div.append(btnDiv);
};

const changeDisplay = (elementVar) => {
  function hide() { elementVar.style.display = 'none'; }
  function show() { elementVar.style.display = 'block'; }
  function toggle() {
    elementVar.style.display === 'none' ? show() : hide();
  }
  return { toggle, hide, show };
};

const addErrorMsgToDiv = (id, text) => {
  const errMsg = text === 'standard'
    ? 'Hm, something went wrong. Please check your fields and try again.'
    : text;
  const divId = `#${id}`;
  const div = document.querySelector(divId);
  div.innerText = errMsg;
  div.classList.add('my-3');
};

const resetSignupFields = () => {
  document.querySelector('#email-signup').value = '';
  document.querySelector('#password-signup').value = '';
  document.querySelector('#name-signup').value = '';
};

const resetLoginFields = () => {
  document.querySelector('#email-login').value = '';
  document.querySelector('#password-login').value = '';
};

const resetTeamNameFields = () => {
  document.querySelector('#team-one-name-input').value = '';
  document.querySelector('#team-two-name-input').value = '';
};

const resetGameIdField = () => {
  document.querySelector('#join-game-id').value = '';
};

const updatePlayerNameDiv = (playerName) => {
  // eslint-disable-next-line no-use-before-define
  playerNameDiv.innerHTML = `Signed in as: ${playerName}`;
};

const updateTeamNameDiv = (teamName) => {
  const gameId = getDocumentCookie('gameId');
  teamNameDiv.innerHTML = `Team: ${teamName}<br>(Game ID: ${gameId})`;
};

const updateRoundInfoDiv = () => {
  roundInfoDiv.innerHTML = '';
  const round = document.createElement('p');
  round.innerHTML = `<b>It's round ${currentRound}.</b>`;

  const rule = document.createElement('p');
  switch (currentRound) {
    case 1:
      rule.innerHTML = 'You can use any word, sound or gesture. But not the name itself. If you use any part of the name, you have to skip that card. Reading the clue text is allowed.';
      break;
    case 2:
      rule.innerHTML = 'Use only 1 word as a clue. It can be anything except the name itself. You can repeat that word as much as you like, but no sounds or gestures.';
      break;
    default: // round 3
      rule.innerHTML = 'Act out the clues. No words. Sound effects are OK (within reason).';
      break;
  }

  roundInfoDiv.classList.add('rounded', 'bg-warning', 'p-3', 'm-3');
  roundInfoDiv.append(round);
  roundInfoDiv.append(rule);
};

// changes divs shown based on player's role
const displayRoleDivs = (role) => {
  switch (role) {
    case CLUEGIVER:
      updateRoundInfoDiv();
      changeDisplay(gameLobbyDiv).hide();
      changeDisplay(guesserDiv).hide();
      changeDisplay(waitingTeamDiv).hide();

      changeDisplay(clueGiverDiv).show();
      changeDisplay(nextTurnBtn).show();
      break;

    case GUESSER:
      changeDisplay(gameLobbyDiv).hide();
      changeDisplay(clueGiverDiv).hide();
      changeDisplay(waitingTeamDiv).hide();
      changeDisplay(nextTurnBtn).hide();

      changeDisplay(guesserDiv).show();
      break;

    default: // waiting team
      changeDisplay(gameLobbyDiv).hide();
      changeDisplay(clueGiverDiv).hide();
      changeDisplay(guesserDiv).hide();
      changeDisplay(nextTurnBtn).hide();

      changeDisplay(waitingTeamDiv).show();
      break;
  }
};

const updateTeamTurnOverDiv = (teamDetails) => {
  teamTurnOverDiv.innerHTML = `
  <p class="h3 mb-3 fw-bold">Time's up!</p> 
  <p>That's the end of Team '${teamDetails.previousTeam.name}'s turn!</p>
  <p>Now it's time for Team '${teamDetails.currentTeam.name}' to give it a shot.</p>
  `;
  changeDisplay(teamTurnOverDiv).show();
};

const updateShowScoreDiv = (nextRoundNum, score, teams) => {
  const roundNum = nextRoundNum === 0 ? 3 : nextRoundNum - 1;
  roundOverSpan.innerText = `That's it for Round ${roundNum}.`;

  // update scores in team1pointsdiv and team2pointsdiv
  team1PointsDiv.innerHTML = `
    <p class="h6">Team: ${teams[0].name}</p>
    <p class="h6">${score[0]} points</p>
    `;
  team2PointsDiv.innerHTML = `
    <p class="h6">Team: ${teams[1].name}</p>
    <p class="h6">${score[1]} points</p>
    `;

  // if there are still rounds to go (nextRound !== 0)
  // update leading team & next button to toggle its display
  if (nextRoundNum > 0) {
    endRoundLeaderDiv.innerHTML = score[0] > score[1]
      ? `<p class="h5">Team '${teams[0].name}' is in the lead!</p>`
      : `<p class="h5">Team '${teams[1].name}' is in the lead!</p>`;
    if (score[0] === score[1]) endRoundLeaderDiv.innerhtml = '<p class="h5 ">It\'s currently a draw!</p>';
    changeDisplay(finalPointsDiv).hide();
    changeDisplay(endRoundPointsDiv).show();
  }
  // if this is the last round (nextRound === 0)
  // update winner div & next button to toggle its display
  else {
    const winningTeam = score[0] > score[1]
      ? teams[0].name
      : teams[1].name;
    endGameWinnerDiv.innerHTML = `<p class="h5">Team '${winningTeam}' wins!</p>`;
    changeDisplay(endRoundPointsDiv).hide();
    changeDisplay(finalPointsDiv).show();
  }
};

/**
 * Function to update cardNameDiv, cardDescDiv & cardPointsDiv with new card info
 * @param cardDetails object containing cardName, cardDesc & cardPoints
 */
const updateCardInfo = (cardDetails) => {
  const { cardName, cardDescription, cardPoints } = cardDetails;
  cardNameDiv.innerText = cardName;
  cardDescDiv.innerText = cardDescription;
  cardPointsDiv.innerText = cardPoints === 1
    ? `${cardPoints} point`
    : `${cardPoints} points`;
};

//
// ##############################################################
// ##############################################################
// ---------------------- WELCOME SECTION -----------------------
// ##############################################################
// ##############################################################
//

// ############# ONCLICK FUNCTIONS ##############

const submitUserSignup = async () => {
  const userData = {
    email: document.querySelector('#email-signup').value,
    password: document.querySelector('#password-signup').value,
    name: document.querySelector('#name-signup').value,
  };
  try {
    const { data } = await axios.post('/signup', userData);
    if (data.errors) { throw new Error('error'); }
    else {
      console.log('signup info', data);
      resetSignupFields();
      updatePlayerNameDiv(userData.name);
      changeDisplay(document.querySelector('#signup-err-msg')).hide();
      changeDisplay(welcomeSectionDiv).hide();
      changeDisplay(gameSetupSectionDiv).show();
    }
  } catch (error) {
    addErrorMsgToDiv('signup-err-msg', 'standard');
  }
};

const submitUserLogin = async () => {
  const userData = {
    email: document.querySelector('#email-login').value,
    password: document.querySelector('#password-login').value,
  };
  try {
    const { data } = await axios.post('/login', userData);
    if (data.errors) { throw new Error('error'); }
    console.log('login info', data);
    resetLoginFields();
    updatePlayerNameDiv(data.userName);
    changeDisplay(document.querySelector('#login-err-msg')).hide();
    changeDisplay(welcomeSectionDiv).hide();
    changeDisplay(gameSetupSectionDiv).show();
  }
  catch (error) {
    addErrorMsgToDiv('login-err-msg', 'standard');
  }
};

// ############## DOM MANIPULATION ##############

showSignupBtn.onclick = () => {
  changeDisplay(welcomeDiv).hide();
  changeDisplay(signupDiv).show();
};

showLoginBtn.onclick = () => {
  changeDisplay(welcomeDiv).hide();
  changeDisplay(loginDiv).show();
};

changeToSignupBtn.onclick = () => {
  resetLoginFields();
  changeDisplay(loginDiv).hide();
  changeDisplay(signupDiv).show();
};

changeToLoginBtn.onclick = () => {
  resetSignupFields();
  changeDisplay(signupDiv).hide();
  changeDisplay(loginDiv).show();
};

signupBtn.onclick = submitUserSignup;
loginBtn.onclick = submitUserLogin;

//
// ##############################################################
// ##############################################################
// --------------------- GAME SETUP SECTION ---------------------
// ##############################################################
// ##############################################################
//

// ############# ONCLICK FUNCTIONS ##############

const submitCreateGame = async () => {
  const teamData = {
    team1name: document.querySelector('#team-one-name-input').value,
    team2name: document.querySelector('#team-two-name-input').value,
  };
  try {
    const { data } = await axios.post('/create-game', teamData);
    console.log('game info', data);

    if (data.error) {
      addErrorMsgToDiv('create-game-err-msg', data.error);
      return;
    }

    gameIdSpan.innerText = data.gameId;
    socket.emit('join-room', data.gameId, (result) => {
      console.log(result.data);
    });

    resetTeamNameFields();
    generateTeamNameBtns(gameCreatedChooseTeamDiv, gameCreatedDiv, data.teams);
    changeDisplay(createGameDiv).hide();
    changeDisplay(gameCreatedDiv).show();
  } catch (error) {
    addErrorMsgToDiv('create-game-err-msg', 'standard');
  }
};

const submitJoinGame = async () => {
  const gameId = document.querySelector('#join-game-id').valueAsNumber;
  try {
    const { data } = await axios.post('/join-game', { gameId });
    console.log('teams', data);

    if (data.error) {
      addErrorMsgToDiv('join-game-err-msg', data.error);
      return;
    }

    socket.emit('join-room', gameId, (result) => {
      console.log(result.data);
    });

    resetGameIdField();
    generateTeamNameBtns(joinGameChooseTeamDiv, joinGameDiv, data);
    changeDisplay(enterGameIdDiv).hide();
    changeDisplay(joinGameChooseTeamDiv).show();
  } catch (error) {
    console.log(error);
    addErrorMsgToDiv('join-game-err-msg', 'standard');
  }
};

const submitChooseTeam = async (fromDiv, teamId) => {
  const userTeamData = {
    userId: getDocumentCookie('userId'),
    gameId: getDocumentCookie('gameId'),
    teamId,
  };
  try {
    const { data } = await axios.post('/choose-team', userTeamData);
    console.log('chosen team', data);
    updateTeamNameDiv(data.teamName);
    changeDisplay(fromDiv).hide();
    changeDisplay(gameLobbyDiv).show();
  } catch (error) {
    console.log(error.message);
  }
};

// ############## DOM MANIPULATION ##############

showCreateGameBtn.onclick = () => {
  changeDisplay(gameSetupDiv).hide();
  changeDisplay(gameCreatedDiv).hide();
  changeDisplay(gameCreatedChooseTeamDiv).show();
  changeDisplay(createGameDiv).show();
};

showJoinGameBtn.onclick = () => {
  changeDisplay(gameSetupDiv).hide();
  changeDisplay(joinGameChooseTeamDiv).hide();
  changeDisplay(enterGameIdDiv).show();
  changeDisplay(joinGameDiv).show();
};

createGameBtn.onclick = submitCreateGame;
joinGameBtn.onclick = submitJoinGame;

changeToJoinGameBtn.onclick = () => {
  resetTeamNameFields();
  changeDisplay(createGameDiv).hide();
  changeDisplay(joinGameDiv).show();
};

changeToCreateGameBtn.onclick = () => {
  resetGameIdField();
  changeDisplay(joinGameDiv).hide();
  changeDisplay(createGameDiv).show();
};

//
// ##############################################################
// ##############################################################
// ---------------------- GAMEPLAY SECTION ----------------------
// ##############################################################
// ##############################################################
//

// ############# ONCLICK FUNCTIONS ##############

const submitStartGameplay = async () => {
  const gameInfo = {
    gameId: getDocumentCookie('gameId'),
    teamId: getDocumentCookie('teamId'),
  };
  try {
    const { data } = await axios.post('/start-game', gameInfo);
    console.log('round & team info', data);

    if (currentTeam.id !== data.currentTeam.id) {
      currentRound = data.currentRound;
      updateCurrentTeam(data.currentTeam);

      const role = getRoleForCurrentTurn(currentTeam);
      changeDisplay(gameLobbyDiv).hide();
      changeDisplay(showScoreDiv).hide();
      displayRoleDivs(role);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const submitStartTurn = async () => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/start-turn/${gameId}`);
    console.log('card info', data);
    startTimer();
    updateCardInfo(data);
    changeDisplay(clueGiverDiv).hide();
    changeDisplay(cardViewDiv).show();
  } catch (error) {
    console.log(error.message);
  }
};

const submitSkipCard = async () => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/skip-card/${gameId}`);
    console.log('card info', data);
    updateCardInfo(data);
  } catch (error) {
    console.log(error.message);
  }
};

const submitGuessedCard = async () => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/guessed-card/${gameId}`);
    console.log('card info', data);

    if (data.cards) { updateCardInfo(data.cards); } // if still have cards in deck
    else { // if no more cards in deck (ie round is over)
      clearTimeout(timerId);

      const {
        currentRound: nextRound,
        score,
        teams,
      } = data;

      updateShowScoreDiv(nextRound, score, teams);
      changeDisplay(cardViewDiv).hide();
      changeDisplay(showScoreDiv).show();

      currentRound = nextRound;

      socket.emit('empty-deck', gameId); // inform everyone in game room
    }
  } catch (error) {
    console.log(error.message);
  }
};

const submitEndTurn = async () => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/end-turn/${gameId}`);
    console.log('end turn', data);

    const {
      previousTeamIndex,
      currentTeamIndex,
      teams,
    } = data;

    updateCurrentTeam(data.currentTeam);
    updateTeamTurnOverDiv({
      previousTeam: teams[previousTeamIndex],
      currentTeam: teams[currentTeamIndex],
    });

    const role = getRoleForCurrentTurn(currentTeam);
    nextTurnBtn.onclick = () => {
      changeDisplay(nextTurnDiv).hide();
      displayRoleDivs(role);
    };

    changeDisplay(cardViewDiv).hide();
    changeDisplay(nextTurnDiv).show();

    socket.emit('end-turn', gameId); // inform everyone in game room
  } catch (error) {
    console.log(error.message);
  }
};

const submitCheckGameStatus = async (isRoundOver) => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/check-game-status/${gameId}`);
    console.log('check round & team info', data);

    const {
      currentRound: nextRound,
      score,
      previousTeamIndex,
      currentTeamIndex,
      teams,
    } = data;

    // update currentTeam if different
    if (currentTeam.id !== data.currentTeam.id) {
      updateCurrentTeam(data.currentTeam);
    }

    // if coming from socket round-over
    if (isRoundOver) {
      updateShowScoreDiv(nextRound, score, teams);
      changeDisplay(showScoreDiv).show();
    }
    // if game was updated and round is over
    else if (currentRound !== nextRound) {
      updateShowScoreDiv(nextRound, score, teams);
      changeDisplay(showScoreDiv).show();
      currentRound = nextRound;
    }
    // if same round, different turn (next team)
    else {
      updateTeamTurnOverDiv({
        previousTeam: teams[previousTeamIndex],
        currentTeam: teams[currentTeamIndex],
      });

      const role = getRoleForCurrentTurn(currentTeam);
      role === CLUEGIVER
        ? changeDisplay(nextTurnBtn).show()
        : changeDisplay(nextTurnBtn).hide();

      nextTurnBtn.onclick = () => {
        changeDisplay(nextTurnDiv).hide();
        displayRoleDivs(role);
      };

      changeDisplay(nextTurnDiv).show();
    }

    changeDisplay(guesserDiv).hide();
    changeDisplay(waitingTeamDiv).hide();
  } catch (error) {
    console.log(error.message);
  }
};

const submitStartNewRound = async () => {
  const gameId = getDocumentCookie('gameId');
  try {
    const { data } = await axios.post(`/check-game-status/${gameId}`);
    console.log('start new round. round & team info', data);

    currentRound = data.currentRound;
    updateCurrentTeam(data.currentTeam);

    const role = getRoleForCurrentTurn(currentTeam);
    changeDisplay(gameLobbyDiv).hide();
    changeDisplay(showScoreDiv).hide();
    changeDisplay(nextTurnDiv).hide();
    displayRoleDivs(role);
  } catch (error) {
    console.log(error.message);
  }
};

// ############## DOM MANIPULATION ##############

gameLobbyStartGameBtn.onclick = submitStartGameplay;
startTurnBtn.onclick = submitStartTurn;
skipCardBtn.onclick = submitSkipCard;
guessedCardBtn.onclick = submitGuessedCard;
endRoundStartNextBtn.onclick = submitStartNewRound;
endGameGoHomeBtn.onclick = () => {
  changeDisplay(showScoreDiv).hide();
  changeDisplay(gameSetupSectionDiv).show();
  changeDisplay(gameSetupDiv).show();
  teamNameDiv.innerHTML = '';
};

//
// ##############################################################
// ##############################################################
// --------------------- GAME INIT & SOCKET ---------------------
// ##############################################################
// ##############################################################
//

checkAuth();

socket.on('next-team-turn', () => {
  submitCheckGameStatus();
  changeDisplay(gameLobbyDiv).hide();
  changeDisplay(teamTurnOverDiv).show();
  console.log('NEXT TEAM');
});

socket.on('round-over', () => {
  clearTimeout(timerId);
  submitCheckGameStatus(true);
  changeDisplay(teamTurnOverDiv).hide();
  console.log('ROUND OVER');
});
