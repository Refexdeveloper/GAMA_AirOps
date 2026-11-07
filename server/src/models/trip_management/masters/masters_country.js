const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MastersCountry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MastersCountry.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      MastersCountry.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
    }
  }
  MastersCountry.init(
    {
      country_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

       time_formate: {
        type: DataTypes.STRING(5),
  
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
      modelName: "MastersCountry",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersCountry;
};
