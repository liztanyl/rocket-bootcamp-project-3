const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (cardDeck) => {
  let currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    const randomIndex = getRandomIndex(cardDeck.length);
    const randomCard = cardDeck[randomIndex];
    const currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex += 1;
  }
  return cardDeck;
};

const updateScoreAndCardPiles = (deck, team1CardPile, team2CardPile, score) => {
  const currentRoundScore = [0, 0];
  team1CardPile.forEach((card) => {
    currentRoundScore[0] += card.points;
    deck.push(card);
  });
  team2CardPile.forEach((card) => {
    currentRoundScore[1] += card.points;
    deck.push(card);
  });

  shuffleCards(deck);
  team1CardPile.length = 0;
  team2CardPile.length = 0;

  score[0] += currentRoundScore[0];
  score[1] += currentRoundScore[1];
};

export default function initGamesController(db) {
  const create = async (req, res) => {
    res.clearCookie('gameId')
      .clearCookie('teamId');
    const { team1name, team2name } = req.body;
    try {
      // get all cards from db, shuffle, slice and insert as card_piles.deck
      const deckSize = 10;
      const cards = await db.Card.findAll();
      const deck = shuffleCards(cards).slice(0, deckSize);

      // initialise cardPiles and gameState objects
      const cardPiles = {
        deck,
        team1: [],
        team2: [],
      };
      const gameState = {
        current_round: 1,
        current_team: 0,
        score: [0, 0],
        team1_userids: [],
        team2_userids: [],
      };

      // create game with cardPiles and gameState
      // create teams and associate with game
      const game = await db.Game.create({
        card_piles: cardPiles,
        game_state: gameState,
        teams: [
          { name: team1name },
          { name: team2name },
        ],
      },
      {
        include: db.Team,
      });

      // ------------------------------
      // getting data from returned game:
      // id: game.id
      // card piles: game.card_piles
      // game state: game.game_state
      // teams: game.teams (arr)
      // team ids: game.teams[0].id, game.teams[1].id ||
      //           game.game_state.teams_ids (after update)
      // team names: game.teams[0].name, game.teams[1].name
      // ------------------------------

      // send game id, team id and team names
      const dataToClient = {
        gameId: game.id,
        teams: game.teams,
      };
      res.cookie(`gameId=${game.id};`);
      res.send(dataToClient);
    } catch (error) {
      console.log(error.message);
      res.send(error);
    }
  };

  const join = async (req, res) => {
    res.clearCookie('gameId')
      .clearCookie('teamId');
    const { gameId } = req.body;
    const game = await db.Game.findByPk(gameId, { include: db.Team });
    // eslint-disable-next-line no-unused-expressions
    if (game === null) {
      res.send({ error: 'Game doesn\'t exist.' });
      return;
    }
    if (game.game_state.current_round === 0) {
      res.send({ error: 'Game has ended.' });
      return;
    }
    const { teams } = game;
    const dataToClient = teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        gameId: team.gameId,
      }))
      .sort((a, b) => a.id - b.id);
    res.cookie(`gameId=${gameId};`);
    res.send(dataToClient);
  };

  const chooseTeam = async (req, res) => {
    const { userId, gameId, teamId } = req.body;
    console.log(teamId, userId);
    try {
      // find user and if he is in a team from this game
      const user = await db.User.findByPk(userId, {
        include: {
          model: db.Team,
          include: {
            model: db.Game,
            where: { id: gameId },
          },
        },
      });

      // if user hasn't joined a team from this game yet
      if (user.teams.length === 0) {
        await user.addTeam(teamId);
      }
      // if user is already part of the opposing team in this game,
      // update the association
      // (shouldn't be the case, code here serves as validation in case cookies were changed)
      else if (user.teams[0].id !== teamId) {
        await user.removeTeam(user.teams[0]);
        await user.addTeam(teamId);
      }

      // get updated user info
      const updatedUser = await db.User.findByPk(userId, {
        include: {
          model: db.Team,
          include: {
            model: db.Game,
            where: { id: gameId },
          },
        },
      });
      const dataToClient = {
        teamName: updatedUser.teams[0].name,
      };
      res.cookie(`teamId=${updatedUser.teams[0].id};`);
      res.send(dataToClient);
    } catch (error) {
      console.log(error.message);
    }
  };

  const startGame = async (req, res) => {
    const { gameId } = req.body;

    // find game, its teams and their users
    const game = await db.Game.findByPk(gameId, {
      include: {
        model: db.Team,
        include: {
          model: db.User,
        },
      },
    });

    const { game_state: gameState, teams } = game;
    teams.sort((a, b) => a.id - b.id);
    // update game with each team's userids
    gameState.team1_userids = teams[0]?.users.map((user) => user.id);
    gameState.team2_userids = teams[1]?.users.map((user) => user.id);
    await db.Game.update({ game_state: gameState }, { where: { id: gameId } });

    // prepare info about current team to send to client
    const teamsData = teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        gameId: team.gameId,
      }));
    const currentTeamIndex = gameState.current_team;
    const currentTeam = {
      id: teamsData[currentTeamIndex].id,
      name: teamsData[currentTeamIndex].name,
      userIds: currentTeamIndex === 0
        ? gameState.team1_userids
        : gameState.team2_userids,
    };

    const dataToClient = {
      currentRound: gameState.current_round,
      currentTeam,
    };
    res.send(dataToClient);
  };

  const startTurn = async (req, res) => {
    const gameId = req.params.id;

    // destructuring: taking deck from card_piles from game
    const { card_piles: { deck } } = await db.Game.findByPk(gameId);

    const dataToClient = {
      cardName: deck[0].name,
      cardDescription: deck[0].description,
      cardPoints: deck[0].points,
    };
    res.send(dataToClient);
  };

  const skipCard = async (req, res) => {
    const gameId = req.params.id;

    // retrieve cardpiles (as obj so can update game later)
    const { card_piles: cardPiles } = await db.Game.findByPk(gameId);

    // update the deck (first card goes to the end)
    const { deck } = cardPiles;
    deck.push(deck.shift());
    cardPiles.deck = deck;

    await db.Game.update({ card_piles: cardPiles }, { where: { id: gameId } });

    const dataToClient = {
      cardName: deck[0].name,
      cardDescription: deck[0].description,
      cardPoints: deck[0].points,
    };
    res.send(dataToClient);
  };

  const guessedCard = async (req, res) => {
    const gameId = req.params.id;

    // retrieve cardpiles & gamestate (as obj so can update game later)
    const {
      card_piles: { deck, team1: team1cards, team2: team2cards },
      game_state: gameState,
      teams,
    } = await db.Game.findByPk(gameId, { include: db.Team });

    let {
      current_round: currentRound,
      current_team: currentTeam,
    } = gameState;
    const {
      score,
      team1_userids: team1UserIds,
      team2_userids: team2UserIds,
    } = gameState;

    currentTeam === 0
      ? team1cards.push(deck.shift())
      : team2cards.push(deck.shift());

    const dataToClient = {};

    if (deck.length > 0) {
      await db.Game.update({
        card_piles: { deck, team1: team1cards, team2: team2cards },
      }, { where: { id: gameId } });

      dataToClient.cards = {
        cardName: deck[0].name,
        cardDescription: deck[0].description,
        cardPoints: deck[0].points,
      };
      res.send(dataToClient);
    }
    // if no more cards in deck (round over)
    else {
      // calculate score and update card piles
      updateScoreAndCardPiles(deck, team1cards, team2cards, score);

      // update gameState
      // if currentRound = 3 (last round), reset to 0; if not, increment
      currentRound === 3
        ? currentRound = 0
        : currentRound += 1;

      // change user for currentTeam
      currentTeam === 0
        ? team1UserIds.push(team1UserIds.shift())
        : team2UserIds.push(team2UserIds.shift());

      // if currentTeam = 0, change to 1
      currentTeam = currentTeam === 0 ? 1 : 0;

      await db.Game.update({
        card_piles: {
          deck,
          team1: team1cards,
          team2: team2cards,
        },
        game_state: {
          current_round: currentRound,
          current_team: currentTeam,
          score,
          team1_userids: team1UserIds,
          team2_userids: team2UserIds,
        },
      }, { where: { id: gameId } });

      dataToClient.currentRound = currentRound;
      dataToClient.score = score;
      dataToClient.teams = teams
        .map((team) => ({
          id: team.id,
          name: team.name,
          gameId: team.gameId,
        }))
        .sort((a, b) => a.id - b.id);

      res.send(dataToClient);
    }
  };

  const endTurn = async (req, res) => {
    // get game info
    const gameId = req.params.id;

    // retrieve cardpiles & gamestate (as objs so can update game later)
    const {
      card_piles: cardPiles,
      game_state: gameState,
      teams,
    } = await db.Game.findByPk(gameId, { include: db.Team });

    const { deck } = cardPiles;
    let { current_team: currentTeamIndex } = gameState;
    const {
      currentRound,
      score,
      team1_userids: team1UserIds,
      team2_userids: team2UserIds,
    } = gameState;

    // card that was open when timer ran out stays in deck (goes to end)
    deck.push(deck.shift());

    const previousTeamIndex = currentTeamIndex;

    // rotate player order
    currentTeamIndex === 0
      ? team1UserIds.push(team1UserIds.shift())
      : team2UserIds.push(team2UserIds.shift());

    // alternate teams
    currentTeamIndex = currentTeamIndex === 0 ? 1 : 0;

    // update game info
    cardPiles.deck = deck;
    gameState.current_team = currentTeamIndex;
    gameState.team1_userids = team1UserIds;
    gameState.team2_userids = team2UserIds;

    await db.Game.update({
      card_piles: cardPiles,
      game_state: gameState,
    }, { where: { id: gameId } });

    const teamsData = teams
      .map((team) => ({
        id: team.id,
        name: team.name,
      }))
      .sort((a, b) => a.id - b.id);

    const currentTeam = {
      id: teamsData[currentTeamIndex].id,
      name: teamsData[currentTeamIndex].name,
      userIds: currentTeamIndex === 0
        ? gameState.team1_userids
        : gameState.team2_userids,
    };

    const dataToClient = {
      currentRound,
      score,
      previousTeamIndex,
      currentTeamIndex,
      teams: teamsData,
      currentTeam,
    };
    res.send(dataToClient);
  };

  const checkGameStatus = async (req, res) => {
    const gameId = req.params.id;

    // find game, its teams and their users
    const game = await db.Game.findByPk(gameId, {
      include: {
        model: db.Team,
        include: {
          model: db.User,
        },
      },
    });

    // prepare info about current team to send to client
    const {
      card_piles: {
        deck,
        team1: team1cards,
        team2: team2cards,
      },
      game_state: gameState, teams,
    } = game;

    const currentTeamIndex = gameState.current_team;
    const previousTeamIndex = currentTeamIndex === 0 ? 1 : 0;

    const teamsData = teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        gameId: team.gameId,
      }))
      .sort((a, b) => a.id - b.id);

    const currentTeam = {
      id: teamsData[currentTeamIndex].id,
      name: teamsData[currentTeamIndex].name,
      userIds: currentTeamIndex === 0
        ? gameState.team1_userids
        : gameState.team2_userids,
    };

    updateScoreAndCardPiles(deck, team1cards, team2cards, gameState.score);

    const dataToClient = {
      currentRound: gameState.current_round,
      score: gameState.score,
      previousTeamIndex,
      currentTeamIndex,
      teams: teamsData,
      currentTeam,
    };
    if (gameState.current_round === 0) res.clearCookie('gameId').clearCookie('teamId');
    res.send(dataToClient);
  };

  return {
    create,
    join,
    chooseTeam,
    startGame,
    startTurn,
    skipCard,
    guessedCard,
    endTurn,
    checkGameStatus,
  };
}
