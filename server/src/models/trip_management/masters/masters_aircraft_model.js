const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersAircraftModel extends Model {
    static associate(models) {
      MastersAircraftModel.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      MastersAircraftModel.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
      MastersAircraftModel.belongsTo(models.MastersAirport, {
        foreignKey: "base_location",
        as: "base_airport",
      });
      MastersAircraftModel.belongsTo(models.MastersAircraftImage, {
        foreignKey: "image_id",
        as: "images",
      });
    }
  }
  MastersAircraftModel.init(
    {
      aircraft_manufacture: {
        type: DataTypes.STRING(45),
        defaultValue: null,
      },
      aircraft_model: {
        type: DataTypes.STRING(45),
        defaultValue: null,
      },
      aircraft_type: {
        type: DataTypes.STRING(45),
        defaultValue: null,
      },
      wing_type: {
        type: DataTypes.STRING(45),
        defaultValue: null,
      },
      pilots: DataTypes.INTEGER,
      seats: DataTypes.INTEGER,
      baggages_capacity: DataTypes.STRING(25),
      aircraft_attendant_availability: DataTypes.BOOLEAN,
      wifi_availability: DataTypes.BOOLEAN,
      satellite_phone: DataTypes.BOOLEAN,
      lavatory: DataTypes.BOOLEAN,
      cabin_height: DataTypes.FLOAT,
      cabin_width: DataTypes.FLOAT,
      cabin_length: DataTypes.FLOAT,
      period_of_manufacture: DataTypes.STRING(45),
      length: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      wingspan: DataTypes.FLOAT,
      empty_weight: DataTypes.INTEGER,
      max_take_of_weight: DataTypes.INTEGER,
      max_payload: DataTypes.INTEGER,
      fuel_capacity: DataTypes.INTEGER,
      engine: DataTypes.INTEGER,
      engine_model: DataTypes.STRING(45),
      max_cruising_speed: DataTypes.FLOAT,
      runway_length: DataTypes.INTEGER,
      max_ceiling: DataTypes.INTEGER,
      range: DataTypes.INTEGER,
      aircraft_per_hour_cost: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      base_location: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      image_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
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
      modelName: "MastersAircraftModel",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersAircraftModel;
};
