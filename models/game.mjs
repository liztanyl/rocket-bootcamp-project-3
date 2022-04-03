export default function initGamesModel(sequelize, DataTypes) {
  return sequelize.define('game',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      card_piles: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      game_state: {
        allowNull: false,
        type: DataTypes.JSON,
      },
    },
    {
      tableName: 'games',
      underscored: true,
    });
}
