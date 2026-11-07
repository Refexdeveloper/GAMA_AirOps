const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersDesignation extends Model {
    static associate(models) {
      MastersDesignation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      MastersDesignation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
    }
  }
  MastersDesignation.init(
    {
      designation: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      crew_type: {
        type: DataTypes.STRING(100),
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
      modelName: "MastersDesignation",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersDesignation;
};
