import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';
import initCardsModel from './card.mjs';
import initUsersModel from './user.mjs';
import initTeamsModel from './team.mjs';
import initGamesModel from './game.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

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
