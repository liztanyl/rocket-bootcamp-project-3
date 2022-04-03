import axios from 'axios';
import './styles.scss';

//
// ##############################################################
// ##############################################################
// ---------------------- HELPER FUNCTIONS ----------------------
// ##############################################################
// ##############################################################
//

// ############ WELCOME / GAME SETUP ############

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

/**
 * Function to generate HTML buttons with team names
 * @param div to which the buttons will be appended
 * @param parentDiv to hide when either button is clicked
 * @param teamsArr array with team info
 */
const generateTeamNameBtns = (div, parentDiv, teamsArr) => {
  const introDiv = document.createElement('div');
  introDiv.innerText = 'Choose your team:';
  div.append(introDiv);

  // create 2 buttons with team names
  teamsArr.forEach((team) => {
    const btn = document.createElement('button');
    btn.value = team.id;
    btn.innerText = team.name;

    btn.onclick = () => {
      // eslint-disable-next-line no-use-before-define
      submitChooseTeam(parentDiv, team.id);
      div.innerHTML = '';
    };

    div.append(btn);
  });
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

/**
 * Function to update cardNameDiv, cardDescDiv & cardPointsDiv with new card info
 * @param cardDetails object containing cardName, cardDesc & cardPoints
 */
const updateCardInfo = (cardDetails) => {
  const { cardName, cardDescription, cardPoints } = cardDetails;
  // eslint-disable-next-line no-use-before-define
  cardNameDiv.innerText = cardName;
  // eslint-disable-next-line no-use-before-define
  cardDescDiv.innerText = cardDescription;
  // eslint-disable-next-line no-use-before-define
  cardPointsDiv.innerText = cardPoints;
};

//
// ##############################################################
// ##############################################################
// ---------------------- WELCOME SECTION -----------------------
// ##############################################################
// ##############################################################
//

// ################ DOM ELEMENTS ################

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

// ############# ONCLICK FUNCTIONS ##############

const submitUserSignup = () => {
  const userData = {
    email: document.querySelector('#email-signup').value,
    password: document.querySelector('#password-signup').value,
    name: document.querySelector('#name-signup').value,
  };
  axios.post('/signup', userData)
    .then((response) => {
      if (response.data.errors) { throw new Error('error'); }
      else {
        console.log('signup info', response.data);
        changeDisplay(document.querySelector('#signup-err-msg')).hide();
        resetSignupFields();
        changeDisplay(welcomeSectionDiv).hide();
        changeDisplay(gameSetupSectionDiv).show();
      }
    })
    .catch(() => {
      addErrorMsgToDiv('signup-err-msg', 'standard');
    });
};

const submitUserLogin = () => {
  const userData = {
    email: document.querySelector('#email-login').value,
    password: document.querySelector('#password-login').value,
  };
  console.log(userData);
  axios.post('/login', userData)
    .then((response) => {
      if (response.data.errors) { throw new Error('error'); }
      console.log('login info', response.data);
      resetLoginFields();
      changeDisplay(welcomeSectionDiv).hide();
      changeDisplay(gameSetupSectionDiv).show();
    })
    .catch(() => {
      addErrorMsgToDiv('login-err-msg', 'standard');
    });
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
  changeDisplay(loginDiv).hide();
  changeDisplay(signupDiv).show();
};
changeToLoginBtn.onclick = () => {
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

// ################ DOM ELEMENTS ################

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

// ############# ONCLICK FUNCTIONS ##############

const submitCreateGame = () => {
  const teamData = {
    team1name: document.querySelector('#team-one-name-input').value,
    team2name: document.querySelector('#team-two-name-input').value,
  };
  axios.post('/create-game', teamData)
    .then((response) => {
      if (response.data.errors) { throw new Error('error'); }
      console.log('game info', response.data);
      resetTeamNameFields();
      gameIdSpan.innerText = response.data.gameId;
      generateTeamNameBtns(gameCreatedChooseTeamDiv, gameCreatedDiv, response.data.teams);
      changeDisplay(createGameDiv).hide();
      changeDisplay(gameCreatedDiv).show();
    })
    .catch(() => {
      addErrorMsgToDiv('create-game-err-msg', 'standard');
    });
};

const submitJoinGame = () => {
  const gameId = document.querySelector('#join-game-id').valueAsNumber;
  axios.post('/join-game', { gameId })
    .then((response) => {
      console.log('teams', response.data);
      resetGameIdField();
      generateTeamNameBtns(joinGameChooseTeamDiv, joinGameDiv, response.data);
      changeDisplay(enterGameIdDiv).hide();
      changeDisplay(joinGameChooseTeamDiv).show();
    })
    .catch((error) => {
      console.log(error);
      addErrorMsgToDiv('join-game-err-msg', 'standard');
    });
};

const submitChooseTeam = (fromDiv, teamId) => {
  const userTeamData = {
    userId: getDocumentCookie('userId'),
    gameId: getDocumentCookie('gameId'),
    teamId,
  };
  axios.post('/choose-team', userTeamData)
    .then((response) => {
      console.log('chosen team', response.data);
      changeDisplay(fromDiv).hide();
      changeDisplay(gameLobbyDiv).show();
    });
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

//
// ##############################################################
// ##############################################################
// ---------------------- GAMEPLAY SECTION ----------------------
// ##############################################################
// ##############################################################
//

// ################ DOM ELEMENTS ################
const gameLobbyDiv = document.querySelector('#game-lobby-div');
const gameLobbyStartGameBtn = document.querySelector('#game-lobby-start-game-btn');

const clueGiverDiv = document.querySelector('#clue-giver-div');
const roundInfoDiv = document.querySelector('#round-info-div');
const startTurnBtn = document.querySelector('#clue-giver-start-turn-btn');

const cardViewDiv = document.querySelector('#card-view-div');
const timerDiv = document.querySelector('#timer-div');
const cardDiv = document.querySelector('#card-div');
const cardNameDiv = document.querySelector('#card-name-div');
const cardDescDiv = document.querySelector('#card-description-div');
const cardPointsDiv = document.querySelector('#card-points-div');
const skipCardBtn = document.querySelector('#skip-card-btn');
const guessedCardBtn = document.querySelector('#guessed-card-btn');

const guesserDiv = document.querySelector('#guesser-div');
const guesserNextBtn = document.querySelector('#guesser-next-btn');
const waitingTeamDiv = document.querySelector('#waiting-team-div');
const waitingTeamNextBtn = document.querySelector('#waiting-team-next-btn');

const nextTurnDiv = document.querySelector('#next-turn-div');

const roundOverDiv = document.querySelector('#round-over-div');
const roundOverSpan = document.querySelector('#round-over-span');
const roundOverShowPointsBtn = document.querySelector('#round-over-show-points-btn');

const showScoreDiv = document.querySelector('#show-score-div');
const team1PointsDiv = document.querySelector('#team1-points-div');
const team2PointsDiv = document.querySelector('#team2-points-div');

const endRoundPointsDiv = document.querySelector('#end-round-points-div');
const endRoundLeaderDiv = document.querySelector('#end-round-leader-div');
const endRoundStartNextBtn = document.querySelector('#end-round-start-next-btn');

const finalPointsDiv = document.querySelector('#final-points-div');
const endGameWinnerDiv = document.querySelector('#end-game-winner-div');
const endGameGoHomeBtn = document.querySelector('#end-game-go-home-btn');

// ############### GAME ELEMENTS ################

let currentRound = 0;
const currentTeam = {};
const CLUEGIVER = 'clue giver';
const GUESSER = 'guesser';
const WAITINGTEAM = 'waiting team';

// ############# HELPER FUNCTIONS ##############

const checkRoleForCurrentTurn = (currentTeamDetails) => {
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

const updateRoundOverDiv = (nextRoundNum, score, teams) => {
  const roundNum = nextRoundNum === 0 ? 3 : nextRoundNum - 1;
  roundOverSpan.innerText = `That's it for Round ${roundNum}.`;

  // update scores in team1pointsdiv and team2pointsdiv
  team1PointsDiv.innerHTML = `
    Team name: ${teams[0].name}<br>
    Points scored: ${score[0]}
    `;
  team2PointsDiv.innerHTML = `
    Team name: ${teams[1].name}<br>
    Points scored: ${score[1]}
    `;

  // if there are still rounds to go (nextRound !== 0)
  // update leading team & next button to toggle its display
  if (nextRoundNum > 0) {
    endRoundLeaderDiv.innerText = score[0] > score[1]
      ? `Team '${teams[0].name}' is in the lead!`
      : `Team '${teams[1].name}' is in the lead!`;
    if (score[0] === score[1]) endRoundLeaderDiv.innerText = 'It\'s currently a draw!';

    roundOverShowPointsBtn.onclick = () => {
      changeDisplay(roundOverDiv).hide();
      changeDisplay(showScoreDiv).show();
      changeDisplay(endRoundPointsDiv).show();
      changeDisplay(finalPointsDiv).hide();
    };
  }
  // if this is the last round (nextRound === 0)
  // update winner div & next button to toggle its display
  else {
    const winningTeam = score[0] > score[1]
      ? teams[0].name
      : teams[1].name;
    endGameWinnerDiv.innerText = `Team '${winningTeam}' wins!`;

    roundOverShowPointsBtn.onclick = () => {
      changeDisplay(roundOverDiv).hide();
      changeDisplay(showScoreDiv).show();
      changeDisplay(endRoundPointsDiv).hide();
      changeDisplay(finalPointsDiv).show();
    };
  }
};

// ############# ONCLICK FUNCTIONS ##############

const submitStartGameplay = () => {
  const gameInfo = {
    gameId: getDocumentCookie('gameId'),
    teamId: getDocumentCookie('teamId'),
  };

  axios.post('/start-game', gameInfo)
    .then((response) => {
      console.log('round & team info', response.data);
      if (currentTeam.id !== response.data.currentTeam.id) {
        currentRound = response.data.currentRound;
        Object.entries(response.data.currentTeam).forEach(([key, value]) => {
          currentTeam[key] = value;
        });
        const role = checkRoleForCurrentTurn(currentTeam);
        changeDisplay(gameLobbyDiv).hide();
        changeDisplay(roundOverDiv).hide();
        changeDisplay(showScoreDiv).hide();
        switch (role) {
          case CLUEGIVER:
            changeDisplay(guesserDiv).hide();
            changeDisplay(waitingTeamDiv).hide();
            changeDisplay(clueGiverDiv).show();
            break;
          case GUESSER:
            changeDisplay(clueGiverDiv).hide();
            changeDisplay(waitingTeamDiv).hide();
            changeDisplay(guesserDiv).show();
            break;
          default: // waiting team
            changeDisplay(clueGiverDiv).hide();
            changeDisplay(guesserDiv).hide();
            changeDisplay(waitingTeamDiv).show();
            break;
        }
      }
    })
    .catch((error) => console.log(error));
};

const submitStartTurn = () => {
  const gameId = getDocumentCookie('gameId');
  axios.post(`/start-turn/${gameId}`)
    .then((response) => {
      // !! TODO: ADD TIMER -------------------------------- !! !! !! !! !!
      console.log('card info', response.data);
      updateCardInfo(response.data);
      changeDisplay(clueGiverDiv).hide();
      changeDisplay(cardViewDiv).show();
    });
};

const submitSkipCard = () => {
  const gameId = getDocumentCookie('gameId');
  axios.post('/skip-card', { gameId })
    .then((response) => {
      console.log('card info', response.data);
      updateCardInfo(response.data);
    });
};

const submitGuessedCard = () => {
  const gameId = getDocumentCookie('gameId');
  axios.post('/guessed-card', { gameId })
    .then((response) => {
      console.log('card info', response.data);
      // if still have cards in deck
      if (response.data.cards) { updateCardInfo(response.data.cards); }

      // if no more cards in deck (ie round is over)
      else {
        const {
          currentRound: nextRound,
          score,
          teams,
        } = response.data;

        updateRoundOverDiv(nextRound, score, teams);
        changeDisplay(cardViewDiv).hide();
        changeDisplay(roundOverDiv).show();

        currentRound = nextRound;
      }
    });
};

const submitCheckGameStatus = () => {
  const gameId = getDocumentCookie('gameId');
  axios.post(`/check-game-status/${gameId}`)
    .then((response) => {
      console.log('round & team info', response.data);
      if (currentTeam.id !== response.data.currentTeam.id) {
        const {
          currentRound: nextRound,
          score,
          teams,
        } = response.data;

        updateRoundOverDiv(nextRound, score, teams);
        changeDisplay(guesserDiv).hide();
        changeDisplay(waitingTeamDiv).hide();
        changeDisplay(roundOverDiv).show();

        currentRound = nextRound;
        Object.entries(response.data.currentTeam)
          .forEach(([key, value]) => {
            currentTeam[key] = value;
          });
      }
    });
};

const submitStartNewRound = () => {
  const gameId = getDocumentCookie('gameId');
  axios.post(`/check-game-status/${gameId}`)
    .then((response) => {
      console.log('round & team info', response.data);
      currentRound = response.data.currentRound;
      Object.entries(response.data.currentTeam).forEach(([key, value]) => {
        currentTeam[key] = value;
      });

      const role = checkRoleForCurrentTurn(currentTeam);
      changeDisplay(gameLobbyDiv).hide();
      changeDisplay(roundOverDiv).hide();
      changeDisplay(showScoreDiv).hide();
      switch (role) {
        case CLUEGIVER:
          changeDisplay(guesserDiv).hide();
          changeDisplay(waitingTeamDiv).hide();
          changeDisplay(clueGiverDiv).show();
          break;
        case GUESSER:
          changeDisplay(clueGiverDiv).hide();
          changeDisplay(waitingTeamDiv).hide();
          changeDisplay(guesserDiv).show();
          break;
        default: // waiting team
          changeDisplay(clueGiverDiv).hide();
          changeDisplay(guesserDiv).hide();
          changeDisplay(waitingTeamDiv).show();
          break;
      }
    });
};

// ############## DOM MANIPULATION ##############

gameLobbyStartGameBtn.onclick = submitStartGameplay;
startTurnBtn.onclick = submitStartTurn;
skipCardBtn.onclick = submitSkipCard;
guessedCardBtn.onclick = submitGuessedCard;
guesserNextBtn.onclick = submitCheckGameStatus;
waitingTeamNextBtn.onclick = submitCheckGameStatus;
endRoundStartNextBtn.onclick = submitStartNewRound;
endGameGoHomeBtn.onclick = () => {
  changeDisplay(showScoreDiv).hide();
  changeDisplay(gameSetupSectionDiv).show();
  changeDisplay(gameSetupDiv).show();
};
