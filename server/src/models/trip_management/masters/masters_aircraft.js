const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersAircraft extends Model {
    static associate(models) {
      MastersAircraft.belongsTo(models.MastersOperator, {
        foreignKey: "operator_id",
        as: "operator",
      });
      MastersAircraft.belongsTo(models.MastersAircraftModel, {
        foreignKey: "model_id",
        as: "model",
      });
      MastersAircraft.belongsTo(models.MastersAirport, {
        foreignKey: "last_arrival",
        as: "last_arrival_airport",
      });
      MastersAircraft.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      MastersAircraft.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  MastersAircraft.init(
    {
      operator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reg_no: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      min_cabin_crew: DataTypes.INTEGER,
      min_flight_crew: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_of_captain: DataTypes.INTEGER,
      no_of_fo: DataTypes.INTEGER,
      no_of_fe: DataTypes.INTEGER,
      c_cls_capacity: DataTypes.INTEGER,
      y_cls_capacity: DataTypes.INTEGER,
      seating_capacity: DataTypes.INTEGER,
      cruising_speed: DataTypes.FLOAT,
      time_format: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      local_time: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      utc_time: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      block_opening_hrs: DataTypes.TIME,
      time_in_air_opening_hrs: DataTypes.TIME,
      not_in_service: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      not_in_service_from: DataTypes.DATE,
      freight_capacity: DataTypes.FLOAT,
      unit: DataTypes.STRING(45),
      last_arrival: DataTypes.INTEGER,
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
      modelName: "MastersAircraft",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersAircraft;
};
