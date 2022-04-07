import { Sequelize } from 'sequelize';
import url from 'url'; //

import allConfig from '../config/config.js';
import initCardsModel from './card.mjs';
import initUsersModel from './user.mjs';
import initTeamsModel from './team.mjs';
import initGamesModel from './game.mjs';

const env = process.env.NODE_ENV || 'development';
console.log(env);
const config = allConfig[env];
const db = {};
let sequelize; //

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  console.log('in production');
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}
// If env is not production, retrieve DB auth details from the config
else {
  console.log('not production');
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Card = initCardsModel(sequelize, Sequelize.DataTypes);
db.User = initUsersModel(sequelize, Sequelize.DataTypes);
db.Team = initTeamsModel(sequelize, Sequelize.DataTypes);
db.Game = initGamesModel(sequelize, Sequelize.DataTypes);

db.Team.belongsTo(db.Game);
db.Game.hasMany(db.Team);

db.User.belongsToMany(db.Team, { through: 'users_teams' });
db.Team.belongsToMany(db.User, { through: 'users_teams' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
