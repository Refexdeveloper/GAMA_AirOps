const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersCity extends Model {
    static associate(models) {
      MastersCity.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      MastersCity.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
      MastersCity.belongsTo(models.MastersZone, {
        foreignKey: "zone_id",
        as: "zone",
      });
      MastersCity.belongsTo(models.MastersCountry, {
        foreignKey: "country_id",
        as: "country",
      });
    }
  }
  MastersCity.init(
    {
      city_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
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
      modelName: "MastersCity",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersCity;
};
