export default function initCardsModel(sequelize, DataTypes) {
  return sequelize.define('card',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isAlphanumeric: true,
          notEmpty: true,
        },
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isAlphanumeric: true,
          // notEmpty: true,
        },
      },
      points: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      tableName: 'cards',
      underscored: true,
    });
}
