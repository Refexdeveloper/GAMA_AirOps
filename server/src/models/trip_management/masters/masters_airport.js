const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersAirport extends Model {
    static associate(models) {
      MastersAirport.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      MastersAirport.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
      MastersAirport.belongsTo(models.MastersCity, {
        foreignKey: "city_id",
        as: "city",
      });
      MastersAirport.belongsTo(models.MastersCountry, {
        foreignKey: "country_id",
        as: "country",
      });
    }
  }
  MastersAirport.init(
    {
      airport_name: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      iata_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      icao_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        defaultValue: null,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        defaultValue: null,
      },
      address: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      remark: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      critical_airport: {
        type: DataTypes.TINYINT,
        defaultValue: null,
      },
      alertable_airport: {
        type: DataTypes.TINYINT,
        defaultValue: null,
      },
      airport_handling_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      ground_handling_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
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
      modelName: "MastersAirport",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersAirport;
};
