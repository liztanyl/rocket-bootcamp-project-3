export default function initTeamsModel(sequelize, DataTypes) {
  return sequelize.define('team',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      gameId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
    },
    {
      tableName: 'teams',
      underscored: true,
    });
}
