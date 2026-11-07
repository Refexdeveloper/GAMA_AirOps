const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersOperator extends Model {
    static associate(models) {
      MastersOperator.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      MastersOperator.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
    }
  }
  MastersOperator.init(
    {
      operator_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MastersOperator",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersOperator;
};
