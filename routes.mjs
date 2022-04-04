import { resolve } from 'path';
import db from './models/index.mjs';

// import your controllers here
// import initBugsController from './controllers/bugs.mjs';
import initUsersController from './controllers/users.mjs';
import initGamesController from './controllers/games.mjs';

export default function bindRoutes(app) {
  // initialize the controller functions here
  // pass in the db for all callbacks
  // const bugsController = initBugsController(db);
  const usersController = initUsersController(db);
  const gamesController = initGamesController(db);

  // define your route matchers here using app
  app.get('/', (req, res) => {
    res.sendFile(resolve('dist', 'main.html'));
  });
  app.post('/signup', usersController.create);
  app.post('/login', usersController.login);
  app.post('/create-game', gamesController.create);
  app.post('/choose-team', gamesController.chooseTeam);
  app.post('/join-game', gamesController.join);
  app.post('/start-game', gamesController.startGame);
  app.post('/start-turn/:id', gamesController.startTurn);
  app.post('/skip-card/:id', gamesController.skipCard);
  app.post('/guessed-card/:id', gamesController.guessedCard);
  app.post('/end-turn/:id', gamesController.endTurn);
  app.post('/check-game-status/:id', gamesController.checkGameStatus);
}
